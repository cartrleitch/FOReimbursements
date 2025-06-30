# See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

# This stage is used when running from VS in fast mode (Default for Debug configuration)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER $APP_UID
# only for testing purposes
USER root 
WORKDIR /app
EXPOSE 8080
EXPOSE 8081


# This stage is used to build the service project
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["RS25/RS25.csproj", "RS25/"]
RUN dotnet restore "./RS25/RS25.csproj"
COPY . .
WORKDIR "/src/RS25"
RUN dotnet build "./RS25.csproj" -c $BUILD_CONFIGURATION -o /app/build

# This stage is used to publish the service project to be copied to the final stage
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./RS25.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false
COPY RS25/efbundle /app/publish/efbundle

# This stage is used in production or when running from VS in regular mode (Default when not using the Debug configuration)
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
COPY --from=publish /app/publish/efbundle ./efbundle
RUN chmod +x ./efbundle
ENTRYPOINT ["dotnet", "RS25.dll"]