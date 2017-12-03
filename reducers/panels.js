/* @flow */

import { SET_OVERLAYING_PANEL }
         from '../actions/panels';

type StateType = {
    overlaying_room_name: string,
    overlaying_panel_name: string,
    background_layout: Object,
}

const defaultState: StateType = {
  overlaying_room_name: "",
  overlaying_panel_name: "",
  background_layout: {},
};

module.exports = (state: StateType = defaultState, action: Object) => {
  var new_state: StateType = {...state};

  switch(action.type) {
    /* set WebSocket connection state */
    case SET_OVERLAYING_PANEL:
      new_state.overlaying_room_name = action.room_name;
      new_state.overlaying_panel_name = action.panel_name;
      new_state.background_layout = action.background_layout;
      break;
  }

  return new_state;
}
