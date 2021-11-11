import { createSelector } from 'reselect';
import { Map } from 'immutable';
import { API } from 'themes/config';

import {
  selectReady,
  selectEntity,
  selectEntities,
  selectCategories,
  selectActorConnections,
  selectTaxonomiesSorted,
  selectActortypeActors,
  selectActortypes,
  selectActorActionsGroupedByAction,
  selectActorActionsGroupedByActor,
  selectActorCategoriesGroupedByActor,
} from 'containers/App/selectors';

import {
  entitySetUser,
  prepareTaxonomiesIsAssociated,
  getEntityCategories,
} from 'utils/entities';
import { qe } from 'utils/quasi-equals';

import { DEPENDENCIES } from './constants';

export const selectViewEntity = createSelector(
  (state, id) => selectEntity(state, { path: API.ACTIONS, id }),
  (state) => selectEntities(state, API.USERS),
  (entity, users) => entitySetUser(entity, users)
);

// TODO optimise use selectActionCategoriesGroupedByAction
export const selectTaxonomies = createSelector(
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

const selectActorAssociations = createSelector(
  (state, id) => id,
  selectActorActionsGroupedByAction,
  (actionId, associations) => associations.get(
    parseInt(actionId, 10)
  )
);
const selectActorsAssociated = createSelector(
  selectActorAssociations,
  selectActortypeActors,
  (associations, actors) => associations
    && associations.reduce(
      (memo, id) => {
        const entity = actors.get(id.toString());
        return entity
          ? memo.set(id, entity)
          : memo;
      },
      Map(),
    )
);

// all connected actors
export const selectActors = createSelector(
  (state) => selectReady(state, { path: DEPENDENCIES }),
  selectActorsAssociated,
  selectActorConnections,
  selectActorActionsGroupedByActor,
  selectActorCategoriesGroupedByActor,
  selectCategories,
  (state) => selectActortypes(state),
  (
    ready,
    actors,
    connections,
    actorActions,
    actorCategories,
    categories,
    actortypes,
  ) => {
    if (!ready) return Map();
    return actors
      && actortypes
      && actors.filter(
        (actor) => {
          const currentActortype = actortypes.find(
            (actortype) => qe(actortype.get('id'), actor.getIn(['attributes', 'actortype_id']))
          );
          return currentActortype.getIn(['attributes', 'has_actions']);
        }
      ).map(
        (actor) => actor.set(
          'categories',
          getEntityCategories(
            actor.get('id'),
            actorCategories,
            categories,
          )
        ).set(
          'actions',
          actorActions.get(parseInt(actor.get('id'), 10))
        )
      ).groupBy(
        (r) => r.getIn(['attributes', 'actortype_id'])
      );
  }
);
