import { createSelector } from 'reselect';
import { DB } from 'themes/config';

import {
  selectEntities,
  selectActortypeTaxonomiesSorted,
  selectActorsCategorised,
  selectActortypes,
} from 'containers/App/selectors';

import { prepareTaxonomiesMultiple } from 'utils/entities';
import { qe } from 'utils/quasi-equals';
export const selectDomain = createSelector(
  (state) => state.get('actionNew'),
  (substate) => substate
);

export const selectConnectedTaxonomies = createSelector(
  (state) => selectActortypeTaxonomiesSorted(state),
  (state) => selectEntities(state, DB.CATEGORIES),
  (taxonomies, categories) => prepareTaxonomiesMultiple(
    taxonomies,
    categories,
    ['tags_actors'],
    false,
  )
);

export const selectActorsByActortype = createSelector(
  (state, id) => id, // taxonomy id
  (state) => selectEntities(state, DB.ACTORTYPE_TAXONOMIES),
  (state) => selectActorsCategorised(state),
  (state) => selectActortypes(state),
  (id, actortypeTaxonomies, entities, actortypes) => {
    if (!actortypeTaxonomies || !entities) {
      return null;
    }
    return entities.filter(
      (r) => {
        const actortype = actortypes.find(
          (at) => qe(
            at.get('id'),
            r.getIn(['attributes', 'actortype_id']),
          )
        );
        return actortype.getIn(['attributes', 'has_actions']);
      }
    ).groupBy(
      (r) => r.getIn(['attributes', 'actortype_id']).toString()
    );
  }
);
