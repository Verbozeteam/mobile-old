/* @flow */

export const SET_CONNECTION_STATE = 'SET_CONNECTION_STATE';
export const SET_CONFIG = 'SET_CONFIG';
export const SET_WEBSOCKET_URL = 'SET_WEBSOCKET_URL';
export const SET_QR_READER_STATE = 'SET_QR_READER_STATE';

/* set WebSocket connection state */
export function setConnectionState(connection_state: number) {
  return {
    type: SET_CONNECTION_STATE,
    connection_state
  };
};

/* sets config */
export function setConfig(config: Object) {
  return {
    type: SET_CONFIG,
    config
  };
};

/* set WebSocket token */
export function setWebSocketUrl(ws_url: string) {
  return {
    type: SET_WEBSOCKET_URL,
    ws_url
  };
};

/* set QR reader on/off */
export function setQRReaderState(isOn: boolean) {
  return {
    type: SET_QR_READER_STATE,
    isOn,
  };
};
