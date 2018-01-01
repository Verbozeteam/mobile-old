/* @flow */

export const ADD_OUTGOING_CHAT_MESSAGE = 'ADD_OUTGOING_CHAT_MESSAGE';
export const ADD_INCOMING_CHAT_MESSAGE = 'ADD_INCOMING_CHAT_MESSAGE';

export function addOutgoingChatMessage(message: Object) {
  return {
    type: ADD_OUTGOING_CHAT_MESSAGE,
    message
  };
}

export function addIncomingChatMessage(message: Object) {
  return {
    type: ADD_INCOMING_CHAT_MESSAGE,
    message
  };
}
