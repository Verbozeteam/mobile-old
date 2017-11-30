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
    case SET_THING_STATE:
      new_state.thingStates[action.thingId] = action.state;
      break;
    case SET_THINGS_STATES:
      new_state.thingStates = {
        ...new_state.thingStates,
        ...action.thingsToStates
      };
      break;
    case SET_THING_PARTIAL_STATE:
      new_state.thingStates[action.thingId] = {
        ...new_state.thingStates[action.thingId],
        ...action.state
      };
      break;
    case SET_THINGS_PARTIAL_STATES:
      for (var k in action.thingsToPartialStates)
        new_state.thingStates[k] = {
          ...new_state.thingStates[k],
          ...action.thingsToPartialStates[k],
        };
      break;
  }

  return new_state;
}
