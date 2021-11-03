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
  API.ACTORS,
  API.ACTORTYPES,
  API.ACTORTYPE_TAXONOMIES,
  API.ACTOR_CATEGORIES,
];

export const FORM_INITIAL = fromJS({
  id: '',
  attributes: {
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
