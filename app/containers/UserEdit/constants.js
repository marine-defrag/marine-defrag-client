/*
 *
 * UserEdit constants
 *
 */
import { fromJS } from 'immutable';
import { DB } from 'themes/config';
export const SAVE = 'impactoss/UserEdit/SAVE';

export const DEPENDENCIES = [
  DB.USERS,
  DB.ROLES,
  DB.USER_ROLES,
  DB.CATEGORIES,
  DB.TAXONOMIES,
  DB.USER_CATEGORIES,
];

export const FORM_INITIAL = fromJS({
  id: '',
  attributes: {
    email: '',
    name: '',
  },
});
