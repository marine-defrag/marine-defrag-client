import { createSelector } from 'reselect';
import { Map } from 'immutable';
import {
  API,
  FF_ACTIONTYPE,
  ACTORTYPES_CONFIG,
  ACTIONTYPE_ACTOR_ACTION_ROLES,
} from 'themes/config';

import {
  selectReady,
  selectEntity,
  selectEntities,
  selectCategories,
  selectTaxonomiesSorted,
  selectActorConnections,
  // selectActionConnections,
  selectActions,
  selectActors,
  selectResources,
  selectActionActorsGroupedByAction,
  selectActorActionsGroupedByActor,
  selectActionActorsGroupedByActor,
  selectActorActionsGroupedByAction,
  selectActorActionsGroupedByActionAttributes,
  selectActionActorsGroupedByActionAttributes,
  selectActorCategoriesGroupedByActor,
  // selectActionCategoriesGroupedByAction,
  selectActionResourcesGroupedByAction,
  selectResourceConnections,
  selectActionResourcesGroupedByResource,
  selectMembershipsGroupedByMember,
  selectMembershipsGroupedByAssociation,
} from 'containers/App/selectors';

import {
  entitySetSingles,
  prepareTaxonomiesIsAssociated,
  setActorConnections,
  setResourceConnections,
} from 'utils/entities';
import { qe } from 'utils/quasi-equals';

import { DEPENDENCIES } from './constants';

export const selectViewEntity = createSelector(
  (state, id) => selectEntity(state, { path: API.ACTIONS, id }),
  (state) => selectEntities(state, API.USERS),
  (entity, users) => entity && entitySetSingles(
    entity, [
      {
        related: users,
        key: 'user',
        relatedKey: 'updated_by_id',
      },
    ],
  )
);

// TODO optimise use selectActionCategoriesGroupedByAction
export const selectViewTaxonomies = createSelector(
  (state, id) => id,
  selectTaxonomiesSorted,
  selectCategories,
  (state) => selectEntities(state, API.ACTION_CATEGORIES),
  (id, taxonomies, categories, associations) => prepareTaxonomiesIsAssociated(
    taxonomies,
    categories,
    associations,
    'tags_actions',
    'measure_id',
    id,
  )
);

const selectChildActions = createSelector(
  (state) => selectReady(state, { path: DEPENDENCIES }),
  (state, id) => id,
  selectActions,
  (ready, actionId, actions) => {
    if (!ready) return null;
    return actions.filter((action) => qe(
      action.getIn(['attributes', 'parent_id']),
      actionId,
    ));
  }
);
export const selectChildActionsByType = createSelector(
  (state) => selectReady(state, { path: DEPENDENCIES }),
  selectChildActions,
  (ready, children) => {
    if (!ready) return null;
    return children && children.size > 0
      ? children.groupBy((c) => c.getIn(['attributes', 'measuretype_id']))
      : null;
  }
);
export const selectParentAction = createSelector(
  (state) => selectReady(state, { path: DEPENDENCIES }),
  selectViewEntity,
  selectActions,
  (
    ready,
    viewAction,
    actions,
  ) => {
    if (!ready) return null;
    const parent = actions.find((action) => qe(
      viewAction.getIn(['attributes', 'parent_id']),
      action.get('id'),
    ));
    return parent || null;
  }
);

const selectActorAssociations = createSelector(
  (state, id) => id,
  selectActorActionsGroupedByAction,
  (actionId, associationsByAction) => associationsByAction.get(
    parseInt(actionId, 10)
  )
);
const selectActorsAssociated = createSelector(
  selectActors,
  selectActorAssociations,
  (actors, associations) => actors && associations && associations.reduce(
    (memo, id) => {
      const entity = actors.get(id.toString());
      return entity
        ? memo.set(id, entity)
        : memo;
    },
    Map(),
  )
);

