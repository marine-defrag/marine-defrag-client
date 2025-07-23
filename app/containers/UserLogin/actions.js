/*
 *
 * UserLogin actions
 *
 */
import { LOGIN, RECOVER } from './constants';

export function login(data) {
  return {
    type: LOGIN,
    data,
  };
}

export function recover(data) {
  return {
    type: RECOVER,
    data,
  };
}
