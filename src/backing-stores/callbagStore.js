import React, {Component} from 'react'
import * as cb from 'callbag-basics'
import observe from 'callbag-observe'
import {createStore} from '../psyducks'

const StoreContext = React.createContext()

const createCallbagBackingStore = (initialState = {}) => {
  let store = {...initialState}
  let observers = []

  const subscribable = {
    subscribe: observer => {
      observers.push(observer)
    },
    notify: nextState => {
      observers.forEach(o => o.next(nextState))
    },
  }

  const source = cb.fromObs(subscribable)

  return {
    getState: () => store,
    setState: nextState => {
      store = nextState
      subscribable.notify(nextState)
    },
    source,
  }
}

class Provider extends Component {
  constructor(props) {
    super(props)
    const backingStore = createCallbagBackingStore(this.props.initialState)
    this.store = createStore(this.props.reducer, backingStore)
    observe(nextState => this.forceUpdate())(backingStore.source) // 0
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

const Consumer = StoreContext.Consumer

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

export {Provider, Consumer, StoreContext, Example, createCallbagBackingStore}
