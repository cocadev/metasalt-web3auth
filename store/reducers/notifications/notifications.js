import { ADD_NOTIFICATION, REMOVE_NOTIFICATION, BADGE_COUNT } from '../../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
  notification: null,
  type: null,
  additional: null,
  badgeCount: 0,
}

const reducer = (state = initialState, action) => {

  switch (action.type) {
    case ADD_NOTIFICATION:
      return updateObject(state, {
        notification: action.payload.content,
        type:action.payload.type,
        additional: action.payload.additional
      });

    case REMOVE_NOTIFICATION:
      return updateObject(state, {
        notification: null,
        type: null,
        additional: null
      });

    case BADGE_COUNT:
      return updateObject(state, {
        badgeCount: action.payload.badgeCount
      });

    default:
      return state;
  }
}

export default reducer;
