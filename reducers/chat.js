/* @flow */

import { ADD_OUTGOING_MESSAGE,
         ADD_INCOMING_MESSAGE }
         from '../actions/chat';

const defaultState = {
  messages: []
};

const cloneObject = (object: Object): Object => {
  return JSON.parse(JSON.stringify(object));
}

module.exports = (state: Object = defaultState, action: Object): Object => {
  /* clone state */
  var new_state: Object = cloneObject(state);

  switch(action.type) {
    case ADD_OUTGOING_MESSAGE:
    case ADD_INCOMING_MESSAGE:
      new_state.messages.push(action.message);
      break;
  }

  return new_state;
}
