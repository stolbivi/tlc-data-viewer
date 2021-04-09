import React from "react";
import { applyMiddleware, createStore, Store } from "redux";
import thunk from "redux-thunk";
import { Provider } from "react-redux";
import reducer from "../store/Reducer";

const store: Store<ZoneState, ZoneAction> & {
  dispatch: Dispatch;
} = createStore(reducer, applyMiddleware(thunk));

export const ReduxWrapper: React.FC = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};
