import React, {Component} from 'react'
import * as CallbagBacked from './callbagStore'
import * as PlainObjectBacked from './plainObjectStore'
import * as ReactBacked from './reactStore'
import './App.css'

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

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <ReactBacked.Provider initialState={{counter: 0}} reducer={reducer}>
          <h2>React-Backed Store</h2>
          <ReactBacked.Example />
        </ReactBacked.Provider>
        <PlainObjectBacked.Provider
          initialState={{counter: 0}}
          reducer={reducer}
        >
          <h2>Plain Object Store</h2>
          <PlainObjectBacked.Example />
        </PlainObjectBacked.Provider>
        <CallbagBacked.Provider initialState={{counter: 0}} reducer={reducer}>
          <h2>Callbag Store</h2>
          <CallbagBacked.Example />
        </CallbagBacked.Provider>
      </React.Fragment>
    )
  }
}

export default App
