import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import "antd/dist/antd.css";
import Reducer from "./_reducers"; //index.js 안써도 됨

//redux
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import promiseMiddleware from "redux-promise"; //middle ware
import ReduxThunk from "redux-thunk"; //middle ware
const createStoreWithMiddleware = applyMiddleware(
  promiseMiddleware,
  ReduxThunk
)(createStore);

ReactDOM.render(
  // <Provider
  //   store={createStoreWithMiddleware(
  //     Reducer,
  //     window.__REDUX_DEVTOOLS_EXTENSION__ &&
  //       window.__REDUX_DEVTOOLS_EXTENSION__()
  //   )}
  // >
  //   <App />
  // </Provider>,
  <App />,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
