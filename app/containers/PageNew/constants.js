/*
 *
 * PageNew constants
 *
 */
import { fromJS } from 'immutable';
import { DB } from 'themes/config';
export const SAVE = 'impactoss/PageNew/SAVE';

export const DEPENDENCIES = [DB.USER_ROLES];

export const FORM_INITIAL = fromJS({
  attributes: {
    title: '',
    content: '',
    menu_title: '',
    draft: true,
    order: '',
  },
});
