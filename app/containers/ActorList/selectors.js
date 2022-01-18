import { createSelector } from 'reselect';
import { Map, List } from 'immutable';
import {
  selectEntities,
  selectActorsSearchQuery,
  selectWithoutQuery,
  selectConnectionQuery,
  selectCategoryQuery,
  selectSortByQuery,
  selectSortOrderQuery,
  selectActions,
  selectActors,
  selectReady,
  selectActorCategoriesGroupedByActor,
  selectActionCategoriesGroupedByAction,
  selectActorActionsGroupedByActor,
  selectActionActorsGroupedByActor,
  selectMembershipsGroupedByMember,
  selectMembershipsGroupedByAssociation,
  selectCategories,
  selectTargetingQuery,
  selectActionTaxonomies,
  selectMemberQuery,
  selectAssociationQuery,
  selectIncludeActorMembersQuery,
  selectIncludeTargetMembersQuery,
  // selectActorConnections,
  // selectActortypeTaxonomies,
  // selectActortypeQuery,
  // selectActortypeListQuery,
} from 'containers/App/selectors';

import {
  filterEntitiesByConnection,
  filterEntitiesByCategories,
  filterEntitiesWithoutAssociation,
  entitiesSetCategoryIds,
  getTaxonomyCategories,
} from 'utils/entities';
// import { qe } from 'utils/quasi-equals';

import { sortEntities, getSortOption } from 'utils/sort';

import { API } from 'themes/config';

import { CONFIG, DEPENDENCIES } from './constants';

export const selectConnections = createSelector(
  (state) => selectReady(state, { path: DEPENDENCIES }),
  selectActions,
  selectActors,
  selectActionCategoriesGroupedByAction,
  selectActorCategoriesGroupedByActor,
  selectCategories,
  (
    ready,
    actions,
    actors,
    actionAssociationsGrouped,
    actorAssociationsGrouped,
    categories,
  ) => {
    if (ready) {
      return new Map().set(
        'actions',
        entitiesSetCategoryIds(
          actions,
          actionAssociationsGrouped,
          categories,
        )
      ).set(
        'actors',
        entitiesSetCategoryIds(
          actors,
          actorAssociationsGrouped,
          categories,
        )
      );
    }
    return new Map();
  }
);

// export const selectConnectedTaxonomies = createSelector(
//   (state) => selectActiontypeTaxonomies(state),
//   selectCategories,
//   (taxonomies, categories) => prepareTaxonomiesMultipleTags(
//     taxonomies,
//     categories,
//     ['tags_actions'],
//   )
// );


