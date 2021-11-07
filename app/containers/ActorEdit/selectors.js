import { createSelector } from 'reselect';
import { API } from 'themes/config';

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
  prepareTaxonomiesMultipleTags,
} from 'utils/entities';

export const selectDomain = createSelector(
  (state) => state.get('actorEdit'),
  (substate) => substate
);

export const selectViewEntity = createSelector(
  (state, id) => selectEntity(state, { path: API.ACTORS, id }),
  (state) => selectEntities(state, API.USERS),
  (entity, users) => entitySetUser(entity, users)
);

export const selectTaxonomies = createSelector(
  (state, id) => id,
  selectTaxonomiesSorted,
  (state) => selectEntities(state, API.CATEGORIES),
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
  (state) => selectEntities(state, API.CATEGORIES),
  (taxonomies, categories) => prepareTaxonomiesMultipleTags(
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
