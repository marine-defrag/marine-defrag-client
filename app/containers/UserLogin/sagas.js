import {
  takeLatest, put, take, cancel,
} from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';

import { authenticate, recoverPassword } from 'containers/App/actions';

import { LOGIN, RECOVER } from './constants';

export function* login({ data }) {
  yield put(authenticate(data));
}

export function* recover({ data }) {
  yield put(recoverPassword(data));
}

export function* defaultSaga() {
  const watcher = yield takeLatest(LOGIN, login);
  const watcher2 = yield takeLatest(RECOVER, recover);

  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
  yield cancel(watcher2);
}

export default [
  defaultSaga,
];
