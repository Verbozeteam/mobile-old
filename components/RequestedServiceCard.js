/* @flow */

import * as React from 'react';
import { View, Text, Button, Image, StyleSheet } from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

type ServiceType = {
  id: number,
  name: string,
  text?: string,
  image?: number
};

type PropsType = {
  id: number,
  notes?: string,
  service: ServiceType
};

type StateType = {};

class RequestedServiceCard extends React.Component<PropsType, StateType> {

  render() {
    const {id, notes, service, cancelRequest } = this.props;

    return (
      <LinearGradient colors={['#EEEEEE', '#CCCCCC']}
        start={{x: 1, y: 0}} end={{x: 0, y: 1}}
        style={styles.container}>
        <Text style={styles.name}>
          {service.name}
        </Text>

        <View style={styles.bottom_row}>
          <Button onPress={cancelRequest}
            title={'Cancel'}
            color={'#FFFFFF'}/>
          <Text style={styles.time_stamp}>
            Requested 5 mins ago
          </Text>
        </View>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
    marginBottom: 5,
    width: '100%',
    height: 120,
    borderRadius: 5,
    overflow: 'hidden',
    padding: 10,
  },
  name: {
    fontFamily: 'CeraPRO-Bold',
    color: '#222222',
    fontSize: 27,
    backgroundColor: 'transparent'
  },
  bottom_row: {
    position: 'absolute',
    padding: 10,
    right: 0,
    bottom: 0
  },
  time_stamp: {
    fontFamily: 'CeraPRO-Regular',
    color: '#222222',
    backgroundColor: 'transparent'
  }
});

module.exports = RequestedServiceCard;
