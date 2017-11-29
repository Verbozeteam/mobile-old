/* @flow */

import * as React from 'react';
import { View, Text, AppRegistry, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { connect as ReduxConnect } from 'react-redux';

const WebSocketCommunication = require('./lib/WebSocketCommunication');

const ConnectionActions = require('./actions/connection');
const ThingsActions = require('./actions/things');

const Room = require('./components/Room');

// TODO: globally define this
type WebSocketDataType = {

};

function mapStateToProps(state) {
  return {
    connection_state: state.connection.connection_state,
    config: state.connection.config
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
      dispatch(ThingsActions.setThingsStates(things_states));
    }
  };
}

type PropsType = {};

type StateType = {

};

class VerbozeMobile extends React.Component<PropsType, StateType> {

  _ws_url: string = 'wss://www.verboze.com/stream/35b4d595ef074543a2fa686650024d98';

  componentWillMount() {
    /* bind websocket callbacks */
    WebSocketCommunication.setOnConnected(this.onConnected.bind(this));
    WebSocketCommunication.setOnDisconnected(this.onDisconnected.bind(this));
    WebSocketCommunication.setOnMessage(this.onMessage.bind(this));
  }

  componentDidMount() {
    /* connect websocket */
    this.connect();
  }

  /* websocket connect */
  connect() {
    const { setConnectionState } = this.props;

    WebSocketCommunication.connect(this._ws_url);
    setConnectionState(1);
  }

  /* websocket callback on connect event */
  onConnected() {
    const { setConnectionState } = this.props;
    setConnectionState(2);

    WebSocketCommunication.sendMessage({
      code: 0
    });
  }

  /* websocket callback on disconnect event */
  onDisconnected() {
    const { setConnectionState } = this.props;
    setConnectionState(0);
  }

  /* websocket callback on message event */
  onMessage(data: WebSocketDataType) {
    const { setConfig, setThingsStates } = this.props;

    /* set config if provided */
    if ('config' in data) {
      setConfig(data.config);
      delete data['config'];
    }

    /* set things states if provided */
    if (Object.keys(data).length > 0) {
      setThingsStates(data);
    }
  }

  render() {
    const { connection_state, config } = this.props;

    console.log(connection_state, config);

    return (
      <View style={styles.container}>
        <View style={styles.top}>
          <Room name={'QSTP ROOM'} index={0} />
        </View>
        <Text style={styles.connection}>
          Connection: {connection_state}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  top: {
    flex: 1
  },
  connection: {
    flex: 1
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

const STORE = createStore(combineReducers({
  connection: ConnectionReducer,
  things: ThingsReducer
}));

class VerbozeMobileWrapper extends React.Component<any> {
  render() {
    return <Provider store={STORE}>
      <VerbozeMobile />
    </Provider>
  }
}

module.exports = VerbozeMobileWrapper;
