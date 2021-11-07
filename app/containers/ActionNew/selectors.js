import { createSelector } from 'reselect';
import { API } from 'themes/config';

import {
  selectEntities,
  selectActorTaxonomiesSorted,
  selectActorsCategorised,
} from 'containers/App/selectors';

import { prepareTaxonomies } from 'utils/entities';
// import { qe } from 'utils/quasi-equals';
export const selectDomain = createSelector(
  (state) => state.get('actionNew'),
  (substate) => substate
);

export const selectConnectedTaxonomies = createSelector(
  (state) => selectActorTaxonomiesSorted(state),
  (state) => selectEntities(state, API.CATEGORIES),
  (taxonomies, categories) => prepareTaxonomies(
    taxonomies,
    categories,
    false,
  )
);

export const selectActorsByActortype = createSelector(
  (state) => selectActorsCategorised(state),
  (entities) => entities && entities.groupBy(
    (r) => r.getIn(['attributes', 'actortype_id']).toString()
  )
);
