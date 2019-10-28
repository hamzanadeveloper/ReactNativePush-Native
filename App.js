import React, {Component} from 'react';
import { Platform, Alert, StyleSheet, Text, View, TextInput, TouchableOpacity, YellowBox } from 'react-native';

import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
import firebase from 'react-native-firebase';

import appConfig from './app.json';
import PushController from './PushController.js'


YellowBox.ignoreWarnings(['Require cycle:', 'Remote debugger']);
const API_URL = "https://fcm.googleapis.com/fcm/send";

type Props = {};
type State = {
    permissions: Object,
};
export default class App extends Component<Props> {

    constructor(props) {
        super(props);
        this.state = {
            senderId: appConfig.senderID,
            fcmToken: "",
        };

        this.notif = new PushController(this.onRegister.bind(this), this.onNotification.bind(this));
    }

    async componentWillMount() {
        const fcmToken = await firebase.messaging().getToken();
        this.setState({ fcmToken })

        PushNotificationIOS.addEventListener('notification', this._onRemoteNotification); // Use when app is in foreground for iOS
    }

    _onRemoteNotification(notification) {
        if(Platform.OS === 'ios'){ // iOS won't display notifications if app is in the foreground.
            PushNotification.localNotification({
                alertAction: "view",
                title: notification._data.title, // (optional)
                message: notification._data.body, // (required)
            });
        }
    }

    onRegister(token) {
        Alert.alert("Registered !", JSON.stringify(token));
        console.log(token);
        this.setState({ registerToken: token.token, gcmRegistered: true });
    }

    onNotification(notif) {
        console.log(notif);
    }

    sendRemote(){
        let body = {
            "to" : this.state.fcmToken,
            "notification" : {
                "body" : "Say something!",
                "title" : "Welcome to Push Notifications!",
                "content_available" : true,
                "priority" : "high",
            },
            "data" : {
                "body" : "Say something!",
                "title" : "Welcome to Push Notifications!",
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
            "Authorization": "key=<your-server-key>" // Put your server key here from the Firebase console.
        });

        fetch(API_URL, { method: "POST", headers, body })
            .then(response => console.log("Send " + type + " response", response))
            .catch(error => console.log("Error sending " + type, error));
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>React Native Push Notification</Text>
                <View style={styles.spacer}></View>
                <TextInput style={styles.textField} value={this.state.fcmToken} placeholder="FCM Token" />
                <View style={styles.spacer}></View>

                <TouchableOpacity style={styles.button} onPress={() => { this.notif.localNotif() }}><Text>Local Notification (now)</Text></TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => { this.sendRemote() }}><Text>Remote Notification</Text></TouchableOpacity>

                <View style={styles.spacer}></View>
                <TextInput style={styles.textField} value={this.state.senderId} onChangeText={(e) => {this.setState({ senderId: e })}} placeholder="Firebase Sender ID" />

                <View style={styles.spacer}></View>
            </View>
        );
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
        width: "100%",
        fontWeight: "bold",
        fontSize: 20,
        textAlign: "center",
    }
});
