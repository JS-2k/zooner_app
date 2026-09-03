# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy project files and restore dependencies
COPY ["Zooner.Api/Zooner.Api.csproj", "Zooner.Api/"]
RUN dotnet restore "Zooner.Api/Zooner.Api.csproj"

# Copy source code and build
COPY . .
WORKDIR "/src/Zooner.Api"
RUN dotnet publish "Zooner.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app

EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "Zooner.Api.dll"]
