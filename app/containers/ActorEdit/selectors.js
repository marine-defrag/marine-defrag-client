import { createSelector } from 'reselect';
import { DB } from 'themes/config';

import {
  selectEntity,
  selectEntities,
  selectActionsCategorised,
  selectTaxonomiesSorted,
  selectActorActionsByActor,
  selectActorCategoriesByActor,
} from 'containers/App/selectors';

import {
  entitiesSetAssociated,
  entitySetUser,
  prepareTaxonomiesAssociated,
  prepareTaxonomiesMultiple,
} from 'utils/entities';

export const selectDomain = createSelector(
  (state) => state.get('actorEdit'),
  (substate) => substate
);

export const selectViewEntity = createSelector(
  (state, id) => selectEntity(state, { path: DB.ACTORS, id }),
  (state) => selectEntities(state, DB.USERS),
  (entity, users) => entitySetUser(entity, users)
);

export const selectTaxonomies = createSelector(
  (state, id) => id,
  selectTaxonomiesSorted,
  (state) => selectEntities(state, DB.CATEGORIES),
  selectActorCategoriesByActor,
  (
    id,
    taxonomies,
    categories,
    associations,
  ) => prepareTaxonomiesAssociated(
    taxonomies,
    categories,
    associations,
    'tags_actors',
    id,
    false, //  do not include parent taxonomies
  )
);

export const selectConnectedTaxonomies = createSelector(
  (state) => selectTaxonomiesSorted(state),
  (state) => selectEntities(state, DB.CATEGORIES),
  (taxonomies, categories) => prepareTaxonomiesMultiple(
    taxonomies,
    categories,
    ['tags_actions'],
    false,
  )
);

export const selectActions = createSelector(
  (state, id) => id,
  selectActionsCategorised,
  selectActorActionsByActor,
  (id, entities, associations) => entitiesSetAssociated(
    entities,
    associations,
    id,
  )
);