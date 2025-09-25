@echo off
echo 🔧 FastBite Android Tools Installer
echo ===================================

echo.
echo This script will help you install the required tools for Android development.
echo.

echo 📋 Required Tools:
echo 1. Java JDK 11 or higher
echo 2. Android Studio
echo 3. Android SDK
echo 4. Node.js 16 or higher
echo.

echo 🔍 Checking current installation...

REM Check Node.js
echo.
echo Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js not found
    echo 📥 Please download and install Node.js from: https://nodejs.org/
    echo    Choose the LTS version (16 or higher)
) else (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo ✅ Node.js found: %NODE_VERSION%
)

REM Check Java
echo.
echo Checking Java...
java -version >nul 2>&1
if errorlevel 1 (
    echo ❌ Java not found
    echo 📥 Please download and install Java JDK from: https://adoptium.net/
    echo    Choose JDK 11 or higher
) else (
    echo ✅ Java found
    java -version 2>&1 | findstr "version"
)

REM Check Android Studio
echo.
echo Checking Android Studio...
if exist "%PROGRAMFILES%\Android\Android Studio\bin\studio64.exe" (
    echo ✅ Android Studio found in Program Files
) else if exist "%PROGRAMFILES(X86)%\Android\Android Studio\bin\studio64.exe" (
    echo ✅ Android Studio found in Program Files (x86)
) else if exist "%LOCALAPPDATA%\Android\Sdk" (
    echo ✅ Android SDK found in Local AppData
) else (
    echo ❌ Android Studio not found
    echo 📥 Please download and install Android Studio from: https://developer.android.com/studio
)

REM Check ANDROID_HOME
echo.
echo Checking ANDROID_HOME environment variable...
if "%ANDROID_HOME%"=="" (
    echo ❌ ANDROID_HOME not set
    echo.
    echo 📝 To set ANDROID_HOME:
    echo 1. Open System Properties ^> Advanced ^> Environment Variables
    echo 2. Add new system variable:
    echo    Name: ANDROID_HOME
    echo    Value: C:\Users\%USERNAME%\AppData\Local\Android\Sdk
    echo 3. Add to PATH: %%ANDROID_HOME%%\platform-tools;%%ANDROID_HOME%%\tools
    echo.
    echo Or run these commands in Command Prompt as Administrator:
    echo setx ANDROID_HOME "C:\Users\%USERNAME%\AppData\Local\Android\Sdk"
    echo setx PATH "%%PATH%%;%%ANDROID_HOME%%\platform-tools;%%ANDROID_HOME%%\tools"
) else (
    echo ✅ ANDROID_HOME: %ANDROID_HOME%
)

echo.
echo 📦 Installing React Native CLI...
npm install -g @react-native-community/cli
if errorlevel 1 (
    echo ⚠️  Warning: Could not install React Native CLI globally
    echo You may need to run: npm install -g @react-native-community/cli
) else (
    echo ✅ React Native CLI installed
)

echo.
echo 📦 Installing additional tools...
npm install -g @expo/cli
if errorlevel 1 (
    echo ⚠️  Warning: Could not install Expo CLI
) else (
    echo ✅ Expo CLI installed
)

echo.
echo 🎯 Next Steps:
echo 1. Install any missing tools above
echo 2. Set ANDROID_HOME environment variable if not set
echo 3. Restart your command prompt/terminal
echo 4. Run: node check-prerequisites.js
echo 5. Run: node setup-android-build.js
echo 6. Run: node build-apk.js

echo.
echo 📚 Helpful Links:
echo - Node.js: https://nodejs.org/
echo - Java JDK: https://adoptium.net/
echo - Android Studio: https://developer.android.com/studio
echo - React Native: https://reactnative.dev/docs/environment-setup

echo.
pause

