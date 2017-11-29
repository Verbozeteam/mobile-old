/* @flow */

export const SET_THINGS_STATES = 'SET_THINGS_STATES';
export const SET_THING_STATE = 'SET_THING_STATE';
export const SET_THINGS_PARTIAL_STATES = 'SET_THINGS_PARTIAL_STATES';
export const SET_THING_PARTIAL_STATE = 'SET_THING_PARTIAL_STATE';

/* sets/updates state for multiple things */
export function setThingsStates(things_states: Object) {
  return {
    type: SET_THINGS_STATES,
    things_states
  };
};

/* sets/updates state for single thing */
export function setThingState(thing_state: Object) {
  return {
    type: SET_THING_STATE,
    thing_state
  };
};


/* updates partial state for multiple things */
export function setThingsPartialStates(things_partial_states: Object) {
  return {
    type: SET_THINGS_PARTIAL_STATES,
    things_partial_states
  };
};

/* updates partial state for single thing */
export function setThingPartialState(thing_partial_state: Object) {
  return {
    type: SET_THING_PARTIAL_STATE,
    thing_partial_state
  };
};
