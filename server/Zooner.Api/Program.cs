using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Zooner.Api.Data;
using Zooner.Api.Hubs;
using Zooner.Api.Models.DTOs;
using Zooner.Api.Services;
using Zooner.Api.Services.Background;
using Zooner.Api.Services.Realtime;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;

var builder = WebApplication.CreateBuilder(args);

// 1. Configure Database Provider (SqlServer, PostgreSql, or Sqlite)
var dbProvider = builder.Configuration["DatabaseProvider"] ?? "SqlServer";
var connectionString = dbProvider.Equals("SqlServer", StringComparison.OrdinalIgnoreCase)
    ? (builder.Configuration.GetConnectionString("SqlServer") ?? builder.Configuration.GetConnectionString("DefaultConnection"))
    : dbProvider.Equals("PostgreSql", StringComparison.OrdinalIgnoreCase)
        ? builder.Configuration.GetConnectionString("PostgreSql")
        : builder.Configuration.GetConnectionString("Sqlite") ?? "Data Source=locallive.db";

builder.Services.AddDbContext<AppDbContext>(options =>
{
    if (dbProvider.Equals("SqlServer", StringComparison.OrdinalIgnoreCase))
    {
        options.UseSqlServer(connectionString);
    }
    else if (dbProvider.Equals("PostgreSql", StringComparison.OrdinalIgnoreCase))
    {
        options.UseNpgsql(connectionString);
    }
    else
    {
        options.UseSqlite(connectionString);
    }
});

// 2. Register Application & Domain Services
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IShopService, ShopService>();
builder.Services.AddScoped<ILiveRequestService, LiveRequestService>();
builder.Services.AddScoped<IChatService, ChatService>();
builder.Services.AddScoped<INotificationService, NotificationService>();
builder.Services.AddScoped<IAdminService, AdminService>();
builder.Services.AddScoped<IRealtimeNotifier, SignalRRealtimeNotifier>();

// 3. Register Background Services
builder.Services.AddHostedService<RequestExpirationWorker>();

// 4. Configure SignalR for Realtime Communication
builder.Services.AddSignalR();

// 5. Configure JWT Authentication (Supporting HTTP Bearer and SignalR WebSockets)
var jwtKey = builder.Configuration["Jwt:Key"]
    ?? throw new InvalidOperationException("JWT Secret Key is not configured.");
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "LocalLiveApi";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "LocalLiveClient";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
        ValidateIssuer = true,
        ValidIssuer = jwtIssuer,
        ValidateAudience = true,
        ValidAudience = jwtAudience,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };

    // Extract JWT token from Query String for SignalR WebSocket connections
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            var accessToken = context.Request.Query["access_token"];
            var path = context.HttpContext.Request.Path;
            if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/hubs"))
            {
                context.Token = accessToken;
            }
            return Task.CompletedTask;
        }
    };
});

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
    options.AddPolicy("ShopOwnerOnly", policy => policy.RequireRole("ShopOwner", "Admin"));
});

// 6. Configure CORS
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
    ?? ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"];

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowClientApp", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// 7. Add Controllers & Swagger with Bearer Support
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "LocalLive Web API",
        Version = "v1",
        Description = "Hyperlocal Live Request & Available Shop Discovery Platform Backend"
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter JWT access token. Format: {token}"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// 8. Global Centralized Exception Handler
app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        context.Response.StatusCode = StatusCodes.Status500InternalServerError;
        context.Response.ContentType = "application/json";

        var exceptionHandlerPathFeature = context.Features.Get<IExceptionHandlerPathFeature>();
        var ex = exceptionHandlerPathFeature?.Error;

        var logger = context.RequestServices.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "Unhandled exception occurred while processing request.");

        var response = ApiResponse.Fail("An unexpected error occurred while processing your request.");
        await context.Response.WriteAsJsonAsync(response);
    });
});

// 9. Database Auto-Creation & Initial Data Seeding
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var logger = services.GetRequiredService<ILogger<Program>>();
    var dbContext = services.GetRequiredService<AppDbContext>();

    try
    {
        var dbCreator = dbContext.GetService<IRelationalDatabaseCreator>();
        if (dbCreator != null)
        {
            try
            {
                dbCreator.CreateTables();
            }
            catch
            {
                // Tables already exist or partially created
            }
        }
        await DbSeeder.SeedAsync(dbContext, logger);
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "An error occurred while creating or seeding the database.");
    }
}

// 10. HTTP Pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "LocalLive Web API v1");
        c.RoutePrefix = "swagger";
    });
}

app.UseCors("AllowClientApp");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<LiveHub>("/hubs/live");

app.Run();
