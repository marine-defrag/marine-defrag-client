/*
 *
 * PageEdit constants
 *
 */
import { fromJS } from 'immutable';
import { DB } from 'themes/config';
export const SAVE = 'impactoss/PageEdit/SAVE';

export const DEPENDENCIES = [
  DB.PAGES,
  DB.USERS,
  DB.USER_ROLES,
];

export const FORM_INITIAL = fromJS({
  id: '',
  attributes: {
    title: '',
    content: '',
    menu_title: '',
    draft: '',
    order: '',
  },
});
