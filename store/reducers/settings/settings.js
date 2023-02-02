import {UPDATE_SETTING_RIGHT_SIDEBAR, UPDATE_SETTING_LEFT_SIDEBAR} from "../../actions/actionTypes";
import {updateObject} from "../utility";

const initialState = {
  left_sidebar: false,
  right_sidebar: false,
}

const reducer = (state = initialState, action) => {

  switch (action.type) {
    case UPDATE_SETTING_RIGHT_SIDEBAR:
      return updateObject(state, {
        right_sidebar: action.payload,
      });

    case UPDATE_SETTING_LEFT_SIDEBAR:
      return updateObject(state, {
        left_sidebar: action.payload,
      });

    default:
      return state;
  }
}

export default reducer;