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
    case 'RECORD_GUEST_LOGIN':
      return {
        ...state,
          guest: action.guest,
          name: action.name,
      }
    default:
      return state
  }
}

function reports(state = {}, action) {
  switch (action.type) {
    case 'INCREMENT_LIKES':
      return {
        ...state,
          reports: []
      }
    case 'ADD_REPORT':
      return {
        ...state,
          reports: [action.report, ...state.reports]
      }
    default:
      return state
  }
}

const bwReducers = combineReducers({
  currentUser, reports,
})

export default bwReducers
