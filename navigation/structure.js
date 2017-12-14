/* @flow */

import * as React from 'react';
import { Image } from 'react-native';

const { ViewWrapper } = require('../components/ViewWrapper');
const RoomsView = require('../components/RoomsView');
const AccountView = require('../components/AccountView');

export const structure = {
  Rooms: {
    screen: ViewWrapper(RoomsView),
    navigationOptions: {
      title: 'Rooms',
      tabBarIcon: <Image source={require('../assets/images/room_selected.png')} style={{height: 40, width: 40}} resizeMode={'contain'}></Image>
    }
  },

  Account: {
    screen: ViewWrapper(AccountView),
    navigationOptions: {
      title: 'Account',
      tabBarIcon: <Image source={require('../assets/images/cog_selected.png')} style={{height: 40, width: 40}} resizeMode={'contain'}></Image>
    }
  }
};

export const options = {
  lazy: true,
  tabBarOptions: {
    style: {
      backgroundColor: '#182434'
    },
    activeTintColor: '#68B6E6',
    inactiveTintColor: '#FFFFFF',
    labelStyle: {
      fontSize: 14,
      fontFamily: 'CeraPRO-Regular'
    }
  }
};
