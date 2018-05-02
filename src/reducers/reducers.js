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
    case 'INCREMENT_LIKES':
      let idx = state.findIndex((report) => report.id === action.reportId)
      if(idx === -1) {
        return state
      } else {
        let existingState = Object.assign([], state)
        existingState[idx].likes += 1
        return existingState
      }
    default:
      return state
  }
}

function bikePaths(state = [], action) {
  switch(action.type) {
    case 'ADD_BIKE_PATH_SET':
      return [...state, ...action.bikePathSet]
    case 'ADD_BIKE_PATH':
      return [action.bikePath, ...state]
    case 'CLEAR_BIKE_PATHS':
      return []
    default:
      return state
  }
}

function users(state = [], action) {
  switch(action.type) {
    case 'ADD_USER_SET':
      return [...state, ...action.userSet]
    case 'CLEAR_USERS':
      return []
    default:
      return state
  }
}

function locations(state = [], action) {
  switch(action.type) {
    case 'ADD_LOCATION_SET':
      return [...state, ...action.locationSet]
    case 'CLEAR_LOCATIONS':
      return []
    case 'ADD_LOCATION':
      return [action.location, ...state]
    default:
      return state
  }
}

function images(state = [], action) {
  switch(action.type) {
    case 'ADD_IMAGE_SET':
      return [...state, ...action.imageSet]
    case 'CLEAR_IMAGES':
      return []
    default:
      return state
  }
}

function newReportData(state = {}, action) {
  switch (action.type) {
    case 'CLEAR_NEW_REPORT_DATA':
      return {}
    case 'SET_LOCATION':
      return {
        ...state,
          locationId: action.locationId
      }
    case 'SET_BIKE_PATH':
      return {
        ...state,
          bikePathId: action.bikePathId
      }
    case 'REDIRECT_TO_NEW_REPORT_FORM':
      return {
        ...state,
          redirectToNewReportForm: true,
      }
    default:
      return state
  }
}

const bwReducers = combineReducers({
  currentUser, reports, bikePaths, users, locations, images, newReportData
})

export default bwReducers
