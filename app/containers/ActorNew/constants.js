/*
 *
 * ActorNew constants
 *
 */
import { fromJS } from 'immutable';
import { API } from 'themes/config';

export const SAVE = 'impactoss/ActorNew/SAVE';

export const DEPENDENCIES = [
  API.USER_ROLES,
  API.CATEGORIES,
  API.TAXONOMIES,
  API.ACTIONS,
  API.ACTORTYPES,
  API.ACTORTYPE_TAXONOMIES,
  API.ACTION_CATEGORIES,
];

export const FORM_INITIAL = fromJS({
  attributes: {
    title: '',
    description: '',
    reference: '',
    accepted: true,
    response: '',
    draft: true,
    actortype_id: '',
  },
  associatedTaxonomies: {},
  associatedActions: [],
  associatedActors: [],
});
