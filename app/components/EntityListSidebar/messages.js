/*
 * EntityListSidebar Messages
 *
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  header: {
    filter: {
      id: 'app.components.EntityListSidebar.header.filter',
      defaultMessage: 'Filter List',
    },
    filterButton: {
      id: 'app.components.EntityListSidebar.header.filterButton',
      defaultMessage: 'Filter',
    },
    editButton: {
      id: 'app.components.EntityListSidebar.header.editButton',
      defaultMessage: 'Edit',
    },
  },
  sidebarToggle: {
    showFilter: {
      id: 'app.components.EntityListSidebar.sidebarToggle.showFilter',
      defaultMessage: 'Show filter options',
    },
    showFilterEdit: {
      id: 'app.components.EntityListSidebar.sidebarToggle.showFilterEdit',
      defaultMessage: 'Show filter & edit options',
    },
    hide: {
      id: 'app.components.EntityListSidebar.sidebarToggle.hide',
      defaultMessage: 'Hide options',
    },
  },
  groupExpand: {
    show: {
      id: 'app.components.EntityListSidebar.groupExpand.show',
      defaultMessage: 'Show group',
    },
    hide: {
      id: 'app.components.EntityListSidebar.groupExpand.hide',
      defaultMessage: 'Hide group',
    },
  },
  groupOptionSelect: {
    show: {
      id: 'app.components.EntityListSidebar.groupOptionSelect.show',
      defaultMessage: 'Show options',
    },
    hide: {
      id: 'app.components.EntityListSidebar.groupOptionSelect.hide',
      defaultMessage: 'Hide options',
    },
  },
  filterGroupLabel: {
    attributes: {
      id: 'app.components.EntityListSidebar.filterGroupLabel.attributes',
      defaultMessage: 'By attribute',
    },
    actortypes: {
      id: 'app.components.EntityListSidebar.filterGroupLabel.actortypes',
      defaultMessage: 'By actortype',
    },
    taxonomies: {
      id: 'app.components.EntityListSidebar.filterGroupLabel.taxonomies',
      defaultMessage: 'By category',
    },
    taxonomiesByActortype: {
      id: 'app.components.EntityListSidebar.filterGroupLabel.taxonomiesByActortype',
      defaultMessage: 'By category ({actortype})',
    },
    connections: {
      id: 'app.components.EntityListSidebar.filterGroupLabel.connections',
      defaultMessage: 'By connection',
    },
    targets: {
      id: 'app.components.EntityListSidebar.filterGroupLabel.targets',
      defaultMessage: 'By target',
    },
    connectedTaxonomies: {
      id: 'app.components.EntityListSidebar.filterGroupLabel.connectedTaxonomies',
      defaultMessage: 'By connected category',
    },
  },
  editGroupLabel: {
    attributes: {
      id: 'app.components.EntityListSidebar.editGroupLabel.attributes',
      defaultMessage: 'Update attributes',
    },
    taxonomies: {
      id: 'app.components.EntityListSidebar.editGroupLabel.taxonomies',
      defaultMessage: 'Update categories',
    },
    connections: {
      id: 'app.components.EntityListSidebar.editGroupLabel.connections',
      defaultMessage: 'Update connections',
    },
    targets: {
      id: 'app.components.EntityListSidebar.editGroupLabel.targets',
      defaultMessage: 'Update targets',
    },
  },
  filterFormTitlePrefix: {
    id: 'app.components.EntityListSidebar.filterFormTitlePrefix',
    defaultMessage: 'Filter by',
  },
  filterFormWithoutPrefix: {
    id: 'app.components.EntityListSidebar.filterFormWithoutPrefix',
    defaultMessage: 'Without',
  },
  editFormTitlePrefix: {
    id: 'app.components.EntityListSidebar.editFormTitlePrefix',
    defaultMessage: 'Update',
  },
  editFormTitlePostfix: {
    id: 'app.components.EntityListSidebar.editFormTitlePostfix',
    defaultMessage: 'selected',
  },
  entitiesNotFound: {
    id: 'app.components.EntityListSidebar.entitiesNotFound',
    defaultMessage: 'No entities found',
  },
  entitiesNotSelected: {
    id: 'app.components.EntityListSidebar.entitiesNotSelected',
    defaultMessage: 'Please select one or more entities from the list for available edit options',
  },
});
