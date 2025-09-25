# 📱 **FastBite Mobile App - APK Build Guide**

## 🎯 **Convert React Native App to APK for Android Testing**

This guide will help you build an APK file from the FastBite mobile app that you can install on your Android device for testing.

---

## 📋 **Prerequisites**

### **1. Install Required Software:**

#### **Java Development Kit (JDK) 11 or higher:**
- Download from: https://adoptium.net/
- Or install via package manager:
  ```bash
  # Windows (Chocolatey)
  choco install openjdk11
  
  # macOS (Homebrew)
  brew install openjdk@11
  
  # Ubuntu/Debian
  sudo apt install openjdk-11-jdk
  ```

#### **Android Studio:**
- Download from: https://developer.android.com/studio
- Install Android SDK (API Level 33)
- Install Android Build Tools
- Install Android Emulator (optional)

#### **Node.js (16 or higher):**
- Download from: https://nodejs.org/
- Verify installation: `node --version`

### **2. Set Environment Variables:**

#### **Windows:**
```cmd
set ANDROID_HOME=C:\Users\%USERNAME%\AppData\Local\Android\Sdk
set JAVA_HOME=C:\Program Files\Java\jdk-11
set PATH=%PATH%;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\tools;%JAVA_HOME%\bin
```

#### **macOS/Linux:**
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-11.jdk/Contents/Home
export PATH=$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/tools:$JAVA_HOME/bin
```

---

## 🚀 **Quick Build (Automated)**

### **Option 1: Use the Build Script**

1. **Navigate to the customer app directory:**
   ```bash
   cd D:\FastBite-Complete\mobile-app\customer-app
   ```

2. **Make the build script executable:**
   ```bash
   chmod +x build-apk.js
   ```

3. **Run the build script:**
   ```bash
   node build-apk.js
   ```

4. **The script will:**
   - Check prerequisites
   - Install dependencies
   - Generate debug keystore
   - Build the APK
   - Copy APK to root directory

5. **Find your APK:**
   - Location: `D:\FastBite-Complete\mobile-app\customer-app\FastBite-Customer-Debug.apk`

---

## 🔧 **Manual Build Process**

### **Step 1: Install Dependencies**
```bash
cd D:\FastBite-Complete\mobile-app\customer-app
npm install
```

### **Step 2: Install React Native CLI**
```bash
npm install -g @react-native-community/cli
```

### **Step 3: Install Android Dependencies**
```bash
npx react-native doctor
```

### **Step 4: Generate Debug Keystore**
```bash
keytool -genkey -v -keystore android/app/debug.keystore -alias androiddebugkey -keyalg RSA -keysize 2048 -validity 10000 -storepass android -keypass android -dname "CN=Android Debug,O=Android,C=US"
```

### **Step 5: Clean Previous Builds**
```bash
cd android
./gradlew clean
```

### **Step 6: Build Debug APK**
```bash
./gradlew assembleDebug
```

### **Step 7: Find Your APK**
- Location: `android/app/build/outputs/apk/debug/app-debug.apk`
- Size: ~50-100 MB

---

## 📱 **Install APK on Android Device**

### **Method 1: Direct Installation**

1. **Enable Developer Options:**
   - Go to Settings > About Phone
   - Tap "Build Number" 7 times
   - Go back to Settings > Developer Options
   - Enable "USB Debugging"
   - Enable "Install via USB"

2. **Enable Unknown Sources:**
   - Go to Settings > Security
   - Enable "Unknown Sources" or "Install Unknown Apps"

3. **Transfer APK to Device:**
   - Copy APK to device via USB, email, or cloud storage
   - Or use ADB: `adb install FastBite-Customer-Debug.apk`

4. **Install APK:**
   - Open file manager on device
   - Navigate to APK location
   - Tap the APK file
   - Follow installation prompts

### **Method 2: ADB Installation**

1. **Connect device via USB**
2. **Enable USB Debugging** (see above)
3. **Install via ADB:**
   ```bash
   adb install FastBite-Customer-Debug.apk
   ```

---

## 🛠️ **Troubleshooting**

### **Common Issues:**

#### **1. "ANDROID_HOME not set"**
```bash
# Set ANDROID_HOME environment variable
export ANDROID_HOME=$HOME/Library/Android/sdk
```

#### **2. "Java not found"**
```bash
# Install Java JDK 11+
# Set JAVA_HOME environment variable
export JAVA_HOME=/path/to/java
```

#### **3. "Gradle build failed"**
```bash
# Clean and rebuild
cd android
./gradlew clean
./gradlew assembleDebug
```

#### **4. "Metro bundler not found"**
```bash
# Install Metro bundler
npm install -g metro
```

#### **5. "Permission denied"**
```bash
# Make gradlew executable
chmod +x android/gradlew
```

### **Build Errors:**

#### **1. "SDK location not found"**
- Set `ANDROID_HOME` environment variable
- Install Android SDK via Android Studio

#### **2. "Build tools version mismatch"**
- Update `buildToolsVersion` in `android/build.gradle`
- Install correct build tools version

#### **3. "Java version incompatible"**
- Use Java JDK 11 or higher
- Set `JAVA_HOME` environment variable

---

## 🎯 **Testing the APK**

### **1. Basic Functionality:**
- App launches without crashes
- Login/Register screens work
- Restaurant list loads
- Menu items display correctly
- Cart functionality works
- Order placement works

### **2. Advanced Features:**
- AI search functionality
- Voice search (if microphone permission granted)
- AR menu viewer (if camera permission granted)
- Real-time order tracking
- Push notifications

### **3. Performance Testing:**
- App responds quickly to user input
- Smooth scrolling and animations
- Memory usage is reasonable
- Battery usage is optimized

---

## 📊 **APK Information**

### **Debug APK Details:**
- **Package Name:** com.fastbite.customer
- **Version:** 1.0.0
- **Target SDK:** 33
- **Min SDK:** 21
- **Architecture:** ARM64, ARMv7, x86, x86_64
- **Size:** ~50-100 MB
- **Signing:** Debug keystore

### **Permissions Required:**
- Internet access
- Network state
- Location (for delivery tracking)
- Camera (for AR features)
- Microphone (for voice search)
- Storage (for caching)
- Biometric (for authentication)

---

## 🔄 **Updating the APK**

### **When you make changes:**

1. **Update the code**
2. **Increment version in `android/app/build.gradle`:**
   ```gradle
   versionCode 2
   versionName "1.0.1"
   ```
3. **Rebuild APK:**
   ```bash
   node build-apk.js
   ```
4. **Install new APK on device**

---

## 🎉 **Success!**

Once you've successfully built and installed the APK, you can:

- **Test all FastBite features** on your Android device
- **Experience the full mobile app** with AI, AR, and real-time features
- **Validate the user experience** and functionality
- **Share with others** for testing and feedback

### **Next Steps:**
1. Test all app features thoroughly
2. Report any bugs or issues
3. Optimize performance if needed
4. Prepare for production release

---

## 📞 **Support**

If you encounter any issues:

1. Check the troubleshooting section above
2. Verify all prerequisites are installed
3. Check environment variables are set correctly
4. Review the build logs for specific error messages
5. Ensure your Android device meets the minimum requirements

**Happy Testing! 🚀📱**

