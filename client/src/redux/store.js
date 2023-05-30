import { createStore, applyMiddleware, compose } from "redux";
// Add your root reducer when ready
// import rootReducer from './reducers';

const initialState = {};

const middleware = [];

const store = createStore(
  // rootReducer,
  initialState,
  compose(
    applyMiddleware(...middleware),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

export default store;
