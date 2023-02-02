import * as actionTypes from '../actionTypes';

export const addNotification = (content, type, additional) => ({
  type: actionTypes.ADD_NOTIFICATION,
  payload: { content, type, additional }
});

export const removeNotification = () => ({
  type: actionTypes.REMOVE_NOTIFICATION,
  payload: null
});

export const updateBadgeCount = (badgeCount) => ({
  type: actionTypes.BADGE_COUNT,
  payload: { badgeCount }
});
