import React, { Component } from "react";
import "./App.css";

const createStore = (reducer, { getState, setState }) => {
  return {
    dispatch: action => setState(reducer(getState(), action)),
    getState
  };
};

const createReactBackingStore = (instance, key) => ({
  getState: () => instance.state[key],
  setState: store => instance.setState({ [key]: store })
});

const actions = {
  inc: 'INC',
  dec: 'DEC',
}

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

const StoreContext = React.createContext();

class Provider extends Component {
  store = createStore(
    reducer,
    createReactBackingStore(this, "storeData")
  );

  state = { storeData: { counter: 0 } };

  render() {
    return (
      <StoreContext.Provider
        value={{ state: this.store.getState(), dispatch: this.store.dispatch }}
      >
        {this.props.children}
      </StoreContext.Provider>
    );
  }
}

class App extends Component {
  render() {
    return (
      <Provider>
        <p>
          Count:{" "}
          <StoreContext.Consumer>
            {({ state }) => state.counter}
          </StoreContext.Consumer>
        </p>
        <StoreContext.Consumer>
          {({ dispatch }) => (
            <p>
              <button onClick={() => dispatch({type: actions.dec})}>- Dec</button>
              <button onClick={() => dispatch({type: actions.inc})}>Inc +</button>
            </p>
          )}
        </StoreContext.Consumer>
      </Provider>
    );
  }
}

export default App;
