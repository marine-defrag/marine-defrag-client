import { createSelector } from 'reselect';

import {
  selectEntities,
  selectActortypeTaxonomiesSorted,
} from 'containers/App/selectors';
import { prepareTaxonomiesMultiple } from 'utils/entities';

export const selectDomain = createSelector(
  (state) => state.get('actorNew'),
  (substate) => substate
);

export const selectConnectedTaxonomies = createSelector(
  (state) => selectActortypeTaxonomiesSorted(state),
  (state) => selectEntities(state, DB.CATEGORIES),
  (taxonomies, categories) => prepareTaxonomiesMultiple(
    taxonomies,
    categories,
    ['tags_actions'],
    false,
  )
);
