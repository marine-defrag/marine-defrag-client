/*
 * EntityListPages Messages
 *
 * This contains all the text for the EntityList component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  without: {
    id: 'app.components.EntityListPages.without',
    defaultMessage: 'Without',
  },
  continued: {
    id: 'app.components.EntityListPages.continued',
    defaultMessage: '{label} (continued)',
  },
  draft: {
    id: 'app.components.EntityListPages.draft',
    defaultMessage: 'draft',
  },
  listEmpty: {
    id: 'app.components.EntityListPages.listEmpty',
    defaultMessage: 'No entities in database',
  },
  listEmptyAfterQuery: {
    id: 'app.components.EntityListPages.listEmptyAfterQuery',
    defaultMessage: 'We are sorry, no results matched your search',
  },
  listEmptyAfterQueryAndErrors: {
    id: 'app.components.EntityListPages.listEmptyAfterQueryAndErrors',
    defaultMessage: 'Some errors are hidden by current filter settings. Please remove your filters to see all errors.',
  },
  entityNoLongerPresent: {
    id: 'app.components.EntityListPages.entityNoLongerPresent',
    defaultMessage: 'Item with database id \'{entityId}\' no longer exists.',
  },
  entityListHeader: {
    allSelected: {
      id: 'app.components.EntityListPages.entityListHeader.allSelected',
      defaultMessage: 'All {total} {type} selected. ',
    },
    allSelectedOnPage: {
      id: 'app.components.EntityListPages.entityListHeader.allSelectedOnPage',
      defaultMessage: 'All {total} {type} on this page are selected. ',
    },
    selected: {
      id: 'app.components.EntityListPages.entityListHeader.selected',
      defaultMessage: '{total} {type} selected. ',
    },
    noneSelected: {
      id: 'app.components.EntityListPages.entityListHeader.noneSelected',
      defaultMessage: '{type} (showing {pageTotal} of {entitiesTotal} total)',
    },
    notPaged: {
      id: 'app.components.EntityListPages.entityListHeader.notPaged',
      defaultMessage: '{entitiesTotal} {type}',
    },
  },
});
