import React, { Component } from "react";
import * as CallbagBacked from "./backing-stores/callbagStore";
import * as PlainObjectBacked from "./backing-stores/plainObjectStore";
import * as ReactBacked from "./backing-stores/reactStore";
import * as Devtools from './plugins/devtools.example'
import shallowMerge from "./plugins/shallowMerge";
import "./App.css";

const actions = {
  inc: "INC",
  dec: "DEC"
};

const reducer = (state, action) => {
  switch (action.type) {
    case actions.inc:
      return { ...state, counter: state.counter + 1 };
    case actions.dec:
      return { ...state, counter: state.counter - 1 };
    default:
      return state;
  }
};

/* # Plugin Setup */

/* ## shallowMerge */

// Alternative to a switch statement,
// fits well with shallowMerge/setState style reducer
const handlers = {
  [actions.inc]: state => ({ counter: state.counter + 1 }),
  [actions.dec]: state => ({ counter: state.counter - 1 })
};

const defaultHandler = state => state;

const setStateLike = (state, { type, ...payload }) =>
  (handlers[type] || defaultHandler)(state);

const shallowReducer = shallowMerge(setStateLike);

/* # Demo */

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <h1>Stores</h1>

        <h2>React-Backed Store</h2>
        <ReactBacked.Provider initialState={{ counter: 0 }} reducer={reducer}>
          <ReactBacked.Example />
        </ReactBacked.Provider>

        <h2>Plain Object Store</h2>
        <PlainObjectBacked.Provider
          initialState={{ counter: 0 }}
          reducer={reducer}
        >
          <PlainObjectBacked.Example />
        </PlainObjectBacked.Provider>

        <h2>Callbag Store</h2>
        <CallbagBacked.Provider initialState={{ counter: 0 }} reducer={reducer}>
          <CallbagBacked.Example />
        </CallbagBacked.Provider>

        <h1>Plugins</h1>

        <h2>Shallow Merge ("setState"-like)</h2>
        <PlainObjectBacked.Provider
          initialState={{ counter: 0 }}
          reducer={shallowReducer}
        >
          <PlainObjectBacked.Example />
        </PlainObjectBacked.Provider>

        <h2>Redux Devtools Compat</h2>
        <Devtools.Provider
          initialState={{ counter: 0 }}
          reducer={reducer}
        >
          <Devtools.Example />
        </Devtools.Provider>
      </React.Fragment>
    );
  }
}

export default App;
