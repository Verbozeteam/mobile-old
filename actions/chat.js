/* @flow */

export const ADD_OUTGOING_MESSAGE = 'ADD_OUTGOING_MESSAGE';
export const ADD_INCOMING_MESSAGE = 'ADD_INCOMING_MESSAGE';

export function addOutgoingMessage(message: Object) {
  return {
    type: ADD_OUTGOING_MESSAGE,
    message
  };
}

export function addIncomingMessage(message: Object) {
  return {
    type: ADD_INCOMING_MESSAGE,
    message
  };
}
