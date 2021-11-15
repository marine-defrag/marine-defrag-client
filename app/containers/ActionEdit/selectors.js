import { createSelector } from 'reselect';
import { API, ACTIONTYPE_ACTORTYPES } from 'themes/config';
import { qe } from 'utils/quasi-equals';

import {
  selectEntity,
  selectEntities,
  selectActorsCategorised,
  selectActorTaxonomies,
  selectActortypes,
  selectActorActionsGroupedByAction,
  selectActionCategoriesGroupedByAction,
  selectCategories,
  selectTaxonomiesSorted,
  selectReady,
} from 'containers/App/selectors';

import {
  entitiesSetAssociated,
  entitySetUser,
  prepareTaxonomiesAssociated,
  prepareTaxonomies,
} from 'utils/entities';

import { DEPENDENCIES } from './constants';

export const selectDomain = createSelector(
  (state) => state.get('actionEdit'),
  (substate) => substate
);

export const selectViewEntity = createSelector(
  (state, id) => selectEntity(state, { path: API.ACTIONS, id }),
  (state) => selectEntities(state, API.USERS),
  (entity, users) => entitySetUser(entity, users)
);
export const selectTaxonomyOptions = createSelector(
  selectViewEntity,
  selectTaxonomiesSorted,
  (state) => selectEntities(state, API.ACTIONTYPE_TAXONOMIES),
  selectCategories,
  selectActionCategoriesGroupedByAction,
  (
    entity,
    taxonomies,
    actiontypeTaxonomies,
    categories,
    associations,
  ) => {
    if (
      entity
      && taxonomies
      && actiontypeTaxonomies
      && categories
      && associations
    ) {
      const id = entity.get('id');
      const taxonomiesForType = taxonomies.filter((tax) => actiontypeTaxonomies.some(
        (type) => qe(
          type.getIn(['attributes', 'taxonomy_id']),
          tax.get('id'),
        ) && qe(
          type.getIn(['attributes', 'measuretype_id']),
          entity.getIn(['attributes', 'measuretype_id']),
        )
      ));
      return prepareTaxonomiesAssociated(
        taxonomiesForType,
        categories,
        associations,
        'tags_actions',
        id,
        false,
      );
    }
    return null;
  }
);

export const selectConnectedTaxonomies = createSelector(
  selectActorTaxonomies,
  selectCategories,
  (taxonomies, categories) => prepareTaxonomies(
    taxonomies,
    categories,
    false,
  )
);

export const selectActorsByActortype = createSelector(
  (state) => selectReady(state, { path: DEPENDENCIES }),
  selectViewEntity,
  selectActorsCategorised,
  selectActorActionsGroupedByAction,
  selectActortypes,
  (ready, action, actors, associations, actortypes) => {
    if (!ready) return null;
    const actiontypeId = action.getIn(['attributes', 'measuretype_id']).toString();
    const validActortypeIds = ACTIONTYPE_ACTORTYPES[actiontypeId];
    const actortypesForActiontype = actortypes.filter(
      (type) => validActortypeIds && validActortypeIds.indexOf(type.get('id')) > -1
    );
    const filtered = actors.filter(
      (actor) => {
        const actortype = actortypesForActiontype.find(
          (at) => qe(
            at.get('id'),
            actor.getIn(['attributes', 'actortype_id']),
          )
        );
        return actortype && actortype.getIn(['attributes', 'is_active']);
      }
    );
    return entitiesSetAssociated(
      filtered,
      associations,
      action.get('id'),
    ).groupBy(
      (actor) => actor.getIn(['attributes', 'actortype_id']).toString()
    );
  }
);
