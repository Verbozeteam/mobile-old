/* @flow */

const RoomsView = require('../components/RoomsView');
const AccountView = require('../components/AccountView');

export const structure = {
  Rooms: {
    screen: RoomsView,
    name: 'Rooms',
  },

  Account: {
    screen: AccountView,
    name: 'Account'
  }
};
