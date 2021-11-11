import { createSelector } from 'reselect';

import {
  selectCategories,
  selectActorTaxonomies,
  selectActorsCategorised,
} from 'containers/App/selectors';

import { prepareTaxonomies } from 'utils/entities';
// import { qe } from 'utils/quasi-equals';
export const selectDomain = createSelector(
  (state) => state.get('actionNew'),
  (substate) => substate
);

export const selectConnectedTaxonomies = createSelector(
  selectActorTaxonomies,
  selectCategories,
  (taxonomies, categories) => prepareTaxonomies(
    taxonomies,
    categories,
    false,
  )
);

export const selectActorsByActortype = createSelector(
  selectActorsCategorised,
  (entities) => entities && entities.groupBy(
    (r) => r.getIn(['attributes', 'actortype_id']).toString()
  )
);