// get associated actors with associoted actions and categories
// - group by actortype
export const selectActorsByType = createSelector(
  (state) => selectReady(state, { path: DEPENDENCIES }),
  selectViewEntity,
  selectActorsAssociated,
  selectActorConnections,
  selectActorActionsGroupedByActionAttributes,
  selectActorCategoriesGroupedByActor,
  selectCategories,
  selectMembershipsGroupedByMember,
  selectMembershipsGroupedByAssociation,
  (
    ready,
    viewEntity,
    actors,
    actorConnections,
    actorActionsByActionFull,
    actorCategories,
    categories,
    memberships,
    associations,
  ) => {
    if (!ready) return Map();
    let actorsWithConnections = actors && actors
      .map((actor) => setActorConnections({
        actor,
        actorConnections,
        // actorActions: actorActionsByActor,
        // actionActors: actionActorsByActor,
        categories,
        actorCategories,
        memberships,
        associations,
      }));
    const isIndicator = viewEntity && qe(viewEntity.getIn(['attributes', 'measuretype_id']), FF_ACTIONTYPE);
    const hasRelationshipRole = viewEntity
      && ACTIONTYPE_ACTOR_ACTION_ROLES[viewEntity.getIn(['attributes', 'measuretype_id'])]
      && ACTIONTYPE_ACTOR_ACTION_ROLES[viewEntity.getIn(['attributes', 'measuretype_id'])].length > 0;
    // console.log('hasRelationshipRole', hasRelationshipRole)
    if (isIndicator || hasRelationshipRole) {
      const viewEntityActors = actorActionsByActionFull.get(parseInt(viewEntity.get('id'), 10));
      if (viewEntityActors) {
        actorsWithConnections = actorsWithConnections.map(
          (actor) => {
            let actorX = actor;
            // console.log(actor && actor.toJS())
            const actorConnection = viewEntityActors.find(
              (connection) => qe(actor.get('id'), connection.get('actor_id'))
            );
            if (actorConnection) {
              if (isIndicator) {
                actorX = actorX.setIn(['actionValues', viewEntity.get('id')], actorConnection.get('value'));
              }
              if (hasRelationshipRole) {
                actorX = actorX.setIn(['relationshipRole', viewEntity.get('id')], actorConnection.get('relationshiptype_id'));
              }
            }
            return actorX;
          }
        );
      }
    }
    return actorsWithConnections && actorsWithConnections
      .groupBy((r) => r.getIn(['attributes', 'actortype_id']))
      .sortBy(
        (val, key) => key,
        (a, b) => {
          const configA = ACTORTYPES_CONFIG[a];
          const configB = ACTORTYPES_CONFIG[b];
          return configA.order < configB.order ? -1 : 1;
        }
      );
  }
);

// get list of child actions grouped by type
// - for each action store actors (with connections) grouped by type
// - group actors by actortype
export const selectChildActionsByTypeWithActorsByType = createSelector(
  (state) => selectReady(state, { path: DEPENDENCIES }),
  selectChildActions,
  selectActors,
  selectActorActionsGroupedByAction,
  selectActorActionsGroupedByActionAttributes,
  selectActorConnections,
  selectActorCategoriesGroupedByActor,
  selectCategories,
  selectMembershipsGroupedByMember,
  selectMembershipsGroupedByAssociation,
  (
    ready,
    childActions,
    actors,
    actorActionsByAction,
    actorActionsByActionFull,
    actorConnections,
    actorCategories,
    categories,
    memberships,
    associations,
  ) => {
    if (!ready) return null;
    const childActionsWithConnections = childActions.map(
      (childAction) => {
        let childActionActors = actorActionsByAction.get(
          parseInt(childAction.get('id'), 10)
        );
        if (childActionActors) {
          childActionActors = actors.filter(
            (actor) => childActionActors.includes(
              parseInt(actor.get('id'), 10)
            )
          ).map(
            (actor) => setActorConnections({
              actor,
              actorConnections,
              categories,
              actorCategories,
              memberships,
              associations,
            })
          );
          const hasRelationshipRole = childAction
            && ACTIONTYPE_ACTOR_ACTION_ROLES[childAction.getIn(['attributes', 'measuretype_id'])]
            && ACTIONTYPE_ACTOR_ACTION_ROLES[childAction.getIn(['attributes', 'measuretype_id'])].length > 0;
          if (hasRelationshipRole) {
            const viewEntityActors = actorActionsByActionFull.get(parseInt(childAction.get('id'), 10));
            if (viewEntityActors) {
              childActionActors = childActionActors.map(
                (actor) => {
                  let actorX = actor;
                  // console.log(actor && actor.toJS())
                  const actorConnection = viewEntityActors.find(
                    (connection) => qe(actor.get('id'), connection.get('actor_id'))
                  );
                  if (actorConnection) {
                    if (hasRelationshipRole) {
                      actorX = actorX.setIn(['relationshipRole', childAction.get('id')], actorConnection.get('relationshiptype_id'));
                    }
                  }
                  return actorX;
                }
              );
            }
          }
          const childActionActorsByType = childActionActors
            .groupBy((r) => r.getIn(['attributes', 'actortype_id']))
            .sortBy(
              (val, key) => key,
              (a, b) => {
                const configA = ACTORTYPES_CONFIG[a];
                const configB = ACTORTYPES_CONFIG[b];
                return configA.order < configB.order ? -1 : 1;
              }
            );
          return childAction.set('actorsByType', childActionActorsByType);
        }
        return childAction;
      }
    );
    if (childActionsWithConnections.size === 0) return null;
    return childActionsWithConnections
      .groupBy((childAction) => childAction.getIn(['attributes', 'measuretype_id']));
  }
);
// get list of child actions grouped by type
// - for each action store targets (with connections) grouped by type
// - group actors by actortype
export const selectChildActionsByTypeWithTargetsByType = createSelector(
  (state) => selectReady(state, { path: DEPENDENCIES }),
  selectChildActions,
  selectActors,
  selectActionActorsGroupedByAction,
  selectActionActorsGroupedByActionAttributes,
  selectActorConnections,
  selectActorCategoriesGroupedByActor,
  selectCategories,
  selectMembershipsGroupedByMember,
  selectMembershipsGroupedByAssociation,
  (
    ready,
    childActions,
    actors,
    actionActorsByAction,
    actionActorsByActionFull,
    actorConnections,
    actorCategories,
    categories,
    memberships,
    associations,
  ) => {
    if (!ready) return null;
    const childActionsWithConnections = childActions.map(
      (childAction) => {
        let childActionTargets = actionActorsByAction.get(
          parseInt(childAction.get('id'), 10)
        );
        if (childActionTargets) {
          childActionTargets = actors.filter(
            (actor) => childActionTargets.includes(
              parseInt(actor.get('id'), 10)
            )
          ).map(
            (actor) => setActorConnections({
              actor,
              actorConnections,
              categories,
              actorCategories,
              memberships,
              associations,
            })
          );
          const childActionTargetsByType = childActionTargets
            .groupBy((r) => r.getIn(['attributes', 'actortype_id']))
            .sortBy(
              (val, key) => key,
              (a, b) => {
                const configA = ACTORTYPES_CONFIG[a];
                const configB = ACTORTYPES_CONFIG[b];
                return configA.order < configB.order ? -1 : 1;
              }
            );
          return childAction.set('targetsByType', childActionTargetsByType);
        }
        return childAction;
      }
    );
    if (childActionsWithConnections.size === 0) return null;
    return childActionsWithConnections
      .groupBy((childAction) => childAction.getIn(['attributes', 'measuretype_id']));
  }
);


