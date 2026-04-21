plugins {
    `java-library`
    id("application")
    alias(libs.plugins.shadow)
}

dependencies {
    implementation("org.eclipse.edc:data-plane-core:0.15.1")
    implementation("org.eclipse.edc:data-plane-http:0.15.1")
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