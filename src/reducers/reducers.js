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

function reports(state = [], action) {
  switch (action.type) {
    case 'ADD_REPORT':
      return [action.report, ...state]
    case 'ADD_REPORT_SET':
      return [...state, ...action.reportSet]
    case 'CLEAR_REPORTS':
      return []
    default:
      return state
  }
}

function newReportData(state = {}, action) {
  switch (action.type) {
    case 'SET_LOCATION':
      return {
        ...state,
          newReportData: {
            locationId: action.locationId
          }
      }
    default:
      return state
  }
}

const bwReducers = combineReducers({
  currentUser, reports, newReportData
})

export default bwReducers
