# ===== BUILD STAGE =====
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY . .
RUN mvn -q -DskipTests clean package

# ===== RUNTIME STAGE =====
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

# ENV bắt buộc
ENV EUREKA_DEFAULT_ZONE_URL=http://eureka-server:8061/eureka
ENV MYSQL_URL=jdbc:mysql://localhost:3306/arena_db
ENV MYSQL_USERNAME=root
ENV MYSQL_PASSWORD=password
ENV JAVA_OPTS=""

EXPOSE 8081
CMD ["sh", "-c", "java $JAVA_OPTS -jar app.jar --server.port=$PORT"]