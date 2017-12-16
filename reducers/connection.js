/* @flow */

import {
  SET_CONNECTION_STATE,
  SET_CONFIG,
  SET_WEBSOCKET_URL,
  SET_QR_READER_STATE
} from '../actions/connection';

type StateType = {
  connection_state: 0 | 1 | 2,
  ws_url: string,
  qr_reader_on: boolean,
  config: Object
}

const defaultState: StateType = {
  /* 0 - not connected, 1 - connecting, 2 - connected */
  connection_state: 0,
  ws_url: 'wss://www.verboze.com/stream/35b4d595ef074543a2fa686650024d98',
  qr_reader_on: false,
  config: {}
};

const cloneObject = (object: Object): Object => {
  return JSON.parse(JSON.stringify(object));
}

module.exports = (state: StateType = defaultState, action: Object) => {
  var new_state: StateType = cloneObject(state);

  switch(action.type) {
    /* set WebSocket connection state */
    case SET_CONNECTION_STATE:
      new_state.connection_state = action.connection_state;
      break;

    /* sets config */
    case SET_CONFIG:
      new_state.config = action.config;
      break;

    /* set WebSocket token */
    case SET_WEBSOCKET_URL:
      new_state.ws_url = action.ws_url;
      break;

    case SET_QR_READER_STATE:
      new_state.qr_reader_on = action.isOn;
      break;
  }

  return new_state;
}
