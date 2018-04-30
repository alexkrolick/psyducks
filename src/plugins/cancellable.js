/**
 * Returns previous state if reducer returns null
 */
export default function cancellable(reducer) {
  return (state, action) => {
    const nextState = reducer(state, action)
    if (nextState == null) return state
    return nextState
  }
}
