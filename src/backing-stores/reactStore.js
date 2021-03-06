import React, {Component} from 'react'
import {createStore} from '../psyducks'

const StoreContext = React.createContext()

const Consumer = StoreContext.Consumer

const createReactBackingStore = (instance, key) => ({
  getState: () => instance.state[key],
  setState: nextState => instance.setState({[key]: nextState}),
})

class Provider extends Component {
  store = createStore(
    this.props.reducer,
    createReactBackingStore(this, 'storeData'),
  )

  state = {
    storeData: {...this.props.initialState},
  }

  render() {
    return (
      <StoreContext.Provider
        value={{
          state: this.store.getState(),
          dispatch: this.store.dispatch,
        }}
      >
        {this.props.children}
      </StoreContext.Provider>
    )
  }
}

const Example = () => (
  <React.Fragment>
    <span>
      Count: <Consumer>{({state}) => state.counter}</Consumer>
    </span>
    <Consumer>
      {({dispatch}) => (
        <span>
          <button onClick={() => dispatch({type: 'DEC'})}>- Dec</button>
          <button onClick={() => dispatch({type: 'INC'})}>Inc +</button>
        </span>
      )}
    </Consumer>
  </React.Fragment>
)

export {Provider, Consumer, StoreContext, Example, createReactBackingStore}
