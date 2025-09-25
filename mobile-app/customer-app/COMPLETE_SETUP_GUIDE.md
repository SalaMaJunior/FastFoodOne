# 🚀 **FastBite APK Build - Complete Setup Guide**

## 🎯 **Everything You Need to Build Your APK**

This guide will walk you through installing all required tools and building your FastBite mobile app APK.

---

## 📋 **Step 1: Install Required Software**

### **1.1 Install Java JDK 11 or Higher**
- **Download:** https://adoptium.net/
- **Choose:** OpenJDK 11 LTS or higher
- **Install:** Follow the installer instructions
- **Verify:** Open Command Prompt and run `java -version`

### **1.2 Install Node.js 16 or Higher**
- **Download:** https://nodejs.org/
- **Choose:** LTS version (18.x recommended)
- **Install:** Follow the installer instructions
- **Verify:** Open Command Prompt and run `node --version`

### **1.3 Install Android Studio**
- **Download:** https://developer.android.com/studio
- **Install:** Follow the installer instructions
- **During installation:** Make sure to install Android SDK
- **Note:** This will also install Android SDK and build tools

---

## 🔧 **Step 2: Set Environment Variables**

### **2.1 Find Your Android SDK Path**
After installing Android Studio, your Android SDK is usually located at:
- **Windows:** `C:\Users\%USERNAME%\AppData\Local\Android\Sdk`
- **macOS:** `$HOME/Library/Android/sdk`
- **Linux:** `$HOME/Android/Sdk`

### **2.2 Set Environment Variables**

#### **Windows (Command Prompt as Administrator):**
```cmd
setx ANDROID_HOME "C:\Users\%USERNAME%\AppData\Local\Android\Sdk"
setx JAVA_HOME "C:\Program Files\Java\jdk-11"
setx PATH "%PATH%;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\tools;%JAVA_HOME%\bin"
```

#### **Windows (PowerShell as Administrator):**
```powershell
[Environment]::SetEnvironmentVariable("ANDROID_HOME", "C:\Users\$env:USERNAME\AppData\Local\Android\Sdk", "Machine")
[Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\Java\jdk-11", "Machine")
```

#### **macOS/Linux:**
```bash
echo 'export ANDROID_HOME=$HOME/Library/Android/sdk' >> ~/.bash_profile
echo 'export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-11.jdk/Contents/Home' >> ~/.bash_profile
echo 'export PATH=$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/tools:$JAVA_HOME/bin' >> ~/.bash_profile
source ~/.bash_profile
```

### **2.3 Restart Your Terminal**
After setting environment variables, close and reopen your Command Prompt/Terminal.

---

## 🧪 **Step 3: Verify Installation**

### **3.1 Run Prerequisites Check**
```bash
cd D:\FastBite-Complete\mobile-app\customer-app
node check-prerequisites.js
```

This will check:
- ✅ Node.js installation
- ✅ Java installation
- ✅ Android SDK installation
- ✅ Environment variables
- ✅ Required tools

### **3.2 Install Additional Tools**
```bash
# Install React Native CLI globally
npm install -g @react-native-community/cli

# Install Expo CLI (optional)
npm install -g @expo/cli
```

---

## 🏗️ **Step 4: Setup Android Project**

### **4.1 Run Setup Script**
```bash
node setup-android-build.js
```

This will:
- Install all dependencies
- Generate debug keystore
- Test build configuration
- Verify everything is working

### **4.2 Manual Setup (if needed)**
If the automated setup fails, you can manually initialize the Android project:

```bash
# Initialize React Native project
npx react-native init FastBiteCustomer --template react-native-template-typescript

# Copy Android configuration
cp -r FastBiteCustomer/android ./
rm -rf FastBiteCustomer
```

---

## 📱 **Step 5: Build Your APK**

### **5.1 Quick Build (Recommended)**
```bash
# Option A: Automated script
node build-apk.js

# Option B: Windows batch file
quick-build.bat

# Option C: npm script
npm run build-apk
```

### **5.2 Manual Build**
```bash
# Install dependencies
npm install

# Clean previous builds
cd android
./gradlew clean

# Build debug APK
./gradlew assembleDebug
```

### **5.3 Find Your APK**
After successful build, your APK will be located at:
- **Path:** `android/app/build/outputs/apk/debug/app-debug.apk`
- **Size:** ~50-100 MB
- **Type:** Debug APK (signed with debug keystore)

---

## 📱 **Step 6: Install APK on Your Device**

