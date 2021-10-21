import { createSelector } from 'reselect';
import { selectEntities, selectLocation } from 'containers/App/selectors';
import { getBookmarkForLocation } from 'utils/bookmark';
import { DB } from 'themes/config';

export const selectBookmarkForLocation = createSelector(
  (state) => selectEntities(state, DB.BOOKMARKS),
  (state) => selectLocation(state),
  (bookmarks, location) => getBookmarkForLocation(location, bookmarks),
);
