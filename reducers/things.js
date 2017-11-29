/* @flow */

import { SET_THINGS_STATES,
         SET_THING_STATE,
         SET_THINGS_PARTIAL_STATES,
         SET_THING_PARTIAL_STATE }
         from '../actions/things';

const defaultState = {
  things_states: {}
};

const cloneObject = (object: Object): Object => {
  return JSON.parse(JSON.stringify(object))
}

module.exports = (state: Object = defaultState, action: Object): Object => {
  /* clone state */
  var new_state: Object = cloneObject(state);

  switch(action.type) {

    /* sets/updates state for multiple things */
    case SET_THINGS_STATES:
      new_state.things_states = {
        ...new_state.things_states,
        ...action.things_states
      };
      break;

    /* sets/updates state for single thing */
    case SET_THING_STATE:
      new_state.things_states[action.thing_id] = action.thing_state;
      break;

    /* updates partial state for multiple things */
    case SET_THINGS_PARTIAL_STATES:
      for (var thing_id in action.things_partial_states) {
        new_state.things_states[thing_id] = {
          ...new_state.thing_state[thing_id],
          ...actions.things_partial_states[thing_id]
        };
      }
      break;

    /* updates partial state for single thing */
    case SET_THING_PARTIAL_STATE:
      new_state.things_states[action.thing_id] = {
        ...new_state.thing_state[action.thing_id],
        ...action.thing_partial_state
      };
      break;
  }

  return new_state;
}
