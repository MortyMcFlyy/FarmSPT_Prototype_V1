/*
 * FarmSPT EDC - Minimal Build Configuration
 */

import com.bmuschko.gradle.docker.tasks.image.DockerBuildImage

plugins {
    `java-library`
    id("com.bmuschko.docker-remote-api") version "10.0.0"
}

allprojects {
    group = "org.farmspt.edc"
    version = "1.0.0"
    
    repositories {
        mavenLocal()
        mavenCentral()
        maven {
            url = uri("https://oss.sonatype.org/content/repositories/snapshots")
        }
    }
}

subprojects {
    apply(plugin = "java")
    apply(plugin = "com.bmuschko.docker-remote-api")

    java {
        toolchain {
            languageVersion.set(JavaLanguageVersion.of(21))
        }
    }

    // Auto-Dockerize projects with Dockerfile
    afterEvaluate {
        if (file("${project.projectDir}/src/main/docker/Dockerfile").exists() &&
            tasks.findByName("shadowJar") != null
        ) {
            tasks.register("dockerize", DockerBuildImage::class) {
                val dockerContextDir = project.projectDir
                dockerFile.set(file("$dockerContextDir/src/main/docker/Dockerfile"))
                images.add("farmspt-edc/${project.name}:latest")
                images.add("farmspt-edc/${project.name}:${project.version}")
                buildArgs.put("JAR", "build/libs/${project.name}.jar")
                inputDir.set(file(dockerContextDir))
                dependsOn("shadowJar")
            }
        }
    }
}