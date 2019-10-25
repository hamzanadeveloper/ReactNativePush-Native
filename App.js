/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Alert, StyleSheet, Text, TouchableHighlight, View, TextInput, TouchableOpacity, YellowBox } from 'react-native';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import firebase from 'react-native-firebase';

YellowBox.ignoreWarnings([
    'Require cycle:',
]);

const API_URL = "https://fcm.googleapis.com/fcm/send";

type Props = {};
type State = {
    permissions: Object,
};
export default class App extends Component<Props, State> {
    state = {
        permissions: {},
        fcmToken: "",
    };

    async UNSAFE_componentWillMount() {
        const fcmToken = await firebase.messaging().getToken();
        this.setState({ fcmToken })

        PushNotificationIOS.addEventListener('register', this._onRegistered);
        PushNotificationIOS.addEventListener(
            'registrationError',
            this._onRegistrationError,
        );
        PushNotificationIOS.addEventListener(
            'notification',
            this._onRemoteNotification,
        );
        PushNotificationIOS.addEventListener(
            'localNotification',
            this._onLocalNotification,
        );

        PushNotificationIOS.requestPermissions();
    }

    componentWillUnmount() {
        PushNotificationIOS.removeEventListener('register', this._onRegistered);
        PushNotificationIOS.removeEventListener(
            'registrationError',
            this._onRegistrationError,
        );
        PushNotificationIOS.removeEventListener(
            'notification',
            this._onRemoteNotification,
        );
        PushNotificationIOS.removeEventListener(
            'localNotification',
            this._onLocalNotification,
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>React Native Push Notifications</Text>
                <View style={styles.spacer}></View>
                <TextInput style={styles.textField} value={this.state.fcmToken} placeholder="FCM token" />
                <View style={styles.spacer}></View>

                <TouchableOpacity style={styles.button} onPress={() => { console.log(this.state.fcmToken) }}><Text>Set the FCM Token</Text></TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => { this.sendRemote() }}><Text>Remote Notification</Text></TouchableOpacity>

                <View style={styles.spacer}></View>
                <View style={styles.spacer}></View>
            </View>
        );
    }

    sendRemote(){
        let body = {
            "to": this.state.fcmToken,
            "notification":{
                "title": "Simple FCM Client",
                "body": "This is a notification with only NOTIFICATION.",
                "sound": "default",
                "click_action": "fcm.ACTION.HELLO"
            },
            "data" : {
                "body" : "Simple FCM Client",
                "title" : "This is a push notification!",
                "content_available" : true,
                "priority" : "high",
            }
        }

        this._send(JSON.stringify(body), "notification");
    }

    _send(body, type) {
        let headers = new Headers({
            "Content-Type": "application/json",
            "Content-Length": parseInt(body.length),
            "Authorization": "key=AAAAnBLPaBI:APA91bFW9LU8lZ24h8g4aJ-UaYJkl8ce-eDnv7rPuc6jiisoUvacFQkdHGtmF8NUL2s6acK36QlRKb7PtTIGWJOWboFTf81243KpmpItPbq179NtPbOwfNYPNXk2wCsc5WAzkmZnOVqH"
        });

        fetch(API_URL, { method: "POST", headers, body })
            .then(response => console.log("Send " + type + " response", response))
            .catch(error => console.log("Error sending " + type, error));
    }

    _sendNotification() {
        require('RCTDeviceEventEmitter').emit('remoteNotificationReceived', {
            remote: true,
            aps: {
                alert: 'Sample notification',
                badge: '+1',
                sound: 'default',
                category: 'REACT_NATIVE',
                'content-available': 1,
            },
        });
    }

    _sendLocalNotification() {
        PushNotificationIOS.presentLocalNotification({
            alertBody: 'Sample local notification',
            applicationIconBadgeNumber: 1
        });
    }

    async _onRegistered(deviceToken) {
        console.log(`The device token is ${deviceToken}`)
    }

    _onRegistrationError(error) {
        Alert.alert(
            'Failed To Register For Remote Push',
            `Error (${error.code}): ${error.message}`,
            [
                {
                    text: 'Dismiss',
                    onPress: null,
                },
            ],
        );
    }

    _onRemoteNotification(notification) {
        const result = `Message: ${notification.getMessage()};\n
      badge: ${notification.getBadgeCount()};\n
      sound: ${notification.getSound()};\n
      category: ${notification.getCategory()};\n
      content-available: ${notification.getContentAvailable()}.`;

        Alert.alert('Push Notification Received', result, [
            {
                text: 'Dismiss',
                onPress: null,
            },
        ]);
    }

    _onLocalNotification(notification) {
        Alert.alert(
            'Local Notification Received',
            'Alert message: ' + notification.getMessage(),
            [
                {
                    text: 'Dismiss',
                    onPress: null,
                },
            ],
        );
    }

    _showPermissions() {
        PushNotificationIOS.checkPermissions(permissions => {
            this.setState({permissions});
        });
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    button: {
        borderWidth: 1,
        borderColor: "#000000",
        margin: 5,
        padding: 5,
        width: "70%",
        backgroundColor: "#DDDDDD",
        borderRadius: 5,
    },
    textField: {
        borderWidth: 1,
        borderColor: "#AAAAAA",
        margin: 5,
        padding: 5,
        width: "70%"
    },
    spacer: {
        height: 10,
    },
    title: {
        fontWeight: "bold",
        fontSize: 20,
        textAlign: "center",
    }
});
