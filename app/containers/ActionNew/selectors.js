import { createSelector } from 'reselect';
import { ACTIONTYPE_ACTORTYPES } from 'themes/config';
import { qe } from 'utils/quasi-equals';

import {
  selectCategories,
  selectActortypes,
  selectActorTaxonomies,
  selectActorsCategorised,
  selectActorActionsGroupedByAction,
} from 'containers/App/selectors';

import { prepareTaxonomies } from 'utils/entities';

export const selectDomain = createSelector(
  (state) => state.get('actionNew'),
  (substate) => substate
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
  (state, id) => id,
  selectActorsCategorised,
  selectActorActionsGroupedByAction,
  selectActortypes,
  (actiontypeId, actors, associations, actortypes) => {
    // compare App/selectors/selectActortypesForActiontype
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
    return filtered.groupBy(
      (actor) => actor.getIn(['attributes', 'actortype_id']).toString()
    );
  }
);
