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
      console.log(action.reportId)
      return {
        ...state,
          reportId: action.reportId,
      }
    case 'ADD_REPORT':
      return {
        ...state,
          reports: [action.report, ...state.reports]
      }
    case 'ADD_REPORT_SET':
      return {
        ...state,
          reports: [...state.reports, ...action.reportSet]
      }
    case 'CLEAR_REPORTS':
      return {
        ...state,
          reports: [],
      }
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
