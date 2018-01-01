/* @flow */

import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type PropsType = {
  sender?: string,
  message: string,
  outgoing: boolean,


  timeStamp?: string,
  sent?: boolean,

  outgoingColor: string,
  outgoingTextColor: string,
  incomingColor: string,
  incomingTextColor: string,
};

type StateType = {
  highlighted: boolean
};

class ChatBubble extends React.Component<PropsType, StateType> {

  static defaultProps = {
    outgoingColor: '#EEEEEE',
    outgoingTextColor: '#161819',
    incomingColor: '#111D37',
    incomingTextColor: '#FFFFFF'
  };

  _outgoing_style = {
    marginLeft: '30%'
  };

  _incoming_style = {};

  render() {
    const { sender, message, timeStamp, sent, outgoing, outgoingColor,
      outgoingTextColor, incomingColor, incomingTextColor } = this.props;

    var chat_bubble_style = {};
    var text_style = {};

    if (outgoing) {
      chat_bubble_style = {
        ...this._outgoing_style,
        backgroundColor: outgoingColor,
      };
      text_style = {
        color: outgoingTextColor
      };
    } else {
      chat_bubble_style = {
        ...this._incoming_style,
        backgroundColor: incomingColor,
      };
      text_style = {
        color: incomingTextColor
      };
    }

    /* create sender text if available */
    var sender_name = null;
    if (sender) {
      sender_name = (
        <Text style={[text_style, {fontFamily: 'CeraPRO-Bold'}]}>
          {sender}
        </Text>
      );
    }


    return (
      <View style={styles.container}>
        <View style={[styles.chat_bubble, chat_bubble_style]}>
          {sender_name}
          <Text style={[text_style, {fontFamily: 'CeraPRO-Regular'}]}>{message}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 10,
    marginRight: 10,
    flex: 1,
  },
  chat_bubble: {
    overflow: 'hidden',
    padding: 10,
    borderRadius: 5,
    width: '70%',
  }
});

module.exports = ChatBubble;
