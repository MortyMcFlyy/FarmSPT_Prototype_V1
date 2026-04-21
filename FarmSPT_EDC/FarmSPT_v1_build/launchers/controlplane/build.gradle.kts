plugins {
    `java-library`
    id("application")
    alias(libs.plugins.shadow)
}

dependencies {
    implementation("org.eclipse.edc:control-plane-core:0.15.1")
    implementation("org.eclipse.edc:management-api:0.15.1")
    implementation("org.eclipse.edc:dsp:0.15.1")
    implementation("org.eclipse.edc:asset-index-sql:0.15.1")
    implementation("org.eclipse.edc:contract-definition-store-sql:0.15.1")
    implementation("org.eclipse.edc:contract-negotiation-store-sql:0.15.1")
    implementation("org.eclipse.edc:policy-definition-store-sql:0.15.1")
    implementation("org.eclipse.edc:transfer-process-store-sql:0.15.1")
    implementation("org.eclipse.edc:edr-index-sql:0.15.1")
    implementation("org.eclipse.edc:vault-memory:0.15.1")
    implementation("com.h2database:h2:2.2.220")
}

tasks.shadowJar {
    duplicatesStrategy = DuplicatesStrategy.INCLUDE
    mergeServiceFiles()
    archiveFileName.set("${project.name}.jar")
}

application {
    mainClass.set("org.eclipse.edc.boot.system.runtime.BaseRuntime")
}