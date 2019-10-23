/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { TextInput, StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import PushController from './PushController.js';
import appConfig from './app.json';
import {YellowBox} from 'react-native';


YellowBox.ignoreWarnings([
    'Require cycle:',
]);

type Props = {};
const API_URL = "https://fcm.googleapis.com/fcm/send";

export default class App extends Component<Props> {

  constructor(props) {
    super(props);
    this.state = {
      senderId: appConfig.senderID
    };

    this.notif = new PushController(this.onRegister.bind(this), this.onNotif.bind(this));
  }

  render() {
    return (
        <View style={styles.container}>
          <Text style={styles.title}>Example app react-native-push-notification</Text>
          <View style={styles.spacer}></View>
          <TextInput style={styles.textField} value={this.state.registerToken} placeholder="Register token" />
          <View style={styles.spacer}></View>

          <TouchableOpacity style={styles.button} onPress={() => { this.notif.localNotif() }}><Text>Local Notification (now)</Text></TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => { this.notif.scheduleNotif() }}><Text>Schedule Notification in 30s</Text></TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => { this.notif.cancelNotif() }}><Text>Cancel last notification (if any)</Text></TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => { this.notif.cancelAll() }}><Text>Cancel all notifications</Text></TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => { this.notif.checkPermission(this.handlePerm.bind(this)) }}><Text>Check Permission</Text></TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => { this.sendRemote() }}><Text>Remote Notification</Text></TouchableOpacity>

          <View style={styles.spacer}></View>
          <TextInput style={styles.textField} value={this.state.senderId} onChangeText={(e) => {this.setState({ senderId: e })}} placeholder="GCM ID" />
          <TouchableOpacity style={styles.button} onPress={() => { this.notif.configure(this.onRegister.bind(this), this.onNotif.bind(this), this.state.senderId) }}><Text>Configure Sender ID</Text></TouchableOpacity>
          {this.state.gcmRegistered && <Text>GCM Configured !</Text>}

          <View style={styles.spacer}></View>
        </View>
    );
  }

  onRegister(token) {
    Alert.alert("Registered !", JSON.stringify(token));
    console.log(token);
    this.setState({ registerToken: token.token, gcmRegistered: true });
  }

  onNotif(notif) {
    console.log(notif);
    Alert.alert(notif.title, notif.message);
  }

    sendRemote(){
        let body = {
            "to": "e-GW1ccwDmM:APA91bG13B3tGPGzObHUrwdmc671NCVhAjBarlVvE2jrjcSThxBfKF3pq1Hn36iidGXAehUXDisbSNLcFCuwNVBGBFl5qFhYqM0AxPfl5oko3jJAqEW4sRg8AJXcLD1Kpb61xcXh2phG",
            "notification":{
                "title": "Simple FCM Client",
                "body": "This is a notification with only NOTIFICATION.",
                "sound": "default",
                "click_action": "fcm.ACTION.HELLO"
            },
            "priority": 10
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

  handlePerm(perms) {
    Alert.alert("Permissions", JSON.stringify(perms));
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
