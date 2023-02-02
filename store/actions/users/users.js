import * as actionTypes from "../actionTypes";

export const getUserData = (data) => ({
  type: actionTypes.GET_USER_DATA,
  payload: data
});

export const getMagicData = (data) => ({
  type: actionTypes.GET_MAGIC_DATA,
  payload: data
});

export const logOutMagicData = () => ({
  type: actionTypes.LOG_OUT_MAGIC_DATA,
});