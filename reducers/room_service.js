/* @flow */

import { ADD_OUTGOING_CHAT_MESSAGE,
         ADD_INCOMING_CHAT_MESSAGE,
         REQUEST_SERVICE,
         SET_REQUESTED_SERVICE_DONE,
         SET_REQUESTED_SERVICE_CANCELLED }
         from '../actions/room_service';

type MessageType = {
  sender?: string,
  message: string,
  outgoing: boolean
};

type RequestType = {
  id: number,
  service_id: number,
  notes?: string
};

const defaultState = {
  chat_messages: [],
  requests: []
};

const cloneObject = (object: Object): Object => {
  return JSON.parse(JSON.stringify(object));
}

module.exports = (state: Object = defaultState, action: Object): Object => {
  /* clone state */
  var new_state: Object = cloneObject(state);

  switch(action.type) {
    case ADD_OUTGOING_CHAT_MESSAGE:
    case ADD_INCOMING_CHAT_MESSAGE:
      new_state.chat_messages.push(action.message);
      break;

    case REQUEST_SERVICE:
      const request = {
        // TODO: do this properly
        id: state.requests.length,
        service_id: action.service_id,
        notes: action.notes
      };

      new_state.requests.push(request);
  }

  return new_state;
}
