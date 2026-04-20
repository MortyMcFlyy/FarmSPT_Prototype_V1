plugins {
    `java-library`
    id("application")
    id("com.github.johnrengelman.shadow") version "8.1.1"
}

repositories {
    mavenLocal()
    mavenCentral()
    maven {
        url = uri("https://oss.sonatype.org/content/repositories/snapshots")
    }
}

dependencies {
    // Core EDC Boot
    runtimeOnly("org.eclipse.edc:boot:0.6.1")
    runtimeOnly("org.eclipse.edc:configuration-filesystem:0.6.1")
    runtimeOnly("org.eclipse.edc:runtime-core:0.6.1")
    runtimeOnly("org.eclipse.edc:api-core:0.6.1")
    runtimeOnly("org.eclipse.edc:jersey-core:0.6.1")
    
    // Control Plane
    runtimeOnly("org.eclipse.edc:control-plane-core:0.6.1")
    runtimeOnly("org.eclipse.edc:control-plane-aggregate-services:0.6.1")
    runtimeOnly("org.eclipse.edc:management-api:0.6.1")
    runtimeOnly("org.eclipse.edc:management-api-configuration:0.6.1")
    runtimeOnly("org.eclipse.edc:dsp:0.6.1")
    
    // Database
    runtimeOnly("org.eclipse.edc:sql-core:0.6.1")
    runtimeOnly("org.eclipse.edc:datasources-sql:0.6.1")
    runtimeOnly("com.h2database:h2:2.2.220")
    
    // Vault
    runtimeOnly("org.eclipse.edc:vault-memory:0.6.1")
    
    // HTTP & JSON-LD
    runtimeOnly("org.eclipse.edc:http:0.6.1")
    runtimeOnly("org.eclipse.edc:json-ld:0.6.1")
}

tasks.shadowJar {
    duplicatesStrategy = DuplicatesStrategy.INCLUDE
    mergeServiceFiles()
    archiveFileName.set("${project.name}.jar")
}

application {
    mainClass.set("org.eclipse.edc.boot.system.runtime.BaseRuntime")
}