import { createSelector } from 'reselect';
import { Map } from 'immutable';

import {
  selectActionsSearchQuery,
  selectWithoutQuery,
  selectConnectionQuery,
  selectCategoryQuery,
  selectConnectedCategoryQuery,
  selectSortByQuery,
  selectSortOrderQuery,
  selectActors,
  // selectActortypeTaxonomies,
  // selectActortypes,
  selectReady,
  selectActorCategoriesGroupedByActor,
  selectActionCategoriesGroupedByAction,
  selectActorActionsGroupedByAction,
  selectCategories,
  selectActortypes,
} from 'containers/App/selectors';

import {
  filterEntitiesByConnection,
  filterEntitiesByCategories,
  filterEntitiesByConnectedCategories,
  filterEntitiesWithoutAssociation,
  entitiesSetCategoryIds,
  // filterTaxonomies,
  // getTaxonomyCategories,
} from 'utils/entities';
// import { qe } from 'utils/quasi-equals';
import { sortEntities, getSortOption } from 'utils/sort';

import { ACTIONTYPE_ACTORTYPES } from 'themes/config';
import { CONFIG, DEPENDENCIES } from './constants';

export const selectValidActortypes = createSelector(
  (state, { type }) => type,
  selectActortypes,
  (typeId, actortypes) => {
    const validActortypeIds = ACTIONTYPE_ACTORTYPES[typeId];
    return actortypes.filter(
      (type) => validActortypeIds && validActortypeIds.indexOf(type.get('id')) > -1
    );
  }
);

export const selectConnections = createSelector(
  (state) => selectReady(state, { path: DEPENDENCIES }),
  selectActors,
  selectActorCategoriesGroupedByActor,
  selectCategories,
  (ready, actors, associationsGrouped, categories) => {
    if (ready) {
      return new Map().set(
        'actors',
        entitiesSetCategoryIds(
          actors,
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
//   (state) => selectReady(state, { path: DEPENDENCIES }),
//   (state) => selectConnections(state),
//   (state) => selectActortypeTaxonomies(state),
//   selectCategories,
//   (state) => selectEntities(state, API.ACTOR_CATEGORIES),
//   (state) => selectActortypes(state),
//   (state) => selectEntities(state, API.ACTORTYPE_TAXONOMIES),
//   (
//     ready,
//     connections,
//     taxonomies,
//     categories,
//     categoryActors,
//     actortypes,
//     actortypeTaxonomies,
//   ) => {
//     if (!ready) return Map();
//     const relationship = {
//       tags: 'tags_actors',
//       path: API.ACTORS,
//       key: 'actor_id',
//       associations: categoryActors,
//     };
//     const actionActortypes = actortypes.filter(
//       (actortype) => actortype.getIn(['attributes', 'has_actions'])
//     );
//     // for all connections
//     const connectedTaxonomies = filterTaxonomies(
//       taxonomies,
//       relationship.tags,
//       true,
//     ).filter(
//       (taxonomy) => actortypeTaxonomies.some(
//         (actortypet) => actionActortypes.some(
//           (actortype) => qe(
//             actortype.get('id'),
//             actortypet.getIn(['attributes', 'actortype_id']),
//           ),
//         ) && qe(
//           taxonomy.get('id'),
//           actortypet.getIn(['attributes', 'taxonomy_id']),
//         )
//       )
//     );
//     if (!connections.get(relationship.path)) {
//       return connectedTaxonomies;
//     }
//     const groupedAssociations = relationship.associations.filter(
//       (association) => association.getIn(['attributes', relationship.key])
//         && connections.getIn([
//           relationship.path,
//           association.getIn(['attributes', relationship.key]).toString(),
//         ])
//     ).groupBy(
//       (association) => association.getIn(['attributes', 'category_id'])
//     );
//     return connectedTaxonomies.map(
//       (taxonomy) => taxonomy.set(
//         'categories',
//         getTaxonomyCategories(
//           taxonomy,
//           categories,
//           relationship,
//           groupedAssociations,
//         )
//       )
//     );
//   }
// );

// nest category ids
const selectActionsWithCategories = createSelector(
  (state) => selectReady(state, { path: DEPENDENCIES }),
  (state, args) => selectActionsSearchQuery(state, {
    searchAttributes: CONFIG.search || ['title'],
    ...args,
  }),
  selectActionCategoriesGroupedByAction,
  selectCategories,
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

// nest connected actor ids
// nest connected actor ids by actortype
const selectActionsWithActors = createSelector(
  (state) => selectReady(state, { path: DEPENDENCIES }),
  selectActionsWithCategories,
  selectConnections,
  selectActorActionsGroupedByAction,
  (ready, entities, connections, associationsGrouped) => {
    if (ready && connections.get('actors')) {
      return entities.map(
        (entity) => {
          const entityActors = associationsGrouped.get(parseInt(entity.get('id'), 10));
          const entityActorsByActortype = entityActors && entityActors.filter(
            (actorId) => connections.getIn([
              'actors',
              actorId.toString(),
            ])
          ).groupBy(
            (actorId) => connections.getIn([
              'actors',
              actorId.toString(),
              'attributes',
              'actortype_id',
            ])
          );
          // console.log(entityActorsByActortype && entityActorsByActortype.toJS());
          // currently requires both for filtering & display
          return entity.set(
            'actors',
            entityActors,
          ).set(
            'actorsByActortype',
            entityActorsByActortype,
          );
        }
      );
    }
    return entities;
  }
);

const selectActionsWithout = createSelector(
  selectActionsWithActors,
  selectCategories,
  selectWithoutQuery,
  (entities, categories, query) => query
    ? filterEntitiesWithoutAssociation(entities, categories, query)
    : entities
);
const selectActionsByConnections = createSelector(
  selectActionsWithout,
  selectConnectionQuery,
  (entities, query) => query
    ? filterEntitiesByConnection(entities, query)
    : entities
);
const selectActionsByCategories = createSelector(
  selectActionsByConnections,
  selectCategoryQuery,
  (entities, query) => query
    ? filterEntitiesByCategories(entities, query)
    : entities
);
const selectActionsByConnectedCategories = createSelector(
  selectActionsByCategories,
  selectConnections,
  selectConnectedCategoryQuery,
  (entities, connections, query) => query
    ? filterEntitiesByConnectedCategories(entities, connections, query)
    : entities
);

// kicks off series of cascading selectors
// 1. selectEntitiesWhere filters by attribute
// 2. selectEntitiesSearchQuery filters by keyword
// 4. selectActionsWithout will filter by absence of taxonomy or connection
// 5. selectActionsByConnections will filter by specific connection
// 6. selectActionsByCategories will filter by specific categories
// 7. selectActionsByCOnnectedCategories will filter by specific categories connected via connection
export const selectActions = createSelector(
  selectActionsByConnectedCategories,
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