const selectTargetAssociations = createSelector(
  (state, id) => id,
  selectActionActorsGroupedByAction,
  (actionId, associationsByAction) => associationsByAction.get(
    parseInt(actionId, 10)
  )
);
const selectTargetsAssociated = createSelector(
  selectActors,
  selectTargetAssociations,
  (actors, associations) => actors && associations && associations.reduce(
    (memo, id) => {
      const entity = actors.get(id.toString());
      return entity
        ? memo.set(id, entity)
        : memo;
    },
    Map(),
  )
);

// get associated actors with associoted actions and categories
// - group by actortype
export const selectTargetsByType = createSelector(
  (state) => selectReady(state, { path: DEPENDENCIES }),
  selectTargetsAssociated,
  selectActorConnections,
  selectActorActionsGroupedByActor,
  selectActionActorsGroupedByActor,
  selectMembershipsGroupedByMember,
  selectMembershipsGroupedByAssociation,
  selectActorCategoriesGroupedByActor,
  selectCategories,
  (
    ready,
    targets,
    actorConnections,
    actorActions,
    actionActors,
    memberships,
    associations,
    actorCategories,
    categories,
  ) => {
    if (!ready) return Map();
    return targets && targets
      .map((actor) => setActorConnections({
        actor,
        actorConnections,
        categories,
        actorCategories,
        memberships,
        associations,
      }))
      .groupBy((r) => r.getIn(['attributes', 'actortype_id']))
      .sortBy(
        (val, key) => key,
        (a, b) => {
          const configA = ACTORTYPES_CONFIG[a];
          const configB = ACTORTYPES_CONFIG[b];
          return configA.order < configB.order ? -1 : 1;
        }
      );
  }
);

const selectResourceAssociations = createSelector(
  (state, id) => id,
  selectActionResourcesGroupedByAction,
  (actionId, associationsByAction) => associationsByAction.get(
    parseInt(actionId, 10)
  )
);
const selectResourcesAssociated = createSelector(
  selectResources,
  selectResourceAssociations,
  (actors, associations) => actors && associations && associations.reduce(
    (memo, id) => {
      const entity = actors.get(id.toString());
      return entity
        ? memo.set(id, entity)
        : memo;
    },
    Map(),
  )
);
// get associated actors with associoted actions and categories
// - group by actortype
export const selectResourcesByType = createSelector(
  (state) => selectReady(state, { path: DEPENDENCIES }),
  selectResourcesAssociated,
  selectResourceConnections,
  selectActionResourcesGroupedByResource,
  (
    ready,
    resources,
    resourceConnections,
    actionResources,
  ) => {
    if (!ready) return Map();
    return resources && resources
      .map((resource) => setResourceConnections({
        resource,
        resourceConnections,
        actionResources,
      }))
      .groupBy((r) => r.getIn(['attributes', 'resourcetype_id']))
      .sortBy((val, key) => key);
  }
);
