import { createSelector } from 'reselect';
import { ACTIONTYPE_ACTORTYPES, ACTIONTYPE_TARGETTYPES } from 'themes/config';
import { qe } from 'utils/quasi-equals';

import {
  selectCategories,
  selectActiontypes,
  selectActionTaxonomies,
  selectActionsCategorised,
  selectActorsCategorised,
  selectActortypes,
} from 'containers/App/selectors';
import { prepareTaxonomies } from 'utils/entities';

export const selectDomain = createSelector(
  (state) => state.get('actorNew'),
  (substate) => substate
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
  (state, id) => id,
  selectActionsCategorised,
  selectActiontypes,
  (actortypeId, actions, actiontypes) => {
    if (!actiontypes || !actions) return null;
    // compare App/selectors/selectActiontypesForActortype
    const validActiontypeIds = Object.keys(ACTIONTYPE_ACTORTYPES).filter((actiontypeId) => {
      const actortypeIds = ACTIONTYPE_ACTORTYPES[actiontypeId];
      return actortypeIds && actortypeIds.indexOf(actortypeId) > -1;
    });
    if (!validActiontypeIds || validActiontypeIds.length === 0) {
      return null;
    }
    const actiontypesForActortype = actiontypes.filter(
      (type) => validActiontypeIds && validActiontypeIds.indexOf(type.get('id')) > -1
    );
    const filtered = actions.filter(
      (action) => actiontypesForActortype.find(
        (at) => qe(
          at.get('id'),
          action.getIn(['attributes', 'measuretype_id']),
        )
      )
    );
    return filtered.groupBy(
      (action) => action.getIn(['attributes', 'measuretype_id']).toString()
    ).sortBy((val, key) => key);
  }
);
export const selectActionsAsTargetByActiontype = createSelector(
  (state, id) => id,
  selectActionsCategorised,
  selectActiontypes,
  (actortypeId, actions, actiontypes) => {
    if (!actiontypes || !actions) return null;
    // compare App/selectors/selectActiontypesForActortype
    const validActiontypeIds = Object.keys(ACTIONTYPE_TARGETTYPES).filter((actiontypeId) => {
      const actortypeIds = ACTIONTYPE_TARGETTYPES[actiontypeId];
      return actortypeIds && actortypeIds.indexOf(actortypeId) > -1;
    });
    if (!validActiontypeIds || validActiontypeIds.length === 0) {
      return null;
    }
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
        return actiontype && actiontype.getIn(['attributes', 'has_target']);
      }
    );
    return filtered.groupBy(
      (action) => action.getIn(['attributes', 'measuretype_id']).toString()
    ).sortBy((val, key) => key);
  }
);

export const selectMembersByActortype = createSelector(
  (state, id) => id,
  selectActorsCategorised,
  selectActortypes,
  (actortypeId, actors, actortypes) => {
    if (!actortypes || !actors) return null;
    const viewActortype = actortypes && actortypes.get(actortypeId);
    if (!viewActortype || !viewActortype.getIn(['attributes', 'has_members'])) {
      // console.log('no members for actortype', actortypeId)
      return null;
    }
    const membertypes = actortypes.filter(
      (type) => !type.getIn(['attributes', 'has_members'])
    );
    const filtered = actors.filter(
      (actor) => membertypes.find(
        (at) => qe(
          at.get('id'),
          actor.getIn(['attributes', 'actortype_id']),
        )
      )
    );
    return filtered.groupBy(
      (actor) => actor.getIn(['attributes', 'actortype_id']).toString()
    ).sortBy((val, key) => key);
  }
);

export const selectAssociationsByActortype = createSelector(
  (state, id) => id,
  selectActorsCategorised,
  selectActortypes,
  (actortypeId, actors, actortypes) => {
    if (!actortypes || !actors) return null;
    const viewActortype = actortypes && actortypes.get(actortypeId);
    if (!viewActortype || viewActortype.getIn(['attributes', 'has_members'])) {
      // console.log('no memberships for actortype', actortypeId)
      return null;
    }
    const associationtypes = actortypes.filter(
      (type) => type.getIn(['attributes', 'has_members'])
    );
    const filtered = actors.filter(
      (actor) => associationtypes.find(
        (at) => qe(
          at.get('id'),
          actor.getIn(['attributes', 'actortype_id']),
        )
      )
    );
    return filtered.groupBy(
      (actor) => actor.getIn(['attributes', 'actortype_id']).toString()
    ).sortBy((val, key) => key);
  }
);
