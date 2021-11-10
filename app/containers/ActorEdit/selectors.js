import { createSelector } from 'reselect';
import { API } from 'themes/config';
import { qe } from 'utils/quasi-equals';

import {
  selectEntity,
  selectEntities,
  selectActionsCategorised,
  selectTaxonomiesSorted,
  selectActorActionsGroupedByActor,
  selectActorCategoriesGroupedByActor,
  selectCategories,
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

export const selectTaxonomyOptions = createSelector(
  (state, id) => selectEntity(state, { path: API.ACTORS, id }),
  selectTaxonomiesSorted,
  (state) => selectEntities(state, API.ACTORTYPE_TAXONOMIES),
  selectCategories,
  selectActorCategoriesGroupedByActor,
  (
    entity,
    taxonomies,
    typeTaxonomies,
    categories,
    associations,
  ) => {
    if (
      entity
      && taxonomies
      && typeTaxonomies
      && categories
      && associations
    ) {
      const id = entity.get('id');
      const taxonomiesForType = taxonomies.filter((tax) => typeTaxonomies.some(
        (type) => qe(
          type.getIn(['attributes', 'taxonomy_id']),
          tax.get('id'),
        ) && qe(
          type.getIn(['attributes', 'actortype_id']),
          entity.getIn(['attributes', 'actortype_id']),
        )
      ));

      return prepareTaxonomiesAssociated(
        taxonomiesForType,
        categories,
        associations,
        'tags_actors',
        id,
        false,
      );
    }
    return null;
  }
);

export const selectConnectedTaxonomies = createSelector(
  (state) => selectTaxonomiesSorted(state),
  selectCategories,
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
  selectActorActionsGroupedByActor,
  (id, entities, associations) => entitiesSetAssociated(
    entities,
    associations,
    id,
  )
);
