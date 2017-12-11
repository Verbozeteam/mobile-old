/* @flow */

const { ViewWrapper } = require('../components/ViewWrapper');
const RoomsView = require('../components/RoomsView');
const QRView = require('../components/QRView');
const AccountView = require('../components/AccountView');

export const structure = {
  Rooms: {
    screen: ViewWrapper(RoomsView),
    navigationOptions: {
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
      tabBarLabel: 'Account',
      drawerLabel: 'Account'
    }
  }
};

export const options = {
  lazyLoad: true,
};
