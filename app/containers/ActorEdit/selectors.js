import { createSelector } from 'reselect';
import { API, ACTIONTYPE_ACTORTYPES } from 'themes/config';
import { qe } from 'utils/quasi-equals';

import {
  selectEntity,
  selectEntities,
  selectActionsCategorised,
  selectActionTaxonomies,
  selectActiontypes,
  selectActionActorsGroupedByActor,
  selectActorCategoriesGroupedByActor,
  selectCategories,
  selectTaxonomiesSorted,
  selectReady,
} from 'containers/App/selectors';

import {
  entitySetUser,
  entitiesSetAssociated,
  prepareTaxonomiesAssociated,
  prepareTaxonomies,
} from 'utils/entities';

import { DEPENDENCIES } from './constants';

export const selectDomain = createSelector(
  (state) => state.get('actorEdit'),
  (substate) => substate
);

export const selectViewEntity = createSelector(
  (state, id) => selectEntity(state, { path: API.ACTORS, id }),
  (state) => selectEntities(state, API.USERS),
  (entity, users) => entitySetUser(entity, users)
);

export const selectTaxonomyOptions = createSelector(
  selectViewEntity,
  selectTaxonomiesSorted,
  (state) => selectEntities(state, API.ACTORTYPE_TAXONOMIES),
  selectCategories,
  selectActorCategoriesGroupedByActor,
  (
    entity,
    taxonomies,
    typeTaxonomies,
    categories,
    associations,
  ) => {
    if (
      entity
      && taxonomies
      && typeTaxonomies
      && categories
      && associations
    ) {
      const id = entity.get('id');
      const taxonomiesForType = taxonomies.filter((tax) => typeTaxonomies.some(
        (type) => qe(
          type.getIn(['attributes', 'taxonomy_id']),
          tax.get('id'),
        ) && qe(
          type.getIn(['attributes', 'actortype_id']),
          entity.getIn(['attributes', 'actortype_id']),
        )
      ));

      return prepareTaxonomiesAssociated(
        taxonomiesForType,
        categories,
        associations,
        'tags_actors',
        id,
        false,
      );
    }
    return null;
  }
);

export const selectConnectedTaxonomies = createSelector(
  selectActionTaxonomies,
  selectCategories,
  (taxonomies, categories) => prepareTaxonomies(
    taxonomies,
    categories,
    false,
  )
);

export const selectActionsByActiontype = createSelector(
  (state) => selectReady(state, { path: DEPENDENCIES }),
  selectViewEntity,
  selectActionsCategorised,
  selectActionActorsGroupedByActor,
  selectActiontypes,
  (ready, actor, actions, associations, actiontypes) => {
    if (!ready) return null;
    const actortypeId = actor.getIn(['attributes', 'actortype_id']).toString();
    // compare App/selectors/selectActiontypesForActortype
    const validActiontypeIds = Object.keys(ACTIONTYPE_ACTORTYPES).filter((actiontypeId) => {
      const actortypeIds = ACTIONTYPE_ACTORTYPES[actiontypeId];
      return actortypeIds && actortypeIds.indexOf(actortypeId) > -1;
    });

    const actiontypesForActortype = actiontypes.filter(
      (type) => validActiontypeIds && validActiontypeIds.indexOf(type.get('id')) > -1
    );
    const filtered = actions.filter(
      (action) => {
        const actiontype = actiontypesForActortype.find(
          (at) => qe(
            at.get('id'),
            action.getIn(['attributes', 'measuretype_id']),
          )
        );
        return !!actiontype;
      }
    );
    return entitiesSetAssociated(
      filtered,
      associations,
      actor.get('id'),
    ).groupBy(
      (action) => action.getIn(['attributes', 'measuretype_id']).toString()
    );
  }
);
