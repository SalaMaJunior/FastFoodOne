@echo off
echo 🚀 FastBite APK Build Script for Windows
echo ========================================

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: Please run this script from the customer-app directory
    pause
    exit /b 1
)

REM Check if Android directory exists
if not exist "android" (
    echo ❌ Error: Android directory not found
    echo Please run "npx react-native init" first
    pause
    exit /b 1
)

echo.
echo 🔍 Checking prerequisites...

REM Check if Java is installed
java -version >nul 2>&1
if errorlevel 1 (
    echo ❌ Java is not installed. Please install Java JDK 11 or higher
    echo Download from: https://adoptium.net/
    pause
    exit /b 1
)

REM Check if ANDROID_HOME is set
if "%ANDROID_HOME%"=="" (
    echo ❌ ANDROID_HOME environment variable is not set
    echo Please set ANDROID_HOME to your Android SDK path
    echo Example: set ANDROID_HOME=C:\Users\%USERNAME%\AppData\Local\Android\Sdk
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed

echo.
echo 📦 Installing dependencies...
call npm install
if errorlevel 1 (
    echo ❌ Error installing dependencies
    pause
    exit /b 1
)

echo.
echo 🧹 Cleaning previous builds...
cd android
call gradlew clean
if errorlevel 1 (
    echo ❌ Error cleaning builds
    pause
    exit /b 1
)

echo.
echo 🔑 Checking debug keystore...
if not exist "app\debug.keystore" (
    echo Generating debug keystore...
    keytool -genkey -v -keystore app\debug.keystore -alias androiddebugkey -keyalg RSA -keysize 2048 -validity 10000 -storepass android -keypass android -dname "CN=Android Debug,O=Android,C=US"
    if errorlevel 1 (
        echo ❌ Error generating keystore
        pause
        exit /b 1
    )
)

echo.
echo 🏗️ Building debug APK...
call gradlew assembleDebug
if errorlevel 1 (
    echo ❌ Error building APK
    pause
    exit /b 1
)

cd ..

echo.
echo 🔍 Checking if APK was created...
if exist "android\app\build\outputs\apk\debug\app-debug.apk" (
    echo.
    echo 🎉 APK build completed successfully!
    echo 📱 APK location: android\app\build\outputs\apk\debug\app-debug.apk
    
    REM Get file size
    for %%A in ("android\app\build\outputs\apk\debug\app-debug.apk") do set size=%%~zA
    set /a sizeMB=%size%/1024/1024
    echo 📏 APK size: %sizeMB% MB
    
    REM Copy APK to root directory
    copy "android\app\build\outputs\apk\debug\app-debug.apk" "FastBite-Customer-Debug.apk" >nul
    echo 📋 APK copied to: FastBite-Customer-Debug.apk
    
    echo.
    echo 📱 Installation Instructions:
    echo 1. Enable "Unknown Sources" in your Android device settings
    echo 2. Transfer the APK file to your device
    echo 3. Tap the APK file to install
    echo 4. Grant necessary permissions when prompted
    
    echo.
    echo ✅ Build completed successfully!
    echo 📱 Your APK is ready for installation!
    
) else (
    echo ❌ APK file not found. Build may have failed.
    pause
    exit /b 1
)

echo.
pause

