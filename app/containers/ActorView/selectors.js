import { createSelector } from 'reselect';
import { Map } from 'immutable';
import { API } from 'themes/config';

import {
  selectReady,
  selectEntity,
  selectEntities,
  selectActionConnections,
  selectTaxonomiesSorted,
  selectActortypeActions,
  selectActorActionsByAction,
  selectActionCategoriesByAction,
  selectActorActionsByActor,
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

// TODO optimise use selectActorCategoriesByActor
export const selectTaxonomies = createSelector(
  (state, id) => id,
  (state) => selectTaxonomiesSorted(state),
  (state) => selectEntities(state, API.CATEGORIES),
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
  selectActorActionsByActor,
  (actorId, associations) => associations.get(
    parseInt(actorId, 10)
  )
);
const selectActionsAssociated = createSelector(
  selectActionAssociations,
  selectActortypeActions,
  (associations, actions) => associations
    && associations.reduce(
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
export const selectActions = createSelector(
  (state) => selectReady(state, { path: DEPENDENCIES }),
  selectActionsAssociated,
  (state) => selectActionConnections(state),
  selectActorActionsByAction,
  selectActionCategoriesByAction,
  (state) => selectEntities(state, API.CATEGORIES),
  (
    ready,
    actions,
    connections,
    actionActors,
    actionCategories,
    categories,
  ) => {
    if (!ready) return Map();
    return actions && actions.map(
      (action) => {
        const entityActors = actionActors.get(parseInt(action.get('id'), 10));
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
          );
        return action.set(
          'categories',
          getEntityCategories(
            action.get('id'),
            actionCategories,
            categories,
          )
        ).set(
          'actors',
          entityActors
        // nest connected actor ids byactortype
        ).set(
          'actorsByActortype',
          entityActorsByActortype,
        );
      }
    );
  }
);
