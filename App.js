/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  PushNotificationIOS,
  Platform,
} from 'react-native';
import PushNotification from 'react-native-push-notification';
import { StreamChat } from 'stream-chat';
import {
  API_KEY,
  SENDER_ID,
  userStreamId,
  userName,
  userImage,
} from 'react-native-dotenv';
import messaging from '@react-native-firebase/messaging';

PushNotification.configure({
  onNotification(notification) {
    console.log('********', notification);
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },
  senderID: SENDER_ID,
  requestPermissions: true,
});

export default class App extends Component {
  async componentDidMount() {
    const client = new StreamChat(API_KEY, null);

    const streamUserObj = {
      id: userStreamId,
      name: userName,
      image: userImage,
    };

    const token = await messaging().getToken();

    await client.setUser(streamUserObj, userStreamId);

    client
      .addDevice(token, Platform.OS === 'ios' ? 'apn' : 'firebase')
      .then(() => {
        console.log(`beep : registered device with token`);
      })
      .catch((e) => {
        console.error(`beep : registering device failed: ${e}`);
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to Stream Chat Push Test!</Text>
        <Text style={styles.instructions}>
          To get started, allow notifications in this app and then use the
          stream cli to send a test notification
        </Text>
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
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
