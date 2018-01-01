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
    addOutgoingChatMessage: (message: string) => {
      dispatch(RoomServiceActions.addOutgoingChatMessage(message));
    },

    // TODO: remove the following as it's not needed
    addIncomingChatMessage: (message: string) => {
      dispatch(RoomServiceActions.addIncomingChatMessage(message))
    }
  };
}

class ChatView extends React.Component<PropsType, StateType> {

  state = {
    text: ''
  };

  _scroll_view = null;

  sendMessage() {
    const { addOutgoingChatMessage, addIncomingChatMessage } = this.props;
    var { text } = this.state;

    text = text.trim();
    if (text.length == 0) {
      this.setState({
        text: ''
      });

      return;
    }

    const message = {
      message: text,
      outgoing: true
    };

    addOutgoingChatMessage(message);

    setTimeout(() => {
      const message = {
        message: text,
        sender: 'Yusuf Musleh [Conceirge]',
        outgoing: false
      };

      addIncomingChatMessage(message);
    }, 5000);

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

  _scrollToChatEnd() {
    this._scroll_view.scrollToEnd({animated: true});
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
          <ScrollView ref={(c) => this._scroll_view = c}
            onLayout={this._scrollToChatEnd.bind(this)}
            onContentSizeChange={this._scrollToChatEnd.bind(this)}>
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
});

module.exports = ChatView;
