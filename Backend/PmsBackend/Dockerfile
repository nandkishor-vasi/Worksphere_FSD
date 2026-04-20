# ---------- BUILD STAGE ----------
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Cache dependencies
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy source and build
COPY src ./src
RUN mvn clean package -DskipTests


# ---------- RUNTIME STAGE ----------
FROM eclipse-temurin:21-jre
WORKDIR /app

# Copy jar
COPY --from=build /app/target/*.jar app.jar

# Render provides PORT env variable
ENV PORT=8080

# Expose (optional but good practice)
EXPOSE 8080

# Run app
ENTRYPOINT ["java", "-jar", "app.jar"]