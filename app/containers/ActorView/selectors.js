import { createSelector } from 'reselect';
import { Map } from 'immutable';
import { API } from 'themes/config';

import {
  selectReady,
  selectEntity,
  selectEntities,
  selectCategories,
  selectTaxonomiesSorted,
  selectActionConnections,
  selectActions,
  selectActorActionsGroupedByAction,
  selectActorActionsGroupedByActor,
  selectActionActorsGroupedByActor,
  selectActionCategoriesGroupedByAction,
} from 'containers/App/selectors';

import {
  entitySetUser,
  prepareTaxonomiesIsAssociated,
  getEntityCategories,
} from 'utils/entities';

import { DEPENDENCIES } from './constants';

export const selectViewEntity = createSelector(
  (state, id) => selectEntity(state, { path: API.ACTORS, id }),
  (state) => selectEntities(state, API.USERS),
  (entity, users) => entitySetUser(entity, users)
);

// TODO optimise use selectActorCategoriesGroupedByActor
export const selectViewTaxonomies = createSelector(
  (state, id) => id,
  selectTaxonomiesSorted,
  selectCategories,
  (state) => selectEntities(state, API.ACTOR_CATEGORIES),
  (id, taxonomies, categories, associations) => prepareTaxonomiesIsAssociated(
    taxonomies,
    categories,
    associations,
    'tags_actors',
    'actor_id',
    id,
  )
);

const selectActionAssociations = createSelector(
  (state, id) => id,
  selectActorActionsGroupedByActor,
  (actorId, associationsByActor) => associationsByActor.get(
    parseInt(actorId, 10)
  )
);
const selectActionAsTargetAssociations = createSelector(
  (state, id) => id,
  selectActionActorsGroupedByActor,
  (actorId, associationsByActor) => associationsByActor.get(
    parseInt(actorId, 10)
  )
);
const selectActionsAssociated = createSelector(
  selectActions,
  selectActionAssociations,
  (actions, associations) => actions && associations && associations.reduce(
    (memo, id) => {
      const entity = actions.get(id.toString());
      return entity
        ? memo.set(id, entity)
        : memo;
    },
    Map(),
  )
);
const selectActionsAsTargetAssociated = createSelector(
  selectActions,
  selectActionAsTargetAssociations,
  (actions, associations) => actions && associations && associations.reduce(
    (memo, id) => {
      const entity = actions.get(id.toString());
      return entity
        ? memo.set(id, entity)
        : memo;
    },
    Map(),
  )
);
// all connected actions
// get associated actors with associoted actions and categories
// - group by actortype
export const selectActionsByType = createSelector(
  (state) => selectReady(state, { path: DEPENDENCIES }),
  selectActionsAssociated,
  selectActionConnections,
  selectActorActionsGroupedByAction,
  selectActionCategoriesGroupedByAction,
  selectCategories,
  (
    ready,
    actions,
    connections,
    actorActions,
    actionCategories,
    categories,
  ) => {
    if (!ready) return Map();
    return actions && actions.map(
      (action) => {
        const entityActors = actorActions.get(parseInt(action.get('id'), 10));
        const entityActorsByActortype = entityActors
          && connections.get('actors')
          && entityActors.filter(
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
            ]).toString()
          ).sortBy((val, key) => key);
        return action.set(
          'categories',
          getEntityCategories(
            action.get('id'),
            actionCategories,
            categories,
          )
        ).set(
          'actors',
          entityActors,
        ).set(
          'actorsByType',
          entityActorsByActortype,
        );
      }
    ).groupBy(
      (r) => r.getIn(['attributes', 'measuretype_id'])
    ).sortBy((val, key) => key);
  }
);
// all connected actions where view entity is target
// get associated actors with associoted actions and categories
// - group by actortype
export const selectActionsAsTargetByType = createSelector(
  (state) => selectReady(state, { path: DEPENDENCIES }),
  selectActionsAsTargetAssociated,
  selectActionConnections,
  selectActorActionsGroupedByAction,
  selectActionCategoriesGroupedByAction,
  selectCategories,
  (
    ready,
    actions,
    connections,
    actorActions,
    actionCategories,
    categories,
  ) => {
    if (!ready) return Map();
    return actions && actions.map(
      (action) => {
        const entityActors = actorActions.get(parseInt(action.get('id'), 10));
        const entityActorsByActortype = entityActors
          && connections.get('actors')
          && entityActors.filter(
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
            ]).toString()
          ).sortBy((val, key) => key);
        return action.set(
          'categories',
          getEntityCategories(
            action.get('id'),
            actionCategories,
            categories,
          )
        ).set(
          'actors',
          entityActors,
        ).set(
          'actorsByType',
          entityActorsByActortype,
        );
      }
    ).groupBy(
      (r) => r.getIn(['attributes', 'measuretype_id'])
    ).sortBy((val, key) => key);
  }
);
