# Gradle을 이용한 Spring Boot 빌드 및 실행
FROM gradle:8.5-jdk17 AS builder
WORKDIR /app

# Gradle 캐시를 위한 의존성 파일들 먼저 복사
COPY build.gradle settings.gradle ./
COPY gradle gradle
COPY gradlew ./

# 의존성 다운로드 (레이어 캐싱 최적화)
RUN ./gradlew dependencies --no-daemon

# 소스코드 복사
COPY src src

RUN ./gradlew clean build --no-daemon -x test

FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1
ENTRYPOINT ["java", "-jar", "app.jar"]
