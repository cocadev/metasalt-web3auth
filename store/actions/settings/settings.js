import * as actionTypes from "../actionTypes";

export const updateLeftSidebar = (data) => ({
  type: actionTypes.UPDATE_SETTING_LEFT_SIDEBAR,
  payload: data
});

export const updateRightSidebar = (data) => ({
  type: actionTypes.UPDATE_SETTING_RIGHT_SIDEBAR,
  payload: data
});