/* @flow */

const ReconnectingWebsocket = require('reconnecting-websocket');
const UUID = require('uuid');

type WebSocketDataType = {};

class WebSocketCommunication {

  /* state */
  _token: string;
  _ws: Object = null;
  _url: string = '';
  _is_connected: boolean = false;

  /* websocket event callbacks that are set externally */
  _onConnected: () => any = () => {};
  _onDisconnected: () => any = () => {};
  _onMessage: (data: WebSocketDataType) => any = (data) => {};

  _message_buffer = [];

  constructor() {
    console.log('WebSocketCommunication constructor()');
    /* create new UUID token to be included in every message that is sent */
    this._token = UUID.v4();
  }

  connect(url) {
    this._url = url;
    this._ws = new WebSocket(url);

    this._ws.onopen = () => {
      console.log('WebSocketCommunication connected');
      this._is_connected = true;

      return this._onConnected();
    }

    this._ws.onclose = () => {
      console.log('WebSocketCommunication disconnected');
      this._is_connected = false;

      return this._onDisconnected();
    }

    this._ws.onerror = (err) => {
      console.log('WebSocketCommunication error:', err);
      this._is_connected = false;
    }

    this._ws.onmessage = (event) => {
      /* parse data as it may include echoed messages */
      const data = this.parseMessage(event.data);

      /* if data contains data, call onMessage callback */
      if (Object.keys(data).length) {
        return this._onMessage(data);
      }
    }
  }

  disconnect() {
    if (this._ws) {
      this._ws.close();
    }
  }

  parseMessage(data_string: string) {
    const data = JSON.parse(data_string);

    /* go through objects in data and check if our token is included,
       if so, remove the object */
    var keys = Object.keys(data);
    for (var i = 0; i < keys.length; i++) {
      if (data[keys[i]].token && data[keys[i]].token == this._token) {
        delete data[keys[i]];
      }
    }

    return data;
  }

  sendMessage(msg: Object) {
    msg.token = this._token;
    this._ws.send(JSON.stringify(msg));
  }

  /* set onConnected callback from external source */
  setOnConnected(callback: () => any) {
    this._onConnected = callback;
  }

  /* set onDisconnected callback from external source */
  setOnDisconnected(callback: () => any) {
    this._onDisconnected = callback;
  }

  /* set onMessage callback from external source */
  setOnMessage(callback: (data: WebSocketDataType) => any) {
    this._onMessage = callback;
  }
}

module.exports = new WebSocketCommunication();
