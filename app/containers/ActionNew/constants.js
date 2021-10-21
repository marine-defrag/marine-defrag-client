/*
 *
 * ActionNew constants
 *
 */
import { fromJS } from 'immutable';
import { DB } from 'themes/config';
export const SAVE = 'impactoss/ActionNew/SAVE';

export const DEPENDENCIES = [
  DB.USER_ROLES,
  DB.CATEGORIES,
  DB.TAXONOMIES,
  DB.ACTORS,
  DB.ACTORTYPES,
  DB.ACTORTYPE_TAXONOMIES,
  DB.ACTOR_CATEGORIES,
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
