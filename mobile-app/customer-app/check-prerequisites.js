#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const os = require('os');

console.log('🔍 FastBite APK Build - Prerequisites Checker');
console.log('==============================================');

// Function to check if command exists
function commandExists(command) {
  try {
    execSync(`which ${command}`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

// Function to check if file exists
function fileExists(filePath) {
  return fs.existsSync(filePath);
}

// Function to get command version
function getCommandVersion(command) {
  try {
    const version = execSync(`${command} --version`, { encoding: 'utf8' }).trim();
    return version.split('\n')[0];
  } catch {
    return 'Not found';
  }
}

// Function to check Java version
function getJavaVersion() {
  try {
    const version = execSync('java -version', { encoding: 'utf8' });
    return version.split('\n')[0];
  } catch {
    return 'Not found';
  }
}

// Main check function
function checkPrerequisites() {
  console.log('\n📋 Checking Prerequisites...\n');
  
  let allGood = true;
  
  // Check Node.js
  console.log('1. Node.js:');
  if (commandExists('node')) {
    const nodeVersion = getCommandVersion('node');
    console.log(`   ✅ ${nodeVersion}`);
  } else {
    console.log('   ❌ Node.js not found');
    console.log('   📥 Download from: https://nodejs.org/');
    allGood = false;
  }
  
  // Check npm
  console.log('\n2. npm:');
  if (commandExists('npm')) {
    const npmVersion = getCommandVersion('npm');
    console.log(`   ✅ ${npmVersion}`);
  } else {
    console.log('   ❌ npm not found');
    allGood = false;
  }
  
  // Check Java
  console.log('\n3. Java:');
  if (commandExists('java')) {
    const javaVersion = getJavaVersion();
    console.log(`   ✅ ${javaVersion}`);
    
    // Check if it's JDK 11+
    try {
      const version = execSync('java -version', { encoding: 'utf8' });
      if (version.includes('1.8')) {
        console.log('   ⚠️  Warning: Java 8 detected. JDK 11+ recommended');
      }
    } catch (e) {
      console.log('   ⚠️  Could not determine Java version');
    }
  } else {
    console.log('   ❌ Java not found');
    console.log('   📥 Download from: https://adoptium.net/');
    allGood = false;
  }
  
  // Check Android SDK
  console.log('\n4. Android SDK:');
  const androidHome = process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT;
  if (androidHome) {
    console.log(`   ✅ ANDROID_HOME: ${androidHome}`);
    if (fileExists(androidHome)) {
      console.log('   ✅ Android SDK directory exists');
    } else {
      console.log('   ❌ Android SDK directory not found');
      allGood = false;
    }
  } else {
    console.log('   ❌ ANDROID_HOME not set');
    console.log('   📥 Install Android Studio: https://developer.android.com/studio');
    allGood = false;
  }
  
  // Check React Native CLI
  console.log('\n5. React Native CLI:');
  if (commandExists('react-native')) {
    const rnVersion = getCommandVersion('react-native');
    console.log(`   ✅ ${rnVersion}`);
  } else {
    console.log('   ⚠️  React Native CLI not found globally');
    console.log('   📥 Run: npm install -g @react-native-community/cli');
  }
  
  // Check platform-specific tools
  console.log('\n6. Platform Tools:');
  if (androidHome) {
    const platformTools = `${androidHome}/platform-tools`;
    if (fileExists(platformTools)) {
      console.log('   ✅ Android Platform Tools found');
    } else {
      console.log('   ❌ Android Platform Tools not found');
      allGood = false;
    }
    
    const buildTools = `${androidHome}/build-tools`;
    if (fileExists(buildTools)) {
      console.log('   ✅ Android Build Tools found');
    } else {
      console.log('   ❌ Android Build Tools not found');
      allGood = false;
    }
  }
  
  // Check if we're in the right directory
  console.log('\n7. Project Directory:');
  if (fileExists('package.json')) {
    console.log('   ✅ package.json found');
  } else {
    console.log('   ❌ package.json not found');
    console.log('   📁 Please run from customer-app directory');
    allGood = false;
  }
  
  if (fileExists('android')) {
    console.log('   ✅ android directory found');
  } else {
    console.log('   ⚠️  android directory not found');
    console.log('   📁 Android project needs to be initialized');
  }
  
  // Summary
  console.log('\n📊 Summary:');
  if (allGood) {
    console.log('   🎉 All prerequisites are met!');
    console.log('   🚀 You can now build your APK!');
    console.log('\n   Next steps:');
    console.log('   1. Run: node setup-android-build.js');
    console.log('   2. Run: node build-apk.js');
  } else {
    console.log('   ⚠️  Some prerequisites are missing');
    console.log('   📥 Please install the missing components above');
    console.log('\n   After installing, run this script again to verify');
  }
  
  // Environment info
  console.log('\n💻 Environment Info:');
  console.log(`   Platform: ${os.platform()} ${os.arch()}`);
  console.log(`   Node.js: ${process.version}`);
  console.log(`   Working Directory: ${process.cwd()}`);
  
  return allGood;
}

// Run the check
checkPrerequisites();

