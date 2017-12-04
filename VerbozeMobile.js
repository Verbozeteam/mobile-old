/* @flow */

import * as React from 'react';
import { View, Text, AppRegistry, StyleSheet, Platform, StatusBar }
  from 'react-native';
import PropTypes from 'prop-types';
import { connect as ReduxConnect } from 'react-redux';

const WebSocketCommunication = require('./lib/WebSocketCommunication');

const ConnectionActions = require('./actions/connection');
const ThingsActions = require('./actions/things');

import Navigation from './navigation/Navigation';

import { WebSocketDataType, ConfigType } from './config/ConnectionTypes';

function mapStateToProps(state: Object) {
  return {
    connection_state: state.connection.connection_state,
    config: state.connection.config,
    overlay: state.panels.overlaying_room_name
  };
}

function mapDispatchToProps(dispatch: Function) {
  return {
    setConnectionState: (connection_state: number) => {
      dispatch(ConnectionActions.setConnectionState(connection_state));
    },
    setConfig: (config: Object) => {
      dispatch(ConnectionActions.setConfig(config));
    },
    setThingsStates: (things_states: Object) => {
      dispatch(ThingsActions.set_things_states(things_states));
    }
  };
}

class VerbozeMobile extends React.Component<any, any> {
  _ws_url: string = 'wss://www.verboze.com/stream/';
  _ws_token: string = '35b4d595ef074543a2fa686650024d98';

  _Navigation: React.Component;

  componentWillMount() : any {
    /* bind websocket callbacks */
    WebSocketCommunication.setOnConnected(this.onConnected.bind(this));
    WebSocketCommunication.setOnDisconnected(this.onDisconnected.bind(this));
    WebSocketCommunication.setOnMessage(this.onMessage.bind(this));

    /* change status bar to light */
    StatusBar.setBarStyle('light-content', true);
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor('#13162b', true);
    }
  }

  componentDidMount() : any {
    /* connect websocket */
    this.connect();
  }

  /* websocket connect */
  connect() : any {
    const { setConnectionState } = this.props;

    WebSocketCommunication.connect(this._ws_url + this._ws_token + '/');
    setConnectionState(1);
  }

  /* websocket callback on connect event */
  onConnected() : any {
    const { setConnectionState } = this.props;
    setConnectionState(2);

    WebSocketCommunication.sendMessage({
      code: 0
    });
  }

  /* websocket callback on disconnect event */
  onDisconnected() : any {
    const { setConnectionState, setConfig } = this.props;
    setConnectionState(0);
    setConfig(null);
  }

  /* websocket callback on message event */
  onMessage(data: WebSocketDataType) : any {
    const { setConfig, setThingsStates } = this.props;

    /* set config if provided */
    if ('config' in data) {
      console.log("got config: ", data.config);
      setConfig(data.config);
      delete data['config'];
    }

    /* set things states if provided */
    if (Object.keys(data).length > 0) {
      setThingsStates(data);
    }
  }

  render() {
    const { overlay } = this.props;

    return (
      <View style={styles.container}>
        <Navigation />
        <View pointerEvents={(overlay) ? 'auto' : 'none'}
          style={styles.overlay}>
          <RoomPanelOverlay />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%'
  }
});

VerbozeMobile.contextTypes = {
  store: PropTypes.object
};

VerbozeMobile = ReduxConnect(mapStateToProps, mapDispatchToProps) (VerbozeMobile);

/**
 * Create the Redux store and srap the application in a Redux context
 */

import { createStore, combineReducers, bindActionCreators } from 'redux';
import { Provider } from 'react-redux';

const ConnectionReducer = require('./reducers/connection');
const ThingsReducer = require('./reducers/things');
const PanelsReducer = require('./reducers/panels');

const RoomPanelOverlay = require('./components/RoomPanelOverlay');

const STORE = createStore(combineReducers({
  connection: ConnectionReducer,
  things: ThingsReducer,
  panels: PanelsReducer,
}));

class VerbozeMobileWrapper extends React.Component<any> {
  render() {
    return <Provider store={STORE}>
      <VerbozeMobile />
    </Provider>
  }
}

module.exports = VerbozeMobileWrapper;
