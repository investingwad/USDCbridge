import { createStore, combineReducers } from 'redux'
import ethReducer from './eth.reducer'
import userReducer from './user.reducer'

const rootReducer = combineReducers({
    user: userReducer,
    address: ethReducer
})

const store = createStore(rootReducer)

export default store