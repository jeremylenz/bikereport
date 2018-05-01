import { call, put, takeLatest } from 'redux-saga/effects'
import runtimeEnv from '@mars/heroku-js-runtime-env';
import { addReportSet, clearReports } from '../actions/actions'

const env = runtimeEnv();
const OUR_API_URL = env.REACT_APP_OUR_API_URL

async function getReportsFromApi() {
  let step1 = await fetch(`${OUR_API_URL}/reports`)
  let step2 = await step1.json()
  return step2
}

export function* loadReports() {
  let reports = yield call(getReportsFromApi)
  yield put(clearReports())
  console.log(reports)
  console.log(typeof reports)
  yield put(addReportSet(reports))

}

export function* watchLoadReports() {
  yield takeLatest('LOAD_REPORTS', loadReports)
}
