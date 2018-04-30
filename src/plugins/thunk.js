/**
 * Calls functions
 */
export default function shallowMerge(reducer) {
  return (state, action) => {
    const partialUpdate = reducer(state, action)
    return { ...state, ...partialUpdate }
  }
}
