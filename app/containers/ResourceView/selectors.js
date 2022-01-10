import { createSelector } from 'reselect';
import { Map } from 'immutable';
import { API } from 'themes/config';

import {
  selectReady,
  selectEntity,
  selectEntities,
  selectCategories,
  selectActionConnections,
  selectActions,
  selectActionResourcesGroupedByResource,
  selectActionCategoriesGroupedByAction,
  selectActorActionsGroupedByAction,
} from 'containers/App/selectors';

import {
  entitySetUser,
  getEntityCategories,
} from 'utils/entities';

import { DEPENDENCIES } from './constants';

export const selectViewEntity = createSelector(
  (state, id) => selectEntity(state, { path: API.RESOURCES, id }),
  (state) => selectEntities(state, API.USERS),
  (entity, users) => entitySetUser(entity, users)
);

const selectActionAssociations = createSelector(
  (state, id) => id,
  selectActionResourcesGroupedByResource,
  (resourceId, associationsByResource) => associationsByResource.get(
    parseInt(resourceId, 10)
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
