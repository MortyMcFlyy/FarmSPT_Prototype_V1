/*
 * FarmSPT EDC Settings
 */

pluginManagement {
    repositories {
        mavenLocal()
        gradlePluginPortal()
        mavenCentral()
    }
}

rootProject.name = "farmspt-edc"

// Launcher modules
include(":launchers:controlplane")
include(":launchers:dataplane")