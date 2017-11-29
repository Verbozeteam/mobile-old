import { CHANGE_CONNECTION_STATE } from '../actions/connection';

const defaultState = {
  is_connected: false,
};

module.exports = function(state=defaultState, action) {

  var new_state = {...state};

  switch(action.type) {
    case CHANGE_CONNECTION_STATE:
      new_state.is_connected = action.is_connected;
  }

  return new_state;
}
