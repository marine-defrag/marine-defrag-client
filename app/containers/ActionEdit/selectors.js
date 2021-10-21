import { createSelector } from 'reselect';
import { DB } from 'themes/config';

import {
  selectEntity,
  selectEntities,
  selectActorsCategorised,
  selectActortypeTaxonomiesSorted,
  selectActortypes,
  selectActorActionsByAction,
  selectActionCategoriesByAction,
} from 'containers/App/selectors';

import {
  entitiesSetAssociated,
  entitySetUser,
  prepareTaxonomiesAssociated,
  prepareTaxonomiesMultiple,
} from 'utils/entities';
import { qe } from 'utils/quasi-equals';
export const selectDomain = createSelector(
  (state) => state.get('actionEdit'),
  (substate) => substate
);

export const selectViewEntity = createSelector(
  (state, id) => selectEntity(state, { path: DB.ACTIONS, id }),
  (state) => selectEntities(state, DB.USERS),
  (entity, users) => entitySetUser(entity, users)
);
export const selectTaxonomies = createSelector(
  (state, id) => id,
  selectActortypeTaxonomiesSorted,
  (state) => selectEntities(state, DB.CATEGORIES),
  selectActionCategoriesByAction,
  (
    id,
    taxonomies,
    categories,
    associations,
  ) => prepareTaxonomiesAssociated(
    taxonomies,
    categories,
    associations,
    'tags_actions',
    id,
    false,
  )
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
  (state, id) => id,
  selectActorsCategorised,
  selectActorActionsByAction,
  selectActortypes,
  (id, actors, associations, actortypes) => {
    const filtered = actors.filter(
      (r) => {
        const actortype = actortypes.find(
          (at) => qe(
            at.get('id'),
            r.getIn(['attributes', 'actortype_id']),
          )
        );
        return actortype.getIn(['attributes', 'has_actions']);
      }
    );
    return entitiesSetAssociated(
      filtered,
      associations,
      id,
    ).groupBy(
      (r) => r.getIn(['attributes', 'actortype_id']).toString()
    );
  }
);
