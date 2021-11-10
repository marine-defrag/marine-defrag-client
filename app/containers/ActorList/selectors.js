import { createSelector } from 'reselect';
import { Map } from 'immutable';
import { API } from 'themes/config';
import {
  selectEntities,
  selectActorsSearchQuery,
  selectWithoutQuery,
  selectConnectionQuery,
  selectCategoryQuery,
  selectSortByQuery,
  selectSortOrderQuery,
  selectActions,
  selectReady,
  selectActorCategoriesGroupedByActor,
  selectActionCategoriesGroupedByAction,
  selectActorActionsGroupedByActor,
  // selectActorConnections,
  // selectActortypeTaxonomies,
  // selectActortypeQuery,
  // selectActortypeListQuery,
} from 'containers/App/selectors';

import {
  filterEntitiesByConnection,
  filterEntitiesByCategories,
  filterEntitiesWithoutAssociation,
  // prepareTaxonomiesMultipleTags,
  entitiesSetCategoryIds,
} from 'utils/entities';
// import { qe } from 'utils/quasi-equals';

import { sortEntities, getSortOption } from 'utils/sort';

import { CONFIG, DEPENDENCIES } from './constants';

export const selectConnections = createSelector(
  (state) => selectReady(state, { path: DEPENDENCIES }),
  selectActions,
  selectActionCategoriesGroupedByAction,
  (state) => selectEntities(state, API.CATEGORIES),
  (ready, actions, associationsGrouped, categories) => {
    if (ready) {
      return new Map().set(
        'actions',
        entitiesSetCategoryIds(
          actions,
          associationsGrouped,
          categories,
        )
      );
    }
    return new Map();
  }
);

export const selectConnectedTaxonomies = createSelector(
  () => Map()
);
// export const selectConnectedTaxonomies = createSelector(
//   (state) => selectActortypeTaxonomies(state),
//   (state) => selectEntities(state, API.CATEGORIES),
//   (taxonomies, categories) => prepareTaxonomiesMultipleTags(
//     taxonomies,
//     categories,
//     ['tags_actions'],
//   )
// );
const selectActorsWithCategories = createSelector(
  (state) => selectReady(state, { path: DEPENDENCIES }),
  (state, args) => selectActorsSearchQuery(state, {
    searchAttributes: CONFIG.search || ['reference', 'title'],
    ...args,
  }),
  selectActorCategoriesGroupedByActor,
  (state) => selectEntities(state, API.CATEGORIES),
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
// const selectActorsWithActions = createSelector(
//   (state) => selectReady(state, { path: DEPENDENCIES }),
//   selectActorsWithCategories,
//   (state) => selectActorConnections(state),
//   selectActorActionsGroupedByActor,
//   (ready, entities, connections, associationsGrouped) => {
//     if (ready && connections.get('actions')) {
//       return entities.map(
//         (entity) => entity.set(
//           'actions',
//           associationsGrouped.get(parseInt(entity.get('id'), 10)),
//         )
//       );
//     }
//     return entities;
//   }
// );
const selectActorsWithActions = createSelector(
  (state) => selectReady(state, { path: DEPENDENCIES }),
  selectActorsWithCategories,
  selectConnections,
  selectActorActionsGroupedByActor,
  (ready, entities, connections, associationsGrouped) => {
    if (ready && connections.get('actions')) {
      return entities.map(
        (entity) => {
          const entityActions = associationsGrouped.get(parseInt(entity.get('id'), 10));
          const entityActionsByActiontype = entityActions && entityActions.filter(
            (id) => connections.getIn([
              'actions',
              id.toString(),
            ])
          ).groupBy(
            (actionId) => connections.getIn([
              'actions',
              actionId.toString(),
              'attributes',
              'measuretype_id',
            ])
          );
          // console.log(entityActorsByActortype && entityActorsByActortype.toJS());
          // currently requires both for filtering & display
          return entity.set(
            'actions',
            entityActions
          ).set(
            'actionsByActiontype',
            entityActionsByActiontype,
          );
        }
      );
    }
    return entities;
  }
);

// TODO probably not needed
// const selectActorsByActortype = createSelector(
//   selectActorsWithActions,
//   selectActortypeQuery,
//   selectActortypeListQuery,
//   (entities, actortypeQuery, listQuery) => actortypeQuery === 'all'
//     && listQuery
//     ? entities.filter(
//       (entity) => qe(
//         entity.getIn(['attributes', 'actortype_id']),
//         listQuery,
//       )
//     )
//     : entities
// );

const selectActorsWithout = createSelector(
  selectActorsWithActions,
  (state) => selectEntities(state, API.CATEGORIES),
  (state, { locationQuery }) => selectWithoutQuery(state, locationQuery),
  (entities, categories, query) => query
    ? filterEntitiesWithoutAssociation(entities, categories, query)
    : entities
);
const selectActorsByConnections = createSelector(
  selectActorsWithout,
  (state, { locationQuery }) => selectConnectionQuery(state, locationQuery),
  (entities, query) => query
    ? filterEntitiesByConnection(entities, query)
    : entities
);
const selectActorsByCategories = createSelector(
  selectActorsByConnections,
  (state, { locationQuery }) => selectCategoryQuery(state, locationQuery),
  (entities, query) => query
    ? filterEntitiesByCategories(entities, query)
    : entities
);

// TODO adapt for actors
// const selectActionsByConnectedCategories = createSelector(
//   selectActionsByCategories,
//   selectConnections,
//   (state, { locationQuery }) => selectConnectedCategoryQuery(state, locationQuery),
//   (entities, connections, query) => query
//     ? filterEntitiesByConnectedCategories(entities, connections, query)
//     : entities
// );


// kicks off series of cascading selectors
// 1. selectEntitiesWhere filters by attribute
// 2. selectEntitiesSearchQuery filters by keyword
// 4. selectActorsWithout will filter by absence of taxonomy or connection
// 5. selectActorsByConnections will filter by specific connection
// 6. selectActorsByCategories will filter by specific categories
export const selectActors = createSelector(
  selectActorsByCategories,
  (state, { locationQuery }) => selectSortByQuery(state, locationQuery),
  (state, { locationQuery }) => selectSortOrderQuery(state, locationQuery),
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
