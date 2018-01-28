/* @flow */

import * as React from 'react';
import { View, KeyboardAvoidingView, Button, Text, TextInput, StyleSheet }
  from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

type ServiceType = {
  id: number,
  name: string,
  text?: string,
  image?: number
};

type PropsType = {
  service: ServiceType
};

type StateType = {};

class ServiceDialogue extends React.Component<PropsType, StateType> {

  _dialogue_gradient: [string, string] = ['#1c2f4f', '#0f1f3f'];

  render() {
    const { service, closeDialogue, submitService } = this.props;

    return (
      <KeyboardAvoidingView style={styles.container}
        behavior={'padding'}>
        <LinearGradient colors={this._dialogue_gradient}
          start={{x: 1, y: 0}} end={{x: 0, y: 1}}
          style={styles.dialogue}>
          <Text style={styles.name}>
            {service.name}
          </Text>
          <Text style={styles.text}>
            {service.text}
          </Text>
          <TextInput
            autoFocus={true}
            multiline={true}
            placeholder={'Please provide any additional notes...'}
            returnKeyType={'default'}
            style={styles.text_input}
            enablesReturnKeyAutomatically={true} />
          <View style={styles.buttons}>
            <Button onPress={() => {
              submitService();
              closeDialogue();
            }}
              style={styles.button}
              title={'Submit'}
              color={'#FFFFFF'} />a
            <Button onPress={closeDialogue}
              style={styles.button}
              title={'Cancel'}
              color={'#FFFFFF'} />
          </View>
        </LinearGradient>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  dialogue: {
    borderRadius: 2,
    overflow: 'hidden',
    padding: 10
  },
  name: {
    fontSize: 32,
    fontFamily: 'CeraPro-Bold',
    color: '#FFFFFF',
    backgroundColor: 'transparent'
  },
  text: {
    fontSize: 17,
    fontFamily: 'CeraPRO-Regular',
    color: '#FFFFFF',
    backgroundColor: 'transparent'
  },
  text_input: {
    marginTop: 10,
    marginBottom: 10,
    padding: 10,
    height: 50,
    fontFamily: 'CeraPRO-Regular',
    fontSize: 17,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  buttons: {
    height: 40,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  button: {
    flex: 1
  }
});

module.exports = ServiceDialogue;
