# Stage 1: Build Spring Boot jar
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copy Maven files
COPY pom.xml .
COPY src ./src

# Build the jar without tests
RUN mvn clean package -DskipTests

# Stage 2: Run jar
FROM eclipse-temurin:21-jre
WORKDIR /app

# Copy the jar from build stage
COPY --from=build /app/target/*.jar app.jar

# Expose backend port
EXPOSE 8085

# Run the jar
ENTRYPOINT ["java", "-jar", "app.jar"]
