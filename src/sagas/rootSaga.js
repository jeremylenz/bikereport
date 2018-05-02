import { all } from 'redux-saga/effects'
import { loadReports, watchLoadReports, watchAll } from './allsagas'

export default function* rootSaga() {
  yield all([
    watchAll(),
  ])
}
