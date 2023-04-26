import { createSelector } from 'reselect';
import { API } from 'themes/config';
import {
  selectEntities,
  selectLocationQuery,
  selectSortByQuery,
  selectSortOrderQuery,
} from 'containers/App/selectors';
import { sortEntities } from 'utils/sort';

import { SORT_OPTION_DEFAULT } from './constants';

export const selectTypeQuery = createSelector(
  selectLocationQuery,
  (locationQuery) => locationQuery && locationQuery.get('type')
);

// kicks off series of cascading selectors
// 1. selectEntitiesWhere filters by attribute
// 2. selectEntitiesSearchQuery filters by keyword
// 3. selectUsers
export const selectBookmarks = createSelector(
  (state) => selectEntities(state, API.BOOKMARKS),
  selectSortByQuery,
  selectSortOrderQuery,
  (entities, sortBy, order) => {
    const sortOption = (!sortBy || sortBy === 'id') && SORT_OPTION_DEFAULT;
    return sortEntities(
      entities,
      order || (sortOption ? sortOption.order : 'asc'),
      sortBy || (sortOption ? sortOption.field : 'title'),
      sortOption ? sortOption.type : 'string',
    );
  }
);
