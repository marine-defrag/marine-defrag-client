import { createSelector } from 'reselect';
import { DB } from 'themes/config';

import {
  selectEntity,
  selectEntities,
} from 'containers/App/selectors';

import {
  entitySetUser,
} from 'utils/entities';

export const selectViewEntity = createSelector(
  (state, id) => selectEntity(state, { path: DB.PAGES, id }),
  (state) => selectEntities(state, DB.USERS),
  (entity, users) => entitySetUser(entity, users)
);
