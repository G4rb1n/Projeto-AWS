# ---------- Etapa 1: build do jar com Maven ----------
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /build

# Copia so o pom primeiro para aproveitar o cache de dependencias entre builds
COPY pom.xml .
RUN mvn -B dependency:go-offline

COPY src ./src
RUN mvn -B clean package -DskipTests

# ---------- Etapa 2: runtime enxuto so com JRE ----------
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

RUN addgroup -S spring && adduser -S spring -G spring

COPY --from=build /build/target/zadinventory-0.0.1-SNAPSHOT.jar app.jar

USER spring
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
