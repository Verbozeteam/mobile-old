/* @flow */

export const ADD_OUTGOING_CHAT_MESSAGE = 'ADD_OUTGOING_CHAT_MESSAGE';
export const ADD_INCOMING_CHAT_MESSAGE = 'ADD_INCOMING_CHAT_MESSAGE';
export const REQUEST_SERVICE = 'REQUEST_SERVICE';
export const SET_REQUESTED_SERVICE_DONE = 'SET_REQUESTED_SERVICE_DONE';
export const SET_REQUESTED_SERVICE_CANCELLED = 'SET_REQUESTED_SERVICE_CANCELLED';

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

export function requestService(service_id: number, notes?: string = '') {
  return {
    type: REQUEST_SERVICE,
    service_id,
    notes
  };
}

export function setRequestedServiceDone(request_id: number) {
  return {
    type: SET_REQUESTED_SERVICE_DONE,
    request_id
  };
}

export function setRequestedServiceCancelled(request_id: number) {
  return {
    type: SET_REQUESTED_SERVICE_CANCELLED,
    request_id
  };
}
