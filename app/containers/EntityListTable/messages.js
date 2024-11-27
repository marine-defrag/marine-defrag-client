/*
 * EntityListPages Messages
 *
 * This contains all the text for the EntityList component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  without: {
    id: 'app.containers.EntityListTable.without',
    defaultMessage: 'Without',
  },
  continued: {
    id: 'app.containers.EntityListTable.continued',
    defaultMessage: '{label} (continued)',
  },
  draft: {
    id: 'app.containers.EntityListTable.draft',
    defaultMessage: 'draft',
  },
  listEmpty: {
    id: 'app.containers.EntityListTable.listEmpty',
    defaultMessage: 'No entities in database',
  },
  listEmptyAfterQuery: {
    id: 'app.containers.EntityListTable.listEmptyAfterQuery',
    defaultMessage: 'We are sorry, no results matched your search',
  },
  listEmptyAfterQueryAndErrors: {
    id: 'app.containers.EntityListTable.listEmptyAfterQueryAndErrors',
    defaultMessage: 'Some errors are hidden by current filter settings. Please remove your filters to see all errors.',
  },
  entityNoLongerPresent: {
    id: 'app.containers.EntityListTable.entityNoLongerPresent',
    defaultMessage: 'Item with database id \'{entityId}\' no longer exists.',
  },
  entityListHeader: {
    allSelected: {
      id: 'app.containers.EntityListTable.entityListHeader.allSelected',
      defaultMessage: 'All {total} {type} selected. ',
    },
    allSelectedOnPage: {
      id: 'app.containers.EntityListTable.entityListHeader.allSelectedOnPage',
      defaultMessage: 'All {total} {type} on this page are selected. ',
    },
    selected: {
      id: 'app.containers.EntityListTable.entityListHeader.selected',
      defaultMessage: '{total} {type} selected. ',
    },
    noneSelected: {
      id: 'app.containers.EntityListTable.entityListHeader.noneSelected',
      defaultMessage: '{type} (showing {pageTotal} of {entitiesTotal} total)',
    },
    notPaged: {
      id: 'app.containers.EntityListTable.entityListHeader.notPaged',
      defaultMessage: '{entitiesTotal} {type}',
    },
  },
  skipNext: {
    id: 'app.containers.EntityListTable.skipNext',
    defaultMessage: 'Skip to next list item or group, continue to list item details',
  },
});
