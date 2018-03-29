import React, {Component} from 'react'
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

const createReactBackingStore = (instance, key) => ({
  getState: () => instance.state[key],
  setState: nextState => instance.setState({[key]: nextState}),
})

const createGenericBackingStore = (initialState = {}) => {
  let _store = {...initialState}
  return {
    getState: () => _store,
    setState: nextState => {
      _store = nextState
    },
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

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <h2>React-Backed Store</h2>
        <ReactBackedProvider initialState={{counter: 0}}>
          <p>
            Count:{' '}
            <StoreContext.Consumer>
              {({state}) => state.counter}
            </StoreContext.Consumer>
          </p>
          <StoreContext.Consumer>
            {({dispatch}) => (
              <p>
                <button onClick={() => dispatch({type: actions.dec})}>
                  - Dec
                </button>
                <button onClick={() => dispatch({type: actions.inc})}>
                  Inc +
                </button>
              </p>
            )}
          </StoreContext.Consumer>
        </ReactBackedProvider>
        <h2>Generic Object Store</h2>
        <GenericBackedProvider initialState={{counter: 0}}>
          <p>
            Count:{' '}
            <StoreContext.Consumer>
              {({state}) => state.counter}
            </StoreContext.Consumer>
          </p>
          <StoreContext.Consumer>
            {({dispatch}) => (
              <p>
                <button onClick={() => dispatch({type: actions.dec})}>
                  - Dec
                </button>
                <button onClick={() => dispatch({type: actions.inc})}>
                  Inc +
                </button>
              </p>
            )}
          </StoreContext.Consumer>
        </GenericBackedProvider>
      </React.Fragment>
    )
  }
}

export default App
