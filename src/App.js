import React, {Component} from 'react'
import * as cb from 'callbag-basics'
import observe from 'callbag-observe'
import once from 'lodash.once'

import './App.css'

const createStore = (reducer, {getState, setState}) => {
  return {
    dispatch: action => {
      const nextState = reducer(getState(), action)
      setState(nextState)
      return action
    },
    getState,
  }
}

const actions = {
  inc: 'INC',
  dec: 'DEC',
}

const reducer = (state, action) => {
  switch (action.type) {
    case actions.inc:
      return {...state, counter: state.counter + 1}
    case actions.dec:
      return {...state, counter: state.counter - 1}
    default:
      return state
  }
}

const StoreContext = React.createContext()

const createReactBackingStore = (instance, key) => ({
  getState: () => instance.state[key],
  setState: nextState => instance.setState({[key]: nextState}),
})

class ReactBackedProvider extends Component {
  store = createStore(reducer, createReactBackingStore(this, 'storeData'))

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

const createGenericBackingStore = (initialState = {}) => {
  let _store = {...initialState}
  return {
    getState: () => _store,
    setState: nextState => {
      _store = nextState
    },
  }
}

class GenericBackedProvider extends Component {
  store = createStore(
    reducer,
    createGenericBackingStore(this.props.initialState)
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

class CallbagBackedProvider extends Component {
  constructor(props) {
    super(props)
    const backingStore = createCallbagBackingStore(this.props.initialState)
    this.store = createStore(reducer, backingStore)
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

const ExampleConsumer = () => (
  <React.Fragment>
    <p>
      Count:{' '}
      <StoreContext.Consumer>
        {({state}) => state.counter}
      </StoreContext.Consumer>
    </p>
    <StoreContext.Consumer>
      {({dispatch}) => (
        <p>
          <button onClick={() => dispatch({type: actions.dec})}>- Dec</button>
          <button onClick={() => dispatch({type: actions.inc})}>Inc +</button>
        </p>
      )}
    </StoreContext.Consumer>
  </React.Fragment>
)

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <ReactBackedProvider initialState={{counter: 0}}>
          <h2>React-Backed Store</h2>
          <ExampleConsumer />
        </ReactBackedProvider>
        <GenericBackedProvider initialState={{counter: 0}}>
          <h2>Generic Object Store</h2>
          <ExampleConsumer />
        </GenericBackedProvider>
        <CallbagBackedProvider initialState={{counter: 0}}>
          <h2>Callbag Store</h2>
          <ExampleConsumer />
        </CallbagBackedProvider>
      </React.Fragment>
    )
  }
}

export default App
