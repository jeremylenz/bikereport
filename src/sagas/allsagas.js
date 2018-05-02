import { call, put, takeLatest, all } from 'redux-saga/effects'
import runtimeEnv from '@mars/heroku-js-runtime-env';
import { addReportSet, clearReports, clearBikePaths, addBikePathSet,
         clearLocations, addLocationSet, clearUsers, addUserSet,
         clearImages, addImageSet } from '../actions/actions'

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

// export function* watchLoadReports() {
//   yield takeLatest('LOAD_REPORTS', loadReports)
// }
//
// export function* watchLoadBikePaths() {
//   yield takeLatest('LOAD_BIKE_PATHS', loadBikePaths)
// }
//
// export function* watchLoadLocations() {
//   yield takeLatest('LOAD_LOCATIONS', loadLocations)
// }
//
// export function* watchLoadUsers() {
//   yield takeLatest('LOAD_USERS', loadUsers)
// }
//
// export function* watchLoadImages() {
//   yield takeLatest('LOAD_IMAGES', loadImages)
// }

export function* watchAll() {
  yield all([
    takeLatest('LOAD_REPORTS', loadReports),
    takeLatest('LOAD_BIKE_PATHS', loadBikePaths),
    takeLatest('LOAD_LOCATIONS', loadLocations),
    takeLatest('LOAD_USERS', loadUsers),
    takeLatest('LOAD_IMAGES', loadImages),
  ])
}
