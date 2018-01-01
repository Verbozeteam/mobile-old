/* @flow */

import * as React from 'react';
import { View, KeyboardAvoidingView, Text, Button,
  ScrollView, TextInput, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { connect as ReduxConnect } from 'react-redux';

const RoomServiceActions = require('../actions/room_service');

const ChatBubble = require('./ChatBubble');

type MessageType = {
  sender?: string,
  message: string,
  outgoing: boolean
};

type PropsType = {};
type StateType = {
  text: string
};

function mapStateToProps(state: Object) {
  return {
    messages: state.room_service.chat_messages
  };
}

function mapDispatchToProps(dispatch: Function) {
  return {
    addOutgoingChatMessage: (message: string) =>
      dispatch(RoomServiceActions.addOutgoingChatMessage(message)),
  };
}

class ChatView extends React.Component<PropsType, StateType> {

  state = {
    text: ''
  };

  sendMessage() {
    const { addOutgoingChatMessage } = this.props;
    const { text } = this.state;

    const message = {
      message: text,
      outgoing: true
    };

    addOutgoingChatMessage(message);

    /* set text to empty */
    this.setState({
      text: ''
    });
  }

  _renderChatBubble(index: number, message: MessageType) {
    return (
      <ChatBubble key={'chat-bubble-' + index}
        {...message} />
    );
  }

  render() {
    const { messages } = this.props;
    const { text } = this.state;

    const chat_bubbles = [];
    for (var i = 0; i < messages.length; i++) {
      chat_bubbles.push(this._renderChatBubble(i, messages[i]));
    }

    return (
        <KeyboardAvoidingView style={styles.container}
          behavior={'padding'}>
          <ScrollView>
            {chat_bubbles}
          </ScrollView>
          <View style={styles.text_input_container}>
            <View style={styles.text_input}>
              <TextInput
                autoFocus={true}
                placeholder={'Start a message'}
                multiline={true}
                style={{backgroundColor: 'transparent'}}
                onChangeText={(text) => this.setState({text})}
                returnKeyType={'default'}
                enablesReturnKeyAutomatically={true}
                value={text} />
            </View>
            <View style={styles.send_button}>
              <Button onPress={this.sendMessage.bind(this)}
                style={styles.send_button}
                title={'Send'}
                color={'#FFFFFF'} />
            </View>
          </View>
        </KeyboardAvoidingView>
    );
  }
}

ChatView.contextTypes = {
  store: PropTypes.object
};

ChatView = ReduxConnect(mapStateToProps, mapDispatchToProps) (ChatView);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#161819'
  },
  text_input_container: {
    flexDirection: 'row',
    height: 60,
    borderBottomWidth: 1,
    borderColor: '#161819',
    backgroundColor: '#111D37',
  },
  text_input: {
    flex: 1,
    borderRadius: 5,
    margin: 10,
    padding: 10,
    backgroundColor: '#EEEEEE'
  },
  send_button: {
    alignItems: 'center',
    justifyContent: 'center',
  }
  // text_input: {
  //   flex: 2,
  //   margin: 10,
  //   borderRadius: 5,
  //   padding: 10,
  //   backgroundColor: '#EEEEEE',
  // },
  // send_button: {
  //   flex: 1,
  //   margin: 10,
  //   borderRadius: 5,
  //   backgroundColor: '#0000FF'
  // }
});

module.exports = ChatView;
