/* @flow */

import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { connect as ReduxConnect } from 'react-redux';

const RoomServiceActions = require('../actions/room_service');

const ServiceButton = require('./ServiceButton');

type ServiceType = {
  id: number,
  name: string,
  text?: string,
  image?: number
};

type PropsType = {
  services: Array<ServiceType>,
  backgroundGradient?: [string, string],
  highlightGradient?: [string, string]
};

type StateType = {};

function mapStateToProps(state: Object) {
  return {
    requests: state.room_service.requests
  };
}

function mapDispatchToProps(dispatch: Function) {
  return {
    requestService: (id: number, notes?: string = '') => {
      dispatch(RoomServiceActions.requestService(id, notes))
    },

    cancelRequest: (request_id: number) => {
      dispatch(RoomServiceActions.setRequestedServiceDone(request_id))
    }
  };
}

class RoomServiceView extends React.Component<PropsType, StateType> {

  static defaultProps = {
    services: [
      {
        id: 0,
        name: 'Pillows',
        text: 'Same same mal bed',
        image: require('../assets/images/pillows_service_button.png')
      },
      {
        id: 1,
        name: 'Toiletries',
        text: 'Soap and Shampoo',
        image: require('../assets/images/toiletries_service_button.png')
      },
      {
        id: 2,
        name: 'Ironing',
        text: 'We will pickup',
        image: require('../assets/images/ironing_service_button.png')
      },
      {
        id: 3,
        name: 'Towels',
        image: require('../assets/images/towels_service_button.png')
      }
    ]
  };

  _renderRequestCard(request) {
    const { services } = this.props;

    return (
      <View style={styles.request_card}>
        <Text>{request.id} {request.service_id}</Text>
      </View>
    );
  }

  _createServiceButtons(services: Array<ServiceType>) {
    const { requestService } = this.props;

    if (services.length == 0) {
      return [];
    }

    const service_buttons = [];
    var service_ids = '';
    for (var i = 0; i < services.length && i < 2; i++) {
      service_ids += '-' + services[i].id;
      service_buttons.push(
        <ServiceButton key={'service-button-' + services[i].id}
          onPress={() => requestService(services[i].id)}
          {...services[i]} />
      );
    }

    if (service_buttons.length == 1) {
      service_buttons.unshift(
        <View key={'service-button-padding-left'}
          style={styles.service_button_padding}>
        </View>
      );
      service_buttons.push(
        <View key={'service-button-padding-right'}
          style={styles.service_button_padding}>
        </View>
      );
    }

    const services_row = [(
      <View key={'services-row' + service_ids}
        style={styles.services_row}>
        {service_buttons}
      </View>
    )];

    return services_row.concat(this._createServiceButtons(services.slice(2)));
  }

  createServiceButtons() {
    const { services } = this.props;

    return (
      <View style={styles.services}>
        {this._createServiceButtons(services)}
      </View>
    )
  }

  render() {
    const { requests } = this.props;

    /* create service buttons */
    const service_buttons = this.createServiceButtons()

    const requests_cards = [];
    for (var i = 0; i < requests.length; i++) {
      requests_cards.push(this._renderRequestCard(requests[i]));
    }

    return (
      <View style={styles.container}>
        {service_buttons}
        <View style={styles.requests_history}>
          {requests_cards}
        </View>
      </View>
    );
  }
}

RoomServiceView.contextTypes = {
  store: PropTypes.object
};

RoomServiceView = ReduxConnect(mapStateToProps, mapDispatchToProps) (RoomServiceView);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#161819'
  },
  services: {
    flex: 1,
  },
  services_row: {
    flexDirection: 'row'
  },
  service_button_padding: {
    flex: 1,
  },
  requests_history: {
    flex: 1
  },
  request_card: {
    flex: 1,
    height: 90
  }
});

module.exports = RoomServiceView;
