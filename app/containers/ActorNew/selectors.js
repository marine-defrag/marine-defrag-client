import { createSelector } from 'reselect';
import { API } from 'themes/config';

import {
  selectEntities,
  selectActionTaxonomiesSorted,
  selectActionsCategorised,
} from 'containers/App/selectors';
import { prepareTaxonomies } from 'utils/entities';

export const selectDomain = createSelector(
  (state) => state.get('actorNew'),
  (substate) => substate
);

export const selectConnectedTaxonomies = createSelector(
  selectActionTaxonomiesSorted,
  (state) => selectEntities(state, API.CATEGORIES),
  (taxonomies, categories) => prepareTaxonomies(
    taxonomies,
    categories,
    false,
  )
);

export const selectActionsByActiontype = createSelector(
  selectActionsCategorised,
  (entities) => entities && entities.groupBy(
    (r) => r.getIn(['attributes', 'measuretype_id']).toString()
  )
);
