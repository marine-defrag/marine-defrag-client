/*
 *
 * ActionNew constants
 *
 */
import { fromJS } from 'immutable';
import { API } from 'themes/config';
export const SAVE = 'impactoss/ActionNew/SAVE';

export const DEPENDENCIES = [
  API.USER_ROLES,
  API.CATEGORIES,
  API.TAXONOMIES,
  API.ACTIONTYPES,
  API.ACTION_CATEGORIES,
  API.ACTIONTYPE_TAXONOMIES,
  API.ACTORS,
  API.ACTORTYPES,
  API.ACTOR_CATEGORIES,
  API.ACTORTYPE_TAXONOMIES,
];

export const FORM_INITIAL = fromJS({
  id: '',
  attributes: {
    measuretype_id: '',
    title: '',
    description: '',
    draft: true,
    outcome: '',
    target_date: '',
    target_date_comment: '',
  },
  associatedTaxonomies: {},
  associatedActorsByActortype: {},
});
