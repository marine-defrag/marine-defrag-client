/*
 *
 * ActionEdit constants
 *
 */
import { fromJS } from 'immutable';
import { DB } from 'themes/config';
export const SAVE = 'impactoss/ActionEdit/SAVE';

export const DEPENDENCIES = [
  DB.USERS,
  DB.USER_ROLES,
  DB.CATEGORIES,
  DB.TAXONOMIES,
  DB.ACTIONS,
  DB.ACTORS,
  DB.ACTORTYPES,
  DB.ACTORTYPE_TAXONOMIES,
  DB.ACTOR_ACTIONS,
  DB.ACTOR_CATEGORIES,
  DB.ACTION_CATEGORIES,
];

export const FORM_INITIAL = fromJS({
  id: '',
  attributes: {
    title: '',
    description: '',
    draft: '',
    outcome: '',
    target_date: '',
    target_date_comment: '',
  },
  associatedTaxonomies: {},
  associatedActorsByActortype: {},
});
