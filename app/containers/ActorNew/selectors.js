import { createSelector } from 'reselect';

import {
  selectCategories,
  selectActionTaxonomies,
  selectActionsCategorised,
} from 'containers/App/selectors';
import { prepareTaxonomies } from 'utils/entities';

export const selectDomain = createSelector(
  (state) => state.get('actorNew'),
  (substate) => substate
);

export const selectConnectedTaxonomies = createSelector(
  selectActionTaxonomies,
  selectCategories,
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
