/* @flow */

import { SET_OVERLAYING_PANEL }
         from '../actions/panels';

type StateType = {
    overlaying_room_name: string,
    overlaying_panel_name: string,
}

const defaultState: StateType = {
  overlaying_room_name: "",
  overlaying_panel_name: "",
};

module.exports = (state: StateType = defaultState, action: Object) => {
  var new_state: StateType = {...state};

  switch(action.type) {
    /* set WebSocket connection state */
    case SET_OVERLAYING_PANEL:
      new_state.overlaying_room_name = action.room_name;
      new_state.overlaying_panel_name = action.panel_name;
      break;
  }

  return new_state;
}
