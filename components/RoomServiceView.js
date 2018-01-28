/* @flow */

import * as React from 'react';
import { View, Text, ScrollView, StyleSheet, LayoutAnimation, Platform,
  UIManager } from 'react-native';
import PropTypes from 'prop-types';
import { connect as ReduxConnect } from 'react-redux';

const RoomServiceActions = require('../actions/room_service');

const ServiceButton = require('./ServiceButton');
const ServiceDialogue = require('./ServiceDialogue');
const RequestedServiceCard = require('./RequestedServiceCard');

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

type StateType = {
  dialogue: number
};

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
      dispatch(RoomServiceActions.setRequestedServiceCancelled(request_id))
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

  state = {
    dialogue: -1
  };

  componentWillMount() {
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  _getServiceFromId(service_id: number): Object {
    const { services } = this.props;

    return services.find((service) => {
      return service.id === service_id
    });
  }

  _renderRequestCard(request) {
    const { services, cancelRequest } = this.props;
    const service = this._getServiceFromId(request.id);

    return (
      <RequestedServiceCard key={'requested-service-card-' + request.id}
        {...request}
        service={service}
        cancelRequest={() => cancelRequest(service.id)}/>
    );
  }

  toggleServiceDialogue(service_id: number = -1) {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    this.setState({
      dialogue: service_id
    });
  }

  _createServiceButtons(services: Array<ServiceType>) {
    if (services.length == 0) {
      return [];
    }

    const service_buttons = [];
    var service_ids = '';
    for (var i = 0; i < services.length && i < 2; i++) {
      const service_id = services[i].id;
      service_ids += '-' + service_id;
      service_buttons.push(
        <ServiceButton key={'service-button-' + service_id}
          onPress={() => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
            this.toggleServiceDialogue(service_id);
          }}
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
    const { requests, requestService } = this.props;
    const { dialogue } = this.state;

    /* create service buttons */
    const service_buttons = this.createServiceButtons()

    const requests_cards = [];
    for (var i = 0; i < requests.length; i++) {
      requests_cards.push(this._renderRequestCard(requests[i]));
    }

    /* create dialogue box */
    var dialogue_overlay = null;
    if (dialogue > -1) {
      const service = this._getServiceFromId(dialogue);
      dialogue_overlay = (
        <View style={styles.dialogue_overlay}>
          <ServiceDialogue service={service}
            closeDialogue={this.toggleServiceDialogue.bind(this)}
            submitService={() => requestService(service.id)} />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        {service_buttons}
        <View style={styles.requests_history}>
          <Text style={styles.header}>
            Requested Services
          </Text>
          <ScrollView>
            {requests_cards}
          </ScrollView>
        </View>
        {dialogue_overlay}
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
  dialogue_overlay: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)'
  },
  header: {
    fontSize: 27,
    fontFamily: 'CeraPRO-Bold',
    color: '#FFFFFF'
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
    flex: 1,
    padding: 10,
  },
  request_card: {
    flex: 1,
    height: 90
  }
});

module.exports = RoomServiceView;
