import React from "react";
import ReactDOM from "react-dom";
import { createStore } from "redux";
// import thunk from "redux-thunk";
import { Provider } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import App from "./containers/App";
import reducers from "./reducers";
import { CssBaseline } from "@material-ui/core";

const composeEnhancer = composeWithDevTools({});
const store = createStore(reducers, composeEnhancer());

ReactDOM.render(
  <React.Fragment>
    <CssBaseline />
    <Provider store={store}>
      <App />
    </Provider>
  </React.Fragment>,
  document.querySelector("main"),
);
