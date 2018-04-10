import { combineReducers } from 'redux'
import { recordLogin } from '../actions/actions.js'

function currentUser(state = {}, action) {
  switch (action.type) {
    case 'RECORD_LOGIN':
      return {
        ...state,
          guest: action.guest,
          name: action.name
      }
    default:
      return state
  }
}

const bwReducers = combineReducers({
  currentUser,
})

export default bwReducers
