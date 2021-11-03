/*
 *
 * ActorEdit constants
 *
 */
import { fromJS } from 'immutable';
import { API } from 'themes/config';

export const SAVE = 'impactoss/ActorEdit/SAVE';

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
    reference: '',
    accepted: 'false',
    response: '',
    draft: '',
    actortype_id: '',
  },
  associatedTaxonomies: {},
  associatedActions: [],
});
