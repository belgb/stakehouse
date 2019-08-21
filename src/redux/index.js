import { applyMiddleware, compose, createStore } from 'redux'
import reducer from './reducer'

const initStore = () => {
  const middleware = []

  const store = createStore(reducer, compose(applyMiddleware(...middleware)))

  return store
}

export default initStore
