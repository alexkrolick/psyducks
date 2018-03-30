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

export {createStore}
