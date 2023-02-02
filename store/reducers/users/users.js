import * as actionTypes from "../../actions/actionTypes";

import { updateObject } from "../utility";

const initialState = {
  users: [],
}

const reducer = (state = initialState, action) => {

  switch (action.type) {
    case actionTypes.GET_USER_DATA:
      return updateObject(state, {
        users: [...action.payload]
      });
      
    default:
      return state;
  }
}

export default reducer;