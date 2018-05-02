import { all } from 'redux-saga/effects'
import { loadReports, watchLoadReports } from './allsagas'

export default function* rootSaga() {
  yield all([
    watchLoadReports(),
  ])
}
