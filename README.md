## WiFi app

To build the app, you'll need node.js installed in your system.

Install ionic:

```bash
npm install -g ionic
```

You could need to prepend `sudo` on Mac/Linux.

Then, inside the repository folder, install the dependencies:

```bash
npm install
```

### Android

```bash
ionic cordova platform add android
```

To run applications and share data between wifi and segnalazioni applications on android device, add

```XML
android:sharedUserId="com.k4tech.alstom"
```

in `manifest` tag in `platforms/android/AndroidManitest.xml`.

To run the app on a emulator/device:

```bash
ionic cordova run android
```

### iOS

```bash
ionic cordova platform add ios
```

To run applications and share data between wifi and segnalazioni applications on ios device, enable keysharing on in capabilities section in xcode then add the item

```XML
$(AppIdentifierPrefix)myKeychainGroup1
```

in Keychain Access Group in application entitelment file and then go to CDVKeychain.m file in plugin folder in xcode project. We need to edit some code to enable sharing between two applications in followings methods

```XML
get:(CDVInvokedUrlCommand*)command
set:(CDVInvokedUrlCommand*)command
remove:(CDVInvokedUrlCommand*)command
```

Change the line of code beginning with

```XML
A0SimpleKeychain *keychain
```

with

```XML
A0SimpleKeychain *keychain = [A0SimpleKeychain keychainWithService:@"" accessGroup:@"8GPX9EW978.myKeychainGroup1"];
```

To run the app on a emulator/device:
first run the application

```bash
ionic cordova run ios
```

then with run button from Xcode project
