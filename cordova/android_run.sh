#!/bin/sh
export ANDROID_SDK_ROOT=/home/maxmars/Android/Sdk
export PATH=/home/maxmars/Android/Sdk/build-tools/33.0.2/:/home/maxmars/Android/Sdk/platform-tools:/home/maxmars/Android/Sdk/tools:/home/maxmars/Android/gradle-7.3.3/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin:/snap/bin:/home/maxmars/.dotnet/tools:/home/maxmars/bin:/opt/mssql-tools/bin:/usr/lib/jvm/java-11-openjdk-amd64/bin:/home/maxmars/.dotnet/tools:/home/maxmars/bin:/opt/mssql-tools/bin:/usr/lib/jvm/java-11-openjdk-amd64/bin:/opt/mssql-tools/bin:/usr/lib/jvm/java-11-openjdk-amd64/bin
export ORG_GRADLE_PROJECT_cdvBuildToolsVersion=33.0.2
cordova run android --device
