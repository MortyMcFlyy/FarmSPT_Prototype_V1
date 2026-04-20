FROM eclipse-temurin:17-jre-alpine

ARG JAR
COPY ${JAR} /opt/edc/controlplane.jar

WORKDIR /opt/edc
EXPOSE 8080 8081

ENV EDC_CONNECTOR_NAME=ControlPlane
ENV EDC_VAULT_MEMORY_SECRET=test-secret

CMD ["java", "-jar", "controlplane.jar"]