export const selectConnectedTaxonomies = createSelector(
  (state) => selectReady(state, { path: DEPENDENCIES }),
  selectConnections,
  selectActionTaxonomies,
  selectCategories,
  (state) => selectEntities(state, API.ACTION_CATEGORIES),
  (
    ready,
    connections,
    taxonomies,
    categories,
    actionCategories,
  ) => {
    if (!ready) return Map();
    const relationship = {
      tags: 'tags_actions',
      path: 'actions',
      key: 'measure_id',
      associations: actionCategories,
    };

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

const selectActorsWithCategories = createSelector(
  (state) => selectReady(state, { path: DEPENDENCIES }),
  (state, args) => selectActorsSearchQuery(state, {
    searchAttributes: CONFIG.views.list.search || ['code', 'title'],
    ...args,
  }),
  selectActorCategoriesGroupedByActor,
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
  selectActionActorsGroupedByActor, // as targets
  selectMembershipsGroupedByAssociation,
  selectMembershipsGroupedByMember,
  selectIncludeActorMembersQuery,
  selectIncludeTargetMembersQuery,
  (
    ready,
    actors,
    connections,
    actionsAsActorGrouped,
    actionsAsTargetGrouped,
    memberAssociationsGrouped,
    associationAssociationsGrouped,
    includeActorMembers,
    includeTargetMembers,
  ) => {
    if (ready) {
      return actors.map(
        (actor) => {
          let actorActions = actionsAsActorGrouped.get(parseInt(actor.get('id'), 10)) || List();
          let targetActions = actionsAsTargetGrouped.get(parseInt(actor.get('id'), 10)) || List();
          const actorMembers = memberAssociationsGrouped.get(parseInt(actor.get('id'), 10));
          const actorAssociations = associationAssociationsGrouped.get(parseInt(actor.get('id'), 10));
          // console.log(entityActorsByActortype && entityActorsByActortype.toJS());
          // currently requires both for filtering & display
          if (includeActorMembers && actorAssociations && actorAssociations.size > 0) {
            const actorActionsAsMember = actorAssociations.reduce((memo, associationId) => {
              const associationActions = actionsAsActorGrouped.get(parseInt(associationId, 10));
              if (associationActions) {
                return memo.concat(associationActions);
              }
              return memo;
            }, List());
            if (actorActionsAsMember && actorActionsAsMember.size > 0) {
              actorActions = actorActions.concat(actorActionsAsMember);
            }
          }
          if (includeTargetMembers && actorAssociations && actorAssociations.size > 0) {
            const targetActionsAsMember = actorAssociations.reduce((memo, associationId) => {
              const associationActionsAsTarget = actionsAsTargetGrouped.get(parseInt(associationId, 10));
              if (associationActionsAsTarget) {
                return memo.concat(associationActionsAsTarget);
              }
              return memo;
            }, List());
            if (targetActionsAsMember && targetActionsAsMember.size > 0) {
              targetActions = targetActions.concat(targetActionsAsMember);
            }
          }
          return actor.set(
            'actions',
            actorActions
          ).set(
            'actionsByType',
            actorActions && connections.get('actions') && actorActions.filter(
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
            ).sortBy((val, key) => key),
          ).set(
            'targetingActions',
            targetActions,
          ).set(
            'targetingActionsByType',
            targetActions && connections.get('actions') && targetActions.filter(
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
            ).sortBy((val, key) => key),
          ).set(
            'members',
            actorMembers,
          ).set(
            'membersByType',
            actorMembers && connections.get('actors') && actorMembers.filter(
              (id) => connections.getIn([
                'actors',
                id.toString(),
              ])
            ).groupBy(
              (actionId) => connections.getIn([
                'actors',
                actionId.toString(),
                'attributes',
                'actortype_id',
              ])
            ).sortBy((val, key) => key),
          ).set(
            'associations',
            actorAssociations,
          ).set(
            'associationsByType',
            actorAssociations && connections.get('actors') && actorAssociations.filter(
              (id) => connections.getIn([
                'actors',
                id.toString(),
              ])
            ).groupBy(
              (actionId) => connections.getIn([
                'actors',
                actionId.toString(),
                'attributes',
                'actortype_id',
              ])
            ).sortBy((val, key) => key),
          );
        }
      );
    }
    return actors;
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
  selectCategories,
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
const selectActorsByTargeted = createSelector(
  selectActorsByConnections,
  selectTargetingQuery,
  (entities, query) => query
    ? filterEntitiesByConnection(entities, query)
    : entities
);
const selectActorsByMembers = createSelector(
  selectActorsByTargeted,
  selectMemberQuery,
  (entities, query) => query
    ? filterEntitiesByConnection(entities, query)
    : entities
);
const selectActorsByAssociations = createSelector(
  selectActorsByMembers,
  selectAssociationQuery,
  (entities, query) => query
    ? filterEntitiesByConnection(entities, query)
    : entities
);
const selectActorsByCategories = createSelector(
  selectActorsByAssociations,
  selectCategoryQuery,
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
export const selectListActors = createSelector(
  selectActorsByCategories,
  selectSortByQuery,
  selectSortOrderQuery,
  (entities, sort, order) => {
    const sortOption = getSortOption(CONFIG.views.list.sorting, sort);
    return sortEntities(
      entities,
      order || (sortOption ? sortOption.order : 'desc'),
      sort || (sortOption ? sortOption.attribute : 'id'),
      sortOption ? sortOption.type : 'string'
    );
  }
);
