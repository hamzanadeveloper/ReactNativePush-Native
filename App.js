import React from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  View,
} from 'react-native';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: null,
      notification: null,
      title: 'Hello World',
      body: 'Say something!',
    };
  }

  async registerForPushNotifications() {
    const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);

    if (status !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      if (status !== 'granted') {
        return;
      }
    }

    let token = await Notifications.getExpoPushTokenAsync();
    // Presumably save token in db here.

    this.subscription = Notifications.addListener(this.handleNotification); //Useful in iOS.
    // In iOS, notifications are not displayed if app is in foreground. By adding a listener, we can manually handle it.

    this.setState({
      token,
    });
  }

  sendPushNotification(token = this.state.token, title = this.state.title, body = this.state.body) {
    return fetch('https://exp.host/--/api/v2/push/send', {
      body: JSON.stringify({
        to: token,
        title: title,
        body: body,
        data: { message: `${title} - ${body}` },
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });
  }

  handleNotification = notification => {
    this.setState({
      notification,
    });
  };

  render() {
    return (
        <KeyboardAvoidingView style={styles.container} behavior="position">
          <Text style={styles.title}>Expo Sample Notifications App</Text>
          <Text style={styles.text}>Title</Text>
          <TextInput
              style={styles.input}
              onChangeText={title => this.setState({ title })}
              maxLength={100}
              value={this.state.title}
          />
          <Text style={styles.text}>Message</Text>
          <TextInput
              style={styles.input}
              onChangeText={body => this.setState({ body })}
              maxLength={100}
              value={this.state.body}
          />
          <TouchableOpacity
              onPress={() => this.registerForPushNotifications()}
              style={styles.touchable}>
            <Text>Register me for notifications!</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.sendPushNotification()} style={styles.touchable}>
            <Text>Send me a notification!</Text>
          </TouchableOpacity>
          {this.state.token ? (
              <View>
                <Text style={styles.text}>Token</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={token => this.setState({ token })}
                    value={this.state.token}
                />
              </View>
          ) : null}
          {this.state.notification ? (
              <View>
                <Text style={styles.text}>Last Notification:</Text>
                <Text style={styles.text}>{JSON.stringify(this.state.notification.data.message)}</Text>
              </View>
          ) : null}
        </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    padding: 8,
  },
  text: {
    paddingBottom: 2,
    padding: 8,
  },
  container: {
    flex: 1,
    paddingTop: 40,
  },
  touchable: {
    borderWidth: 1,
    borderRadius: 4,
    margin: 8,
    padding: 8,
    width: '95%',
  },
  input: {
    height: 40,
    borderWidth: 1,
    margin: 8,
    padding: 8,
    width: '95%',
  },
});
