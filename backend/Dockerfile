# ─────────────────────────────────────────────────────────────────────────────
# Dockerfile (BACKEND)
# Place this file inside your backend/ folder (same level as pom.xml).
#
# TWO-STAGE BUILD:
#   Stage 1 (builder) — uses Maven + Java 21 to compile the code into a .jar
#   Stage 2 (runner)  — uses a lightweight Java 21 image to run the .jar
#
# Two stages keeps the final image small — we don't need Maven in production.
# ─────────────────────────────────────────────────────────────────────────────

# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM maven:3.9.6-eclipse-temurin-21 AS builder

# Set working directory inside the container
WORKDIR /app

# Copy pom.xml first and download dependencies
# This is cached by Docker — if pom.xml hasn't changed, this step is skipped
COPY pom.xml .
RUN mvn dependency:go-offline -q

# Copy the rest of the source code
COPY src ./src

# Compile and package into a .jar file, skipping tests
RUN mvn clean package -DskipTests

# ── Stage 2: Run ──────────────────────────────────────────────────────────────
FROM eclipse-temurin:21-jre-alpine

# Set working directory
WORKDIR /app

# Copy only the compiled .jar from the builder stage
COPY --from=builder /app/target/*.jar app.jar

# Render sets the PORT environment variable automatically
# Spring Boot reads it via ${PORT:8080} in application.properties
EXPOSE 8080

# Start the Spring Boot application
ENTRYPOINT ["java", "-jar", "app.jar"]
