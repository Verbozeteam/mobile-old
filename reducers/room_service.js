/* @flow */

import { ADD_OUTGOING_CHAT_MESSAGE,
         ADD_INCOMING_CHAT_MESSAGE }
         from '../actions/room_service';

const defaultState = {
  chat_messages: []
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
  }

  return new_state;
}
