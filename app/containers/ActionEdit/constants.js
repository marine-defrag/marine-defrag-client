/*
 *
 * ActionEdit constants
 *
 */
import { fromJS } from 'immutable';
import { API } from 'themes/config';
export const SAVE = 'impactoss/ActionEdit/SAVE';

export const DEPENDENCIES = [
  API.USERS,
  API.USER_ROLES,
  API.CATEGORIES,
  API.TAXONOMIES,
  API.ACTIONS,
  API.ACTORS,
  API.ACTORTYPES,
  API.ACTORTYPE_TAXONOMIES,
  API.ACTOR_ACTIONS,
  API.ACTOR_CATEGORIES,
  API.ACTION_CATEGORIES,
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
