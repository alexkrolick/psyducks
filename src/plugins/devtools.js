/**
 * Compatibility layer for Redux Devtools
 * Implementation details from https://github.com/deamme/laco
 */

let devTools

const isDevelopment =
  typeof window !== 'undefined' && process.env.NODE_ENV !== 'production'

function unsafe_global_connect() {
  if (window.__REDUX_DEVTOOLS_EXTENSION__) {
    devTools = window.__REDUX_DEVTOOLS_EXTENSION__.connect()
    devTools.init({})
  }
}

// Adds support for time-travel actions to reducer
export function enhanceReducerWithDevtools(reducer) {
  return (state, action) => {
    const {type, ...payload} = action
    if (type === 'JUMP_TO_STATE' || type === 'JUMP_TO_ACTION') {
      return JSON.parse(payload.state)
    } else {
      const nextState = reducer(state, action)
      if (devTools) {
        devTools.send(type, nextState)
      }
      return nextState
    }
  }
}

export function enhanceStoreWithDevtools(store) {
  unsafe_global_connect()
  if (isDevelopment && devTools) {
    devTools.subscribe(message => {
      const {payload: {type = ''} = {}, state = {}} = message
      switch (type) {
        case 'JUMP_TO_STATE':
        case 'JUMP_TO_ACTION':
          store.dispatch({type, state})
      }
    })
  }
  return store
}
