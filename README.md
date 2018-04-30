# Psyducks

Kind of like Redux.

The goal of this experiment are:
- decouple the "subscribe" part of Redux from the reduce/dispatch
- shrink the API to just a few functions and reimplement a lot of the functionality as (optional) higher-order functions.

## API
### `createStore` ([src](./src/psyducks.js))

Takes a `reducer` and `backingStore`, returns `{ dispatch, getState }`

Reducers are functions of `(state, action)` and return a new state.

Backing stores must have a `getState` and `setState` method. See [`./src/backing-stores`](./src/backing-stores) for some implementations.

## Backing Stores

- ✅ Implemented
- ❌ Unimplemented

### Plain Object

✅  "Plain Ole Javascript Object" - basic implementation. Needs a lot of wrapping to be useful.

### React

✅ Uses React Component state as the API.

### Callbag

✅ Implements the [Callbag](https://github.com/callbag/callbag) spec for observables.

## Plugins


### Shallow Merge

✅  Wraps a reducer so it can return a partial state object, similar to the React `setState` API.

### Devtools

✅ Wraps a reducer and store to comply with the Redux Devtools API to implement timetravel debugging

### Async

❌ Support async actions using an API like Promises or function dispatch (thunks).

## Examples

All the goodies are in [`src/App.js`](src/App.js)

Run locally: `yarn install && yarn start`

[![Edit psyducks](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/alexkrolick/psyducks/tree/master/)

---

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).