### **6.1 Enable Developer Options**
1. Go to **Settings** > **About Phone**
2. Tap **"Build Number"** 7 times
3. Go back to **Settings** > **Developer Options**
4. Enable **"USB Debugging"**
5. Enable **"Install via USB"**

### **6.2 Enable Unknown Sources**
1. Go to **Settings** > **Security**
2. Enable **"Unknown Sources"** or **"Install Unknown Apps"**

### **6.3 Install APK**
1. **Transfer APK** to your device (via USB, email, or cloud)
2. **Tap the APK file** on your device
3. **Follow installation prompts**
4. **Grant permissions** when requested

---

## 🧪 **Step 7: Test Your App**

### **7.1 Basic Functionality Tests**
- [ ] App launches without crashes
- [ ] Login/Register screens work
- [ ] Restaurant list loads
- [ ] Menu items display correctly
- [ ] Cart functionality works
- [ ] Order placement succeeds

### **7.2 Advanced Feature Tests**
- [ ] AI search functionality
- [ ] Voice search (microphone permission)
- [ ] AR menu viewer (camera permission)
- [ ] Real-time order tracking
- [ ] Push notifications
- [ ] Biometric authentication

---

## 🔄 **Step 8: Update Your APK**

### **8.1 When You Make Changes**
1. **Update your code**
2. **Increment version** in `android/app/build.gradle`:
   ```gradle
   versionCode 2
   versionName "1.0.1"
   ```
3. **Rebuild APK:**
   ```bash
   node build-apk.js
   ```
4. **Install new APK** on your device

---

## 🛠️ **Troubleshooting**

### **Common Issues & Solutions:**

#### **"ANDROID_HOME not set"**
```bash
# Check if ANDROID_HOME is set
echo $ANDROID_HOME

# Set ANDROID_HOME (Windows)
set ANDROID_HOME=C:\Users\%USERNAME%\AppData\Local\Android\Sdk

# Set ANDROID_HOME (macOS/Linux)
export ANDROID_HOME=$HOME/Library/Android/sdk
```

#### **"Java not found"**
```bash
# Check Java installation
java -version

# Set JAVA_HOME (Windows)
set JAVA_HOME=C:\Program Files\Java\jdk-11

# Set JAVA_HOME (macOS/Linux)
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-11.jdk/Contents/Home
```

#### **"Gradle build failed"**
```bash
# Clean and rebuild
cd android
./gradlew clean
./gradlew assembleDebug
```

#### **"Permission denied"**
```bash
# Make gradlew executable (macOS/Linux)
chmod +x android/gradlew
```

#### **"SDK location not found"**
- Install Android SDK via Android Studio
- Set ANDROID_HOME environment variable
- Install required build tools

---

## 📊 **Build Performance Tips**

### **Faster Builds:**
- Use SSD storage for better I/O performance
- Close unnecessary applications during build
- Use `./gradlew assembleDebug` instead of full clean build
- Enable Gradle daemon in `gradle.properties`

### **Reduce APK Size:**
- Use `./gradlew assembleRelease` for production builds
- Enable ProGuard for code shrinking
- Use split APKs for different architectures

---

## 🎉 **Success!**

### **What You've Accomplished:**
- ✅ Installed all required development tools
- ✅ Set up Android development environment
- ✅ Configured React Native project
- ✅ Built your first APK
- ✅ Installed app on your device
- ✅ Tested all app features

### **Your FastBite App Features:**
- 🍕 Complete food delivery platform
- 🤖 AI-powered search and recommendations
- 🎤 Voice search functionality
- 📱 AR menu item recognition
- 📍 Real-time order tracking
- 🔔 Push notifications
- 🔐 Biometric authentication
- 📊 Analytics and reporting

---

## 📞 **Need Help?**

### **If You Get Stuck:**
1. **Check prerequisites:** `node check-prerequisites.js`
2. **Review error messages** in the build output
3. **Verify environment variables** are set correctly
4. **Check Android SDK** installation
5. **Restart your terminal** after setting environment variables

### **Useful Commands:**
```bash
# Check environment
echo $ANDROID_HOME
echo $JAVA_HOME
java -version
node --version

# Clean everything
npm run clean
rm -rf node_modules
npm install

# Rebuild from scratch
node setup-android-build.js
node build-apk.js
```

---

## 🚀 **You're Ready!**

**Your FastBite mobile app is now ready to become an APK! 🎊📱**

Start building your APK now:
```bash
cd D:\FastBite-Complete\mobile-app\customer-app
node check-prerequisites.js
node setup-android-build.js
node build-apk.js
```

**Enjoy testing your complete food delivery app! 🍔📱✨**

