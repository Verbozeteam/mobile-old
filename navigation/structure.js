/* @flow */

import * as React from 'react';
import { Image } from 'react-native';

const { ViewWrapper } = require('../components/ViewWrapper');
const RoomsView = require('../components/RoomsView');
const QRView = require('../components/QRView');
const AccountView = require('../components/AccountView');

export const structure = {
  Rooms: {
    screen: ViewWrapper(RoomsView),
    navigationOptions: {
      tabBarIcon: <Image source={require('../assets/images/room_selected.png')} style={{height: 40, width: 40}} resizeMode={'contain'}></Image>,
      tabBarLabel: 'Rooms',
      drawerLabel: 'Rooms'
    }
  },

  ScanQR: {
    screen: ViewWrapper(QRView),
    navigationOptions: {
      tabBarLabel: 'Scan QR',
      drawerLabel: 'Scan QR'
    }
  },

  Account: {
    screen: ViewWrapper(AccountView),
    navigationOptions: {
      tabBarIcon: <Image source={require('../assets/images/cog_selected.png')} style={{height: 40, width: 40}} resizeMode={'contain'}></Image>,
      tabBarLabel: 'Account',
      drawerLabel: 'Account'
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
