/*
 *
 * CategoryNew constants
 *
 */

import { fromJS } from 'immutable';
import { DB } from 'themes/config';

export const SAVE = 'impactoss/CategoryNew/SAVE';

export const DEPENDENCIES = [
  DB.USERS,
  DB.USER_ROLES,
  DB.CATEGORIES,
  DB.TAXONOMIES,
  DB.ACTIONS,
  DB.ACTORS,
  DB.ACTORTYPES,
  DB.ACTORTYPE_TAXONOMIES,
  DB.ACTOR_CATEGORIES,
  DB.ACTION_CATEGORIES,
];

export const FORM_INITIAL = fromJS({
  attributes: {
    title: '',
    description: '',
    short_title: '',
    url: '',
    manager_id: '',
    taxonomy_id: '',
    parent_id: '',
    reference: '',
    user_only: false,
    draft: true,
    date: '',
  },
  associatedActions: [],
  associatedActorsByActortype: {},
  associatedUser: [],
  associatedCategory: [],
});
