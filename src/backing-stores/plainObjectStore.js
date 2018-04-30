import React, {Component} from 'react'
import {createStore} from '../psyducks'

const createPlainObjectBackingStore = (initialState = {}) => {
  let _store = {...initialState}
  return {
    getState: () => _store,
    setState: nextState => {
      _store = nextState
    },
  }
}

const StoreContext = React.createContext()

const Consumer = StoreContext.Consumer

class Provider extends Component {
  store = createStore(
    this.props.reducer,
    createPlainObjectBackingStore(this.props.initialState)
  )

  dispatch = (...args) => {
    this.store.dispatch.apply(this, args)
    this.updateConsumers()
  }

  createNextConsumerState = () => ({
    state: this.store.getState(),
    dispatch: this.dispatch,
  })

  updateConsumers = () =>
    this.setState({
      store: this.createNextConsumerState(),
    })

  state = {
    store: this.createNextConsumerState(),
  }

  render() {
    return (
      <StoreContext.Provider value={this.state.store}>
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

export {Provider, Consumer, StoreContext, Example}
