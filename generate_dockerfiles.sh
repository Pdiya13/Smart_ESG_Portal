#!/bin/bash
services=(
    "auth_service:8081"
    "core_service:8082"
    "report_service:8083"
    "api_gateway_service:8080"
    "eureka-server:8761"
)

for entry in "${services[@]}"; do
    service="${entry%%:*}"
    port="${entry##*:}"
    
    cat << DOCKERFILE > "$service/Dockerfile"
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
RUN ./mvnw dependency:go-offline || true
COPY src ./src
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE $port
ENTRYPOINT ["java", "-jar", "app.jar"]
DOCKERFILE
    echo "Created Dockerfile for $service"
done
