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
      this._onMessage({
        config: {rooms: [{
    "name": {"en": "habibi"},
    "grid": [{
        "ratio": 3,
        "panels": [{
            "ratio": 6,
            "name": {
                "en": "Room Lights",
                "ar": "إضائة الغرفة"
            },
            "things": [{
                "category": "dimmers",
                "name": {
                    "en": "Bedside",
                    "ar": "جانب السرير"
                },
                "id": "dimmer-1",
                "dimmer_port": "v1",
                "virtual_port_data": [[1, 60, 1, 4]],
                "default_wakeup_value": 100
            }, {
                "category": "light_switches",
                "name": {
                    "en": "Main",
                    "ar": "الرئيسي"
                },
                "switch_port": "d27",
                "id": "lightswitch-1",
                "default_wakeup_value": 1,
                "on_state": 0
            }, {
                "category": "light_switches",
                "name": {
                    "en": "Entrance",
                    "ar": "المدخل"
                },
                "switch_port": "d29",
                "id": "lightswitch-2",
                "default_wakeup_value": 1,
                "on_state": 0
            }],
            "presets": [{
                "dimmer-1": {
                    "intensity": 0
                },
                "lightswitch-1": {
                    "intensity": 0
                },
                "lightswitch-2": {
                    "intensity": 0
                }
            }, {
                "dimmer-1": {
                    "intensity": 50
                },
                "lightswitch-1": {
                    "intensity": 0
                },
                "lightswitch-2": {
                    "intensity": 1
                }
            }, {
                "dimmer-1": {
                    "intensity": 100
                },
                "lightswitch-1": {
                    "intensity": 1
                },
                "lightswitch-2": {
                    "intensity": 1
                }
            }]
        }, {
            "ratio": 3,
            "name": {
                "en": "Bathroom Lights",
                "ar": "إضاءة الحمام"
            },
            "things": [{
                "category": "dimmers",
                "name": {
                    "en": "Bathtub",
                    "ar": "حوض الاستحمام"
                },
                "id": "dimmer-2",
                "dimmer_port": "v2",
                "virtual_port_data": [[1, 60, 1, 5]],
                "default_wakeup_value": 0
            }, {
                "category": "light_switches",
                "name": {
                    "en": "Mirror",
                    "ar": "المرآة"
                },
                "switch_port": "d25",
                "id": "lightswitch-4",
                "default_wakeup_value": 0,
                "on_state": 0
            }, {
                "category": "light_switches",
                "name": {
                    "en": "Master",
                    "ar": "الرئيسي"
                },
                "switch_port": "d23",
                "id": "lightswitch-5",
                "default_wakeup_value": 0,
                "on_state": 0
            }],
            "presets": [{
                "dimmer-2": {
                    "intensity": 0
                },
                "lightswitch-4": {
                    "intensity": 0
                }
            }, {
                "dimmer-2": {
                    "intensity": 50
                },
                "lightswitch-4": {
                    "intensity": 0
                }
            }, {
                "dimmer-2": {
                    "intensity": 100
                },
                "lightswitch-4": {
                    "intensity": 1
                }
            }]
        }]
    }, {
        "ratio": 2,
        "panels": [{
            "ratio": 5,
            "name": {
                "en": "Air Conditioning",
                "ar": "التكييف"
            },
            "things": [{
                "category": "central_acs",
                "name": {
                    "en": "Air Conditioning",
                    "ar": "التكييف"
                },
                "temperature_port": "v0",
                "fan_port": "d35",
                "digital_valve_port": "d37",
                "virtual_port_data": [[0, 0]],
                "default_sleep_temperature": 25.0,
                "on_state": 0
            }]
        }, {
            "ratio": 5,
            "name": {
                "en": "Room Services",
                "ar": "خدمات الغرفة"
            },
            "things": [{
                "category": "hotel_controls",
                "name": {
                    "en": "Room Services",
                    "ar": "خدمات الغرفة"
                },
                "power_port": "d45",
                "hotel_card": "d41",
                "do_not_disturb_port": "d31",
                "room_service_port": "d33",
                "card_in_state": 0,
                "on_state": 0
            }]
        }]
    }],
    "detail": {
        "ratio": 4,
        "side": "right"
    },
    "layout": {
        "margin": 5
    }
}]}});
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
      //console.log('WebSocketCommunication message:', event);

      /* parse data as it may include echoed messages */
      const data = this.parseMessage(event.data);

      /* if data contains data, call onMessage callback */
      if (Object.keys(data).length > 0) {
        this._onMessage(data);
      }
    }
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

    //console.log('WebSocketCommunication sending:', message);
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
