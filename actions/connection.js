/* @flow */

export const CHANGE_CONNECTION_STATE = 'CHANGE_CONNECTION_STATE';

export function changeConnectionState(is_connected: boolean) {
  return {
    type: CHANGE_CONNECTION_STATE,
    is_connected
  }
};

// export const CONNECT = 'connect';
// export const DISCONNECT = 'disconnect';
//
// export function connect(url: string) {
//   return {
//     type: CONNECT,
//     url
//   };
// };
//
// export function disconnect() {
//   return {
//     type: DISCONNECT
//   };
// };
