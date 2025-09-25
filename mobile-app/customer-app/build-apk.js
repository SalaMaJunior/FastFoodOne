#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 FastBite APK Build Script');
console.log('============================');

// Check if we're in the right directory
if (!fs.existsSync('package.json')) {
  console.error('❌ Error: Please run this script from the customer-app directory');
  process.exit(1);
}

// Check if Android directory exists
if (!fs.existsSync('android')) {
  console.error('❌ Error: Android directory not found. Please run "npx react-native init" first');
  process.exit(1);
}

// Function to run commands
function runCommand(command, description) {
  console.log(`\n📦 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} completed successfully`);
  } catch (error) {
    console.error(`❌ Error during ${description}:`, error.message);
    process.exit(1);
  }
}

// Function to check if command exists
function commandExists(command) {
  try {
    execSync(`which ${command}`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

// Main build process
async function buildAPK() {
  try {
    console.log('\n🔍 Checking prerequisites...');
    
    // Check if Java is installed
    if (!commandExists('java')) {
      console.error('❌ Java is not installed. Please install Java JDK 11 or higher');
      process.exit(1);
    }
    
    // Check if Android SDK is available
    const androidHome = process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT;
    if (!androidHome) {
      console.error('❌ ANDROID_HOME environment variable is not set');
      console.log('Please set ANDROID_HOME to your Android SDK path');
      process.exit(1);
    }
    
    console.log('✅ Prerequisites check passed');
    
    // Install dependencies
    runCommand('npm install', 'Installing dependencies');
    
    // Clean previous builds
    runCommand('cd android && ./gradlew clean', 'Cleaning previous builds');
    
    // Generate debug keystore if it doesn't exist
    const keystorePath = 'android/app/debug.keystore';
    if (!fs.existsSync(keystorePath)) {
      console.log('\n🔑 Generating debug keystore...');
      runCommand(
        `keytool -genkey -v -keystore ${keystorePath} -alias androiddebugkey -keyalg RSA -keysize 2048 -validity 10000 -storepass android -keypass android -dname "CN=Android Debug,O=Android,C=US"`,
        'Generating debug keystore'
      );
    }
    
    // Build debug APK
    console.log('\n🏗️ Building debug APK...');
    runCommand('cd android && ./gradlew assembleDebug', 'Building debug APK');
    
    // Check if APK was created
    const apkPath = 'android/app/build/outputs/apk/debug/app-debug.apk';
    if (fs.existsSync(apkPath)) {
      console.log('\n🎉 APK build completed successfully!');
      console.log(`📱 APK location: ${path.resolve(apkPath)}`);
      console.log(`📏 APK size: ${(fs.statSync(apkPath).size / 1024 / 1024).toFixed(2)} MB`);
      
      // Copy APK to root directory for easy access
      const finalApkPath = 'FastBite-Customer-Debug.apk';
      fs.copyFileSync(apkPath, finalApkPath);
      console.log(`📋 APK copied to: ${path.resolve(finalApkPath)}`);
      
      console.log('\n📱 Installation Instructions:');
      console.log('1. Enable "Unknown Sources" in your Android device settings');
      console.log('2. Transfer the APK file to your device');
      console.log('3. Tap the APK file to install');
      console.log('4. Grant necessary permissions when prompted');
      
    } else {
      console.error('❌ APK file not found. Build may have failed.');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
}

// Run the build
buildAPK();

