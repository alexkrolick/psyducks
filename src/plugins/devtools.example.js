import React, {Component} from 'react'
import {createStore} from '../psyducks'
import {createReactBackingStore} from '../backing-stores/reactStore'
import {enhanceReducerWithDevtools, enhanceStoreWithDevtools} from './devtools'

const StoreContext = React.createContext()

const Consumer = StoreContext.Consumer

class Provider extends Component {
  constructor(props) {
    super(props)
    const {reducer} = props
    const store = createStore(
      enhanceReducerWithDevtools(reducer),
      createReactBackingStore(this, 'storeData'),
    )
    this.store = enhanceStoreWithDevtools(store)
  }

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

export {Provider, Consumer, Example}
