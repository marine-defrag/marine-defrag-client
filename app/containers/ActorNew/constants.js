/*
 *
 * ActorNew constants
 *
 */
import { fromJS } from 'immutable';
import { DB } from 'themes/config';

export const SAVE = 'impactoss/ActorNew/SAVE';

export const DEPENDENCIES = [
  DB.USER_ROLES,
  DB.CATEGORIES,
  DB.TAXONOMIES,
  DB.ACTIONS,
  DB.ACTORTYPES,
  DB.ACTORTYPE_TAXONOMIES,
  DB.ACTION_CATEGORIES,
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
