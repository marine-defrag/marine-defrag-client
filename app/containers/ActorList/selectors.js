import { createSelector } from 'reselect';
import { Map } from 'immutable';
import { DB } from 'themes/config';
import {
  selectEntities,
  selectActorsSearchQuery,
  selectWithoutQuery,
  selectConnectionQuery,
  selectCategoryQuery,
  selectSortByQuery,
  selectSortOrderQuery,
  selectActorConnections,
  selectActortypeTaxonomiesSorted,
  selectActortypeActions,
  selectActortypeQuery,
  selectActortypeListQuery,
  selectReady,
  selectActorCategoriesByActor,
  selectActionCategoriesByAction,
  selectActorActionsByActor,
} from 'containers/App/selectors';

import {
  filterEntitiesByConnection,
  filterEntitiesByCategories,
  filterEntitiesWithoutAssociation,
  prepareTaxonomiesMultiple,
  entitiesSetCategoryIds,
} from 'utils/entities';
import { qe } from 'utils/quasi-equals';

import { sortEntities, getSortOption } from 'utils/sort';

import { CONFIG, DEPENDENCIES } from './constants';

const selectActorsQ = createSelector(
  (state, locationQuery) => selectActorsSearchQuery(state, {
    searchAttributes: CONFIG.search || ['reference', 'title'],
    locationQuery,
  }),
  (entities) => entities
);
const selectActorsWithCategories = createSelector(
  (state) => selectReady(state, { path: DEPENDENCIES }),
  selectActorsQ,
  (state) => selectActorCategoriesByActor(state),
  (state) => selectEntities(state, DB.CATEGORIES),
  (ready, entities, associationsGrouped, categories) => {
    if (ready) {
      return entitiesSetCategoryIds(
        entities,
        associationsGrouped,
        categories,
      );
    }
    return entities;
  }
);
const selectActorsWithActions = createSelector(
  (state) => selectReady(state, { path: DEPENDENCIES }),
  selectActorsWithCategories,
  (state) => selectActorConnections(state),
  selectActorActionsByActor,
  (ready, entities, connections, associationsGrouped) => {
    if (ready && connections.get('actions')) {
      return entities.map(
        (entity) => entity.set(
          'actions',
          associationsGrouped.get(parseInt(entity.get('id'), 10)),
        )
      );
    }
    return entities;
  }
);
const selectActorsByActortype = createSelector(
  selectActorsWithActions,
  selectActortypeQuery,
  selectActortypeListQuery,
  (entities, actortypeQuery, listQuery) => actortypeQuery === 'all'
    && listQuery
    ? entities.filter(
      (entity) => qe(
        entity.getIn(['attributes', 'actortype_id']),
        listQuery,
      )
    )
    : entities
);
const selectActorsWithout = createSelector(
  selectActorsByActortype,
  (state) => selectEntities(state, DB.CATEGORIES),
  selectWithoutQuery,
  (entities, categories, query) => query
    ? filterEntitiesWithoutAssociation(entities, categories, query)
    : entities
);
const selectActorsByConnections = createSelector(
  selectActorsWithout,
  selectConnectionQuery,
  (entities, query) => query
    ? filterEntitiesByConnection(entities, query)
    : entities
);
const selectActorsByCategories = createSelector(
  selectActorsByConnections,
  selectCategoryQuery,
  (entities, query) => query
    ? filterEntitiesByCategories(entities, query)
    : entities
);
// kicks off series of cascading selectors
// 1. selectEntitiesWhere filters by attribute
// 2. selectEntitiesSearchQuery filters by keyword
// 4. selectActorsWithout will filter by absence of taxonomy or connection
// 5. selectActorsByConnections will filter by specific connection
// 6. selectActorsByCategories will filter by specific categories
export const selectActors = createSelector(
  selectActorsByCategories,
  selectSortByQuery,
  selectSortOrderQuery,
  (entities, sort, order) => {
    const sortOption = getSortOption(CONFIG.sorting, sort);
    return sortEntities(
      entities,
      order || (sortOption ? sortOption.order : 'desc'),
      sort || (sortOption ? sortOption.attribute : 'id'),
      sortOption ? sortOption.type : 'string'
    );
  }
);

export const selectConnectedTaxonomies = createSelector(
  (state) => selectActortypeTaxonomiesSorted(state),
  (state) => selectEntities(state, DB.CATEGORIES),
  (taxonomies, categories) => prepareTaxonomiesMultiple(
    taxonomies,
    categories,
    ['tags_actions'],
  )
);

export const selectConnections = createSelector(
  (state) => selectReady(state, { path: DEPENDENCIES }),
  selectActortypeActions,
  selectActionCategoriesByAction,
  (ready, actions, associationsGrouped) => {
    if (ready) {
      return new Map().set(
        'actions',
        entitiesSetCategoryIds(
          actions,
          associationsGrouped,
        )
      );
    }
    return new Map();
  }
);
