/* @flow */

export const SET_OVERLAYING_PANEL = 'SET_OVERLAYING_PANEL';

export function set_overlaying_panel(room_name:string, panel_name: string, layout: Object) {
    return {
        type: SET_OVERLAYING_PANEL,
        panel_name: panel_name,
        room_name: room_name,
        background_layout: layout,
    }
}
