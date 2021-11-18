import { createSelector } from 'reselect';
import { Map } from 'immutable';

import {
  selectEntities,
  selectActionsSearchQuery,
  selectWithoutQuery,
  selectConnectionQuery,
  selectCategoryQuery,
  selectTargetedQuery,
  selectSortByQuery,
  selectSortOrderQuery,
  selectActors,
  selectActorTaxonomies,
  // selectActortypes,
  selectReady,
  selectActorCategoriesGroupedByActor,
  selectActionCategoriesGroupedByAction,
  selectActorActionsGroupedByAction, // active
  selectActionActorsGroupedByAction, // passive, as targets
  selectCategories,
} from 'containers/App/selectors';

import {
  filterEntitiesByConnection,
  filterEntitiesByCategories,
  // filterEntitiesByConnectedCategories,
  filterEntitiesWithoutAssociation,
  entitiesSetCategoryIds,
  // filterTaxonomies,
  getTaxonomyCategories,
} from 'utils/entities';

import { sortEntities, getSortOption } from 'utils/sort';

import { API } from 'themes/config';

import { CONFIG, DEPENDENCIES } from './constants';

export const selectConnections = createSelector(
  (state) => selectReady(state, { path: DEPENDENCIES }),
  selectActors,
  selectActorCategoriesGroupedByActor,
  selectCategories,
  (ready, actors, associationsGrouped, categories) => {
    if (ready) {
      return new Map().set(
        API.ACTORS,
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
  (state) => selectReady(state, { path: DEPENDENCIES }),
  selectConnections,
  selectActorTaxonomies,
  selectCategories,
  (state) => selectEntities(state, API.ACTOR_CATEGORIES),
  // selectActortypes,
  // (state) => selectEntities(state, API.ACTORTYPE_TAXONOMIES),
  (
    ready,
    connections,
    taxonomies,
    categories,
    actorCategories,
    // actortypes,
    // actortypeTaxonomies,
  ) => {
    if (!ready) return Map();
    const relationship = {
      tags: 'tags_actors',
      path: API.ACTORS,
      key: 'actor_id',
      associations: actorCategories,
    };
    // const connectedTaxonomies = filterTaxonomies(
    //   taxonomies,
    //   relationship.tags,
    //   true,
    // ).filter(
    //   (taxonomy) => actortypeTaxonomies.some(
    //     (actortypet) => actionActortypes.some(
    //       (actortype) => qe(
    //         actortype.get('id'),
    //         actortypet.getIn(['attributes', 'actortype_id']),
    //       ),
    //     ) && qe(
    //       taxonomy.get('id'),
    //       actortypet.getIn(['attributes', 'taxonomy_id']),
    //     )
    //   )
    // );
    // if (!connections.get(relationship.path)) {
    //   return connectedTaxonomies;
    // }
    const groupedAssociations = relationship.associations.filter(
      (association) => association.getIn(['attributes', relationship.key])
        && connections.getIn([
          relationship.path,
          association.getIn(['attributes', relationship.key]).toString(),
        ])
    ).groupBy(
      (association) => association.getIn(['attributes', 'category_id'])
    );
    return taxonomies.map(
      (taxonomy) => taxonomy.set(
        'categories',
        getTaxonomyCategories(
          taxonomy,
          categories,
          relationship,
          groupedAssociations,
        )
      )
    );
  }
);

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
  selectActionActorsGroupedByAction,
  (ready, entities, connections, actorAssociationsGrouped, targetAssociationsGrouped) => {
    if (ready && connections.get('actors')) {
      return entities.map(
        (entity) => {
          const entityActors = actorAssociationsGrouped.get(parseInt(entity.get('id'), 10));
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
          ).sortBy((val, key) => key);
          const entityTargets = targetAssociationsGrouped.get(parseInt(entity.get('id'), 10));
          // console.log('actorAssociationsGrouped', actorAssociationsGrouped && actorAssociationsGrouped.toJS())
          // console.log('targetAssociationsGrouped', targetAssociationsGrouped && targetAssociationsGrouped.toJS())
          const entityTargetsByActortype = entityTargets && entityTargets.filter(
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
          ).sortBy((val, key) => key);
          // console.log(entityActorsByActortype && entityActorsByActortype.toJS());
          // currently requires both for filtering & display
          return entity.set(
            'actors',
            entityActors,
          ).set(
            'actorsByType',
            entityActorsByActortype,
          ).set(
            'targets',
            entityTargets,
          ).set(
            'targetsByType',
            entityTargetsByActortype,
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
const selectActionsByTargets = createSelector(
  selectActionsByConnections,
  selectTargetedQuery,
  (entities, query) => query
    ? filterEntitiesByConnection(entities, query)
    : entities
);
const selectActionsByCategories = createSelector(
  selectActionsByTargets,
  selectCategoryQuery,
  (entities, query) => query
    ? filterEntitiesByCategories(entities, query)
    : entities
);
// const selectActionsByConnectedCategories = createSelector(
//   selectActionsByCategories,
//   selectConnections,
//   selectConnectedCategoryQuery,
//   (entities, connections, query) => query
//     ? filterEntitiesByConnectedCategories(entities, connections, query)
//     : entities
// );

// kicks off series of cascading selectors
// 1. selectEntitiesWhere filters by attribute
// 2. selectEntitiesSearchQuery filters by keyword
// 4. selectActionsWithout will filter by absence of taxonomy or connection
// 5. selectActionsByConnections will filter by specific connection
// 6. selectActionsByCategories will filter by specific categories
// 7. selectActionsByCOnnectedCategories will filter by specific categories connected via connection
export const selectActions = createSelector(
  selectActionsByCategories,
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
