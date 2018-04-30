/**
 * Shallow merge wraps a reducer to allow returning a partial update,
 * like React elements' setState method.
 * This removes the need for some immutability boilerplate.
 */
export default function shallowMerge(reducer) {
  return (state, action) => {
    const partialUpdate = reducer(state, action)
    return {...state, ...partialUpdate}
  }
}
