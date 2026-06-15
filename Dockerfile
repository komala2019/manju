# ============================================================================
# .NET 8 Web API Dockerfile for Cloud Deployments (Render / Railway / etc.)
# ============================================================================

# 1. Build Stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy project files and restore dependencies
COPY ["ManjuApi/ManjuApi.csproj", "ManjuApi/"]
RUN dotnet restore "ManjuApi/ManjuApi.csproj"

# Copy full source files and compile
COPY . .
WORKDIR "/src/ManjuApi"
RUN dotnet build "ManjuApi.csproj" -c Release -o /app/build

# 2. Publish Stage
FROM build AS publish
RUN dotnet publish "ManjuApi.csproj" -c Release -o /app/publish /p:UseAppHost=false

# 3. Final Runtime Stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Expose the default ASP.NET 8 container port (8080)
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "ManjuApi.dll"]
