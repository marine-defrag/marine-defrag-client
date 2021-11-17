import { createSelector } from 'reselect';
import { ACTIONTYPE_ACTORTYPES } from 'themes/config';
import { qe } from 'utils/quasi-equals';

import {
  selectCategories,
  selectActiontypes,
  selectActionTaxonomies,
  selectActionsCategorised,
  selectActorActionsGroupedByActor,
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
  selectActorActionsGroupedByActor,
  selectActiontypes,
  (actortypeId, actions, associations, actiontypes) => {
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
    return filtered.groupBy(
      (action) => action.getIn(['attributes', 'measuretype_id']).toString()
    );
  }
);
