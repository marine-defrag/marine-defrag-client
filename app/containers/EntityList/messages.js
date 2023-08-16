/*
 * EntityList Messages
 *
 * This contains all the text for the ActionView component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  processingUpdates: {
    id: 'app.containers.EntityList.processingUpdates',
    defaultMessage: 'Processing {processNo} of {totalNo} {types}.',
  },
  updatesFailed: {
    id: 'app.containers.EntityList.updatesFailed',
    defaultMessage: '{errorNo} {types} failed! Please wait for the items to be updated from the server and then carefully review the affected items above.',
  },
  updatesSuccess: {
    id: 'app.containers.EntityList.updatesSuccess',
    defaultMessage: 'All {successNo} {types} succeeded!',
  },
  deleteSuccess: {
    id: 'app.containers.EntityList.deleteSuccess',
    defaultMessage: 'All {successNo} {types} succeeded!',
  },
  createSuccess: {
    id: 'app.containers.EntityList.createSuccess',
    defaultMessage: 'All {successNo} {types} succeeded!',
  },
  type_save: {
    id: 'app.containers.EntityList.type_save',
    defaultMessage: 'update(s)',
  },
  type_new: {
    id: 'app.containers.EntityList.type_new',
    defaultMessage: 'addition(s)',
  },
  type_delete: {
    id: 'app.containers.EntityList.type_delete',
    defaultMessage: 'deletion(s)',
  },
  filterFormWithoutPrefix: {
    id: 'app.containers.EntityList.filterFormWithoutPrefix',
    defaultMessage: 'Without',
  },
  filterFormAnyPrefix: {
    id: 'app.containers.EntityList.filterFormAnyPrefix',
    defaultMessage: 'Some',
  },
  filterFormError: {
    id: 'app.containers.EntityList.filterFormError',
    defaultMessage: 'Errors',
  },
  highlightCategory: {
    id: 'app.containers.EntitiesCategories.highlightCategory',
    defaultMessage: 'Highlight by {categoryName}',
  },
  viewOptionList: {
    id: 'app.containers.EntityList.viewOptionList',
    defaultMessage: 'List',
  },
  viewOptionMap: {
    id: 'app.containers.EntityList.viewOptionMap',
    defaultMessage: 'Map',
  },
  viewOptionTimeline: {
    id: 'app.containers.EntityList.viewOptionTimeline',
    defaultMessage: 'Over time',
  },
  noDateHint: {
    id: 'app.containers.EntityList.noDateHint',
    defaultMessage: 'Note: there are {count} {entityTitle} without a date in the database',
  },
});
