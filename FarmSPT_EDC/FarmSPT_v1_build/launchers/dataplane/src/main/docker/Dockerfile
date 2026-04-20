FROM eclipse-temurin:17-jre-alpine

ARG JAR
COPY ${JAR} /opt/edc/dataplane.jar

WORKDIR /opt/edc
EXPOSE 8080

ENV EDC_CONNECTOR_NAME=DataPlane
ENV EDC_VAULT_MEMORY_SECRET=test-secret

CMD ["java", "-jar", "dataplane.jar"]