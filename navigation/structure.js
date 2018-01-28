/* @flow */

import * as React from 'react';
import { Image } from 'react-native';

const { ViewWrapper } = require('../components/ViewWrapper');
const RoomsView = require('../components/RoomsView');
const RoomServiceView = require('../components/RoomServiceView');
const ChatView = require('../components/ChatView');
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

  RoomService: {
    screen: ViewWrapper(RoomServiceView),
    navigationOptions: {
      tabBarIcon: <Image source={require('../assets/images/room_service_selected.png')} style={{height: 40, width: 40}} resizeMode={'contain'}></Image>,
      tabBarLabel: 'Services',
      drawerLabel: 'Services'
    }
  },

  Chat: {
    screen: ViewWrapper(ChatView),
    navigationOptions: {
      tabBarIcon: <Image source={require('../assets/images/chat_selected.png')} style={{height: 40, width: 40}} resizeMode={'contain'}></Image>,
      tabBarLabel: 'Chat',
      drawerLabel: 'Chat'
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
      backgroundColor: '#0f1f3f'
    },
    activeTintColor: '#68B6E6',
    inactiveTintColor: '#FFFFFF',
    labelStyle: {
      fontSize: 14,
      fontFamily: 'CeraPRO-Regular'
    }
  }
};
