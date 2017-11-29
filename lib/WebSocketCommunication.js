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

  _fake_config = '{"central-ac-v0-d50": {"category": "central_acs", "fan": 1, "set_pt": 25, "temp": 25, "token": ""}, "config": {"rooms": [{"detail": {"ratio": 4, "side": "right"}, "grid": [{"panels": [{"name": {"ar": "\u0625\u0636\u0627\u0621\u0629 \u0627\u0644\u063a\u0631\u0641\u0629", "en": "Room Lighting"}, "presets": [{"dimmer-1": {"intensity": 0}, "lightswitch-1": {"intensity": 0}, "lightswitch-2": {"intensity": 0}, "lightswitch-3": {"intensity": 0}}, {"dimmer-1": {"intensity": 25}, "lightswitch-1": {"intensity": 0}, "lightswitch-2": {"intensity": 1}, "lightswitch-3": {"intensity": 1}}, {"dimmer-1": {"intensity": 100}, "lightswitch-1": {"intensity": 1}, "lightswitch-2": {"intensity": 1}, "lightswitch-3": {"intensity": 1}}], "ratio": 5, "things": [{"category": "dimmers", "id": "dimmer-1", "name": {"ar": "\u062c\u0627\u0646\u0628 \u0627\u0644\u0633\u0631\u064a\u0631", "en": "Bedside"}}, {"category": "light_switches", "id": "lightswitch-1", "name": {"ar": "\u0627\u0644\u0631\u0626\u064a\u0633\u064a", "en": "Main"}}, {"category": "light_switches", "id": "lightswitch-2", "name": {"ar": "\u0627\u0644\u062c\u0627\u0646\u0628\u064a", "en": "Side"}}, {"category": "light_switches", "id": "lightswitch-3", "name": {"ar": "\u0627\u0644\u0645\u062f\u062e\u0644", "en": "Entrance"}}]}, {"name": {"ar": "\u0625\u0636\u0627\u0621\u0629 \u0627\u0644\u062d\u0645\u0627\u0645", "en": "Bathroom Lighting"}, "presets": [{"dimmer-2": {"intensity": 0}, "lightswitch-4": {"intensity": 0}}, {"dimmer-2": {"intensity": 50}, "lightswitch-4": {"intensity": 0}}, {"dimmer-2": {"intensity": 100}, "lightswitch-4": {"intensity": 1}}], "ratio": 3, "things": [{"category": "dimmers", "id": "dimmer-2", "name": {"ar": "\u0627\u0644\u0631\u0626\u064a\u0633\u064a", "en": "Main"}}, {"category": "light_switches", "id": "lightswitch-4", "name": {"ar": "\u0627\u0644\u0645\u0631\u0622\u0629", "en": "Mirror"}}]}], "ratio": 3}, {"panels": [{"name": {"ar": "\u0627\u0644\u062a\u0643\u064a\u064a\u0641", "en": "Air Conditioning"}, "ratio": 5, "things": [{"category": "central_acs", "id": "central-ac-v0-d50", "name": {"ar": "\u0627\u0644\u062a\u0643\u064a\u064a\u0641", "en": "Air Conditioning"}}]}, {"name": {"ar": "\u062e\u062f\u0645\u0627\u062a \u0627\u0644\u063a\u0631\u0641\u0629", "en": "Room Service"}, "ratio": 5, "things": [{"category": "hotel_controls", "id": "hotel-controls-d51", "name": {"ar": "\u062e\u062f\u0645\u0627\u062a \u0627\u0644\u063a\u0631\u0641\u0629", "en": "Room Service"}}]}], "ratio": 2}], "layout": {"margin": 5}, "name": {"en": "QSTP Room"}}]}, "dimmer-1": {"intensity": 0, "token": ""}, "dimmer-2": {"intensity": 0, "token": ""}, "hotel-controls-d51": {"card": 1, "do_not_disturb": 0, "power": 1, "room_service": 0, "token": ""}, "lightswitch-1": {"intensity": 0, "token": ""}, "lightswitch-2": {"intensity": 0, "token": ""}, "lightswitch-3": {"intensity": 0, "token": ""}, "lightswitch-4": {"intensity": 0, "token": ""}}';

  /* websocket event callbacks that are set externally */
  _onConnected: () => null = () => null;
  _onDisconnected: () => null = () => null;
  _onMessage: (data: WebSocketDataType) => null = (data) => null;

  _message_buffer = [];

  constructor() {
    console.log('WebSocketCommunication constructor()');
    /* create new UUID token to be included in every message that is sent */
    this._token = UUID.v4();
  }

  connect(url) {
    this._url = url;
    this._ws = new WebSocket(url);

    console.log('WebSocketCommunication connect()');

    this._ws.onopen = () => {
      console.log('WebSocketCommunication connected');
      this._is_connected = true;

      this._onConnected();

      // TODO: remove this
      this.fakeCode0();
    }

    this._ws.onclose = () => {
      console.log('WebSocketCommunication disconnected');
      this._is_connected = false;

      this._onDisconnected();
    }

    this._ws.onerror = (err) => {
      console.log('WebSocketCommunication error:', err);
      this._is_connected = false;
    }

    this._ws.onmessage = (event) => {
      console.log('WebSocketCommunication message:', event);

      /* parse data as it may include echoed messages */
      const data = this.parseMessage(event.data);

      /* if data contains data, call onMessage callback */
      if (Object.keys(data).length > 0) {
        this._onMessage(data);
      }
    }
  }

  fakeCode0() {
    const data = this.parseMessage(this._fake_config);
    this._onMessage(data);
  }

  disconnect() {
    if (this._ws) {
      this._ws.close();
    }
  }

  parseMessage(data_string: string): Object {
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

  sendMessage(message: Object) {
    message.token = this._token;

    console.log('WebSocketCommunication sending:', message);
    this._ws.send(JSON.stringify(message));
  }

  /* set onConnected callback from external source */
  setOnConnected(callback: () => null) {
    this._onConnected = callback;
  }

  /* set onDisconnected callback from external source */
  setOnDisconnected(callback: () => null) {
    this._onDisconnected = callback;
  }

  /* set onMessage callback from external source */
  setOnMessage(callback: (data: WebSocketDataType) => null) {
    this._onMessage = callback;
  }
}

module.exports = new WebSocketCommunication();
