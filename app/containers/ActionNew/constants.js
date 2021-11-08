/*
 *
 * ActionNew constants
 *
 */
import { fromJS } from 'immutable';
import { API, ACTION_FIELDS } from 'themes/config';
export const SAVE = 'impactoss/ActionNew/SAVE';

export const DEPENDENCIES = [
  API.USER_ROLES,
  API.CATEGORIES,
  API.TAXONOMIES,
  API.ACTORTYPES,
  API.ACTIONTYPES,
  API.ACTION_CATEGORIES,
  API.ACTOR_CATEGORIES,
  API.ACTIONTYPE_TAXONOMIES,
  API.ACTORTYPE_TAXONOMIES,
  API.ACTORS,
];

export const FORM_INITIAL = fromJS({
  id: '',
  attributes: Object.keys(ACTION_FIELDS.ATTRIBUTES).reduce((memo, att) => ({
    ...memo,
    [att]: ACTION_FIELDS.ATTRIBUTES[att].defaultValue || '',
  }), {}),
  associatedTaxonomies: {},
  associatedActorsByActortype: {},
  associatedTargetsByActortype: {},
});
