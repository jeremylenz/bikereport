import { call, put, takeLatest, takeEvery, all } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import runtimeEnv from '@mars/heroku-js-runtime-env';
import apiHeaders from '../helpers/ApiHeaders.js'
import { addReportSet, addReport, addImage, clearReports, clearBikePaths, addBikePathSet,
         clearLocations, addLocationSet, clearUsers, addUserSet,
         clearImages, addImageSet, addLocation, setLocation,
         redirectToNewReportForm, addBikePath, setBikePath } from '../actions/actions'

const env = runtimeEnv();
const OUR_API_URL = env.REACT_APP_OUR_API_URL

async function getReportsFromApi() {
  let step1 = await fetch(`${OUR_API_URL}/reports`)
  let step2 = await step1.json()
  return step2
}

async function getStuffFromApi(thing) {
  let step1 = await fetch(`${OUR_API_URL}/${thing}`)
  let step2 = await step1.json()
  return step2
}

async function postStuffToApi(endpoint, stuff) {
  let step1 = await fetch(`${OUR_API_URL}/${endpoint}`,
  {method: 'POST',
   headers: apiHeaders(),
   body: JSON.stringify(stuff),
  })
  let step2 = await step1.json()
  return step2
}

export function* loadReports() {
  let reports = yield call(getStuffFromApi, 'reports')
  yield put(clearReports())
  console.log(reports)
  console.log(typeof reports)
  yield put(addReportSet(reports))

}

export function* loadBikePaths() {
  let bikePaths = yield call(getStuffFromApi, 'bike_paths')
  yield put(clearBikePaths())
  yield put(addBikePathSet(bikePaths))
}

export function* loadLocations() {
  let locations = yield call(getStuffFromApi, 'locations')
  yield put(clearLocations())
  yield put(addLocationSet(locations))
}

export function* loadUsers() {
  let users = yield call(getStuffFromApi, 'users')
  yield put(clearUsers())
  yield put(addUserSet(users))
}

export function* loadImages() {
  let images = yield call(getStuffFromApi, 'images')
  yield put(clearImages())
  yield put(addImageSet(images))
}

export function* saveReport(action) {
  // console.log(action)
  let newReport = yield call(postStuffToApi, 'reports', action.reportData)
  yield put(addReport(newReport.report))
  yield put(addImage(newReport.image))
  
}

export function* saveLocation(action) {
  console.log(action)
  // fetch(`${OUR_API_URL}/locations`,
  //   {method: 'POST',
  //   headers: myHeaders,
  //   body: JSON.stringify(myBody)
  // })
  // .then(resp => resp.json())
  // .then(resp => this.setState({
  //   saveStatus: 'saved',
  //   locationId: resp.id,
  // }, this.proceedToNewReport))
  let newLocation = yield call(postStuffToApi, 'locations', action.locationData)
  yield put(addLocation(newLocation))
  yield put(setLocation(newLocation.id))
  yield call(delay, 1000)
  yield put(redirectToNewReportForm())
}

export function* saveBikePath(action) {
  let newBikePath = yield call(postStuffToApi, 'bike_paths', action.locationData)
  yield put(addBikePath(newBikePath))
  yield put(setBikePath(newBikePath.id))
}

export function* watchAll() {
  yield all([
    takeLatest('LOAD_REPORTS', loadReports),
    takeLatest('LOAD_BIKE_PATHS', loadBikePaths),
    takeLatest('LOAD_LOCATIONS', loadLocations),
    takeLatest('LOAD_USERS', loadUsers),
    takeLatest('LOAD_IMAGES', loadImages),
    takeEvery('SAVE_REPORT', saveReport),
    takeEvery('SAVE_LOCATION', saveLocation),
    takeEvery('SAVE_BIKE_PATH', saveBikePath),
  ])
}
