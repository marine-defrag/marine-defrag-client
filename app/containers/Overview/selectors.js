import { createSelector } from 'reselect';

import {
  selectActorsWhere,
  selectActionsWhere,
  // selectEntities,
} from 'containers/App/selectors';

// import { qe } from 'utils/quasi-equals';

export const selectActorCount = createSelector(
  (state) => selectActorsWhere(state, { where: { draft: false } }),
  (entities) => entities && entities
    .groupBy((e) => e.getIn(['attributes', 'actortype_id']))
    .map((actortypeentities) => actortypeentities.size)
);

export const selectActionCount = createSelector(
  (state) => selectActionsWhere(state, { where: { draft: false } }),
  (entities) => entities.size
);
export const selectActorDraftCount = createSelector(
  (state) => selectActorsWhere(state, { where: { draft: true } }),
  (entities) => entities && entities
    .groupBy((e) => e.getIn(['attributes', 'actortype_id']))
    .map((actortypeentities) => actortypeentities.size)
);
export const selectActionDraftCount = createSelector(
  (state) => selectActionsWhere(state, { where: { draft: true } }),
  (entities) => entities.size
);
