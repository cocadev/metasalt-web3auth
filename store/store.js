import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import usersReducer from './reducers/users/users';
import notificationReducer from './reducers/notifications/notifications';
import settingsReducer from './reducers/settings/settings';
import nftsReducer from './reducers/nfts/nfts';

const composeEnhancers = (typeof window !== 'undefined' && window).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const rootReducer = combineReducers({
  users: usersReducer,
  notifications: notificationReducer,
  settings: settingsReducer,
  nfts: nftsReducer,
});

const store = createStore(rootReducer, composeEnhancers(
  applyMiddleware(thunk))
);

export default store;
