# Zooner Web API (.NET Backend)

ASP.NET Core Web API backend for the Zooner local product discovery and retailer platform, featuring JWT-based authentication, token rotation, and EF Core SQLite persistence.

## Features
- **Registration**: Email and password account creation with BCrypt password hashing.
- **Sign In / Login**: Issue cryptographically signed JWT access tokens and secure refresh tokens.
- **Sign Out / Logout**: Invalidate active refresh tokens and clear HTTP-only cookies.
- **Token Refresh**: Seamless session renewal via rotating refresh tokens.
- **Protected Endpoints**: Role and JWT claim-based authorization (`/api/auth/me`).
- **Interactive OpenAPI/Swagger**: Built-in Swagger UI with Bearer Authentication support.
- **CORS Support**: Pre-configured for Vite/React frontend (`http://localhost:5173`).

## Project Structure
```
server/
├── Zooner.sln
└── Zooner.Api/
    ├── Controllers/
    │   └── AuthController.cs
    ├── Data/
    │   └── AppDbContext.cs
    ├── Models/
    │   ├── User.cs
    │   ├── RefreshToken.cs
    │   └── DTOs/
    │       ├── ApiResponse.cs
    │       └── AuthDtos.cs
    ├── Services/
    │   ├── IAuthService.cs
    │   ├── AuthService.cs
    │   ├── ITokenService.cs
    │   └── TokenService.cs
    ├── Program.cs
    ├── appsettings.json
    └── Zooner.Api.csproj
```

## Running the Backend

### Prerequisites
- .NET SDK (installed on machine: .NET 9 SDK; ready for .NET 10 SDK)

### Start API
```bash
cd server/Zooner.Api
dotnet run
```
The API will start at:
- **HTTP**: `http://localhost:5000`
- **Swagger UI**: `http://localhost:5000/swagger`

### Upgrading to .NET 10
Once the .NET 10 SDK is installed on your machine, you can update `server/Zooner.Api/Zooner.Api.csproj`:
Change:
```xml
<TargetFramework>net9.0</TargetFramework>
```
To:
```xml
<TargetFramework>net10.0</TargetFramework>
```
and run `dotnet build`.

## API Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user account | No |
| `POST` | `/api/auth/login` | Sign in & receive JWT + Refresh Token | No |
| `POST` | `/api/auth/logout` | Sign out & revoke token | No |
| `POST` | `/api/auth/refresh-token` | Renew access token | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | **Yes (Bearer JWT)** |
