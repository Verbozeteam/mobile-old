/* @flow */

const { ViewWrapper } = require('../components/ViewWrapper');
const RoomsView = require('../components/RoomsView');
const AccountView = require('../components/AccountView');

export const structure = {
  Rooms: {
    screen: ViewWrapper(RoomsView),
    name: 'Rooms',
  },

  Account: {
    screen: ViewWrapper(AccountView),
    name: 'Account',
  }
};

export const options = {
  lazy: true,
};
