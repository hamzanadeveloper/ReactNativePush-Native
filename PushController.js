import React, { Component } from 'react'
import PushNotification from "react-native-push-notification"
import { Text, View, Platform } from 'react-native'
let deviceToken;
export default class PushController extends Component {

    componentDidMount() {
        PushNotification.checkPermissions();

        PushNotification.configure({
            onRegister: function(token) {
                console.log("TOKEN:", token);
            },
            onNotification: function (notification) {
                console.log("NOTIFICATION:", notification);
            },
            permissions: {
                alert: true,
                badge: true,
                sound: true
            },

            popInitialNotification: true,
            requestPermissions: true,
        });
    }

    render(){
        return(
            <View>
                <Text>Token is {deviceToken}</Text>
            </View>
            )
    }
}
