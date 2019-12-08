# Engage Project
Push notifications are simple banner-like notifications that appear on your phone when your application sends a user a notification. Push notifications are an excellent way to re-engage users by notifying them of new updates and drawing them back into your application. This repository will allow you to create and test out push notifications using a Firebase server. Using React-Native, it will allow you to create a cross-compatible mobile application, both functional on iOS and Android operating systems. 

This repository uses dependencies:
- `react-native-push-notification`
- `@react-native-community/push-notification-ios`
- `react-native-firebase`

Push notifications are handled via POST requests to a Firebase server, which then directs both FCM and APN notifications.

# How to Replicate

Begin by cloning the repository:
```
git clone https://github.com/hamzanadeveloper/ReactNativePush-Native.git
```
Requirements:
- Android/iOS device connected to machine via USB. If you would like to use a simulator, look [here](https://facebook.github.io/react-native/docs/running-on-simulator-ios)
- A project on the [Firebase Console](https://console.firebase.google.com/) (for the *server key* and the *senderID*)
- Enrollment in the [Apple Developer Program](https://developer.apple.com/programs/) (for *authorization keys* and *certificates* - needed for iOS notifications)
  - Generate [APN certificates and keys](https://developer.apple.com/documentation/usernotifications/setting_up_a_remote_notification_server/establishing_a_certificate-based_connection_to_apns)
- Ensure devices are on the same network as your machine
- If Android, enable [USB debugging](https://developer.android.com/studio/debug/dev-options)
- If iOS, open XCode -> Preferences -> Accounts, and add your developer account
  - Select the *ReactNativePushDemo* project, open the project and targets list, select the target
  - Open the *Signing & Capabilities* tab and identify your developer profile under Team. Resolve any errors regarding the status
  - In the top bar, select *+ Capability* and add *Push Notifications*. Also, add *Background Modes* and enable *Remote notifications*
  
# Firebase Setup
Navigate to the [Firebase Console](https://console.firebase.google.com/) and select the project you made.
- Setup an Android Project
  - Follow through each step, with the exception of step 3
- Setup an iOS Project
  - Follow through each step, with the exception of step 3 & 4
  - Select your iOS app under the *Cloud Messaging* tab in the Project Settings
  - Add either your authorization key or your certificate(s)
  
# Code Setup
- Obtain server key from Firebase Console and insert at *< your-server-key >* in *App.js*
- Obtain senderID from Firebase Console and insert at *< your-firebase-senderID >* in *app.json*
- Run `npm install` in the root folder in your terminal
- From the command-line, open the *ios* directory, and run `pod install`

# Run the App
- If Android, you can simply run `react-native run-android` in the **root** folder
- If iOS, you can run `react-native run-ios --device "< device-name >"` in the **root** folder
  - You can find the device name in the iOS Settings
  
# Troubleshooting
Most issues can be resolved by **uninstalling the app from the device** and cleaning up by:
- If Android 
  - In your command-line, open the *android* directory, and run `./gradlew clean`
- If iOS
  - Delete the *build* folder from the *ios* directory

Following this, re-run the application.
  
# Notes
- The `react-native-firebase` dependency can entirely handle the API call, read the documentation [here](https://rnfirebase.io/docs/v5.x.x/messaging/reference/Messaging). However, if you would like to handle errors yourself, you can manually do the POST request, as seen in the code
  - In this repository, Firebase is configured to send both FCM and APN notifications
- Documentation on POST requests to the FCM API can be found [here](https://firebase.google.com/docs/cloud-messaging/send-message). Documentation on POST requests to the APN API can be found [here](https://developer.apple.com/documentation/usernotifications/setting_up_a_remote_notification_server/sending_notification_requests_to_apns)
- iOS notifications do not display while the app is in the foreground, this is handled with event listeners from the `push-notification-ios` dependency
- Though it happens rarely, tokens can refresh. This can be handled by `onTokenRefresh` from the `react-native-firebase` dependency, more information [here](https://rnfirebase.io/docs/v5.x.x/messaging/reference/Messaging)


