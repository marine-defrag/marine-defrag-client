import {
  API,
  ROUTES,
  USER_ROLES,
  PUBLISH_STATUSES,
  ACTIONTYPES,
} from 'themes/config';

export const DEPENDENCIES = [
  API.ACTORS,
  API.ACTIONS,
  API.RESOURCES,
  API.ACTOR_ACTIONS,
  API.ACTION_ACTORS,
  API.ACTION_RESOURCES,
  API.ACTOR_CATEGORIES,
  API.ACTION_CATEGORIES,
  API.ACTORTYPES,
  API.ACTIONTYPES,
  API.RESOURCETYPES,
  API.ACTORTYPE_TAXONOMIES,
  API.ACTIONTYPE_TAXONOMIES,
  API.TAXONOMIES,
  API.CATEGORIES,
  API.USERS,
  API.USER_ROLES,
];

export const CONFIG = {
  types: 'actiontypes',
  serverPath: API.ACTIONS,
  clientPath: ROUTES.ACTION,
  views: {
    list: {
      search: ['code', 'title', 'description'],
      sorting: [
        {
          attribute: 'title',
          type: 'string',
          order: 'asc',
        },
        {
          attribute: 'code',
          type: 'string',
          order: 'asc',
        },
        {
          attribute: 'updated_at',
          type: 'date',
          order: 'desc',
          default: true,
        },
        {
          attribute: 'id', // proxy for created at
          type: 'number',
          order: 'desc',
        },
      ],
    },
    map: {
      types: Object.values(ACTIONTYPES),
    },
  },
  taxonomies: { // filter by each category
    query: 'cat',
    search: true,
    connectPath: API.ACTION_CATEGORIES,
    key: 'category_id',
    ownKey: 'measure_id',
    // defaultGroupAttribute: 'groups_actions_default',
  },
  // connectedTaxonomies: { // filter by each category
  //   query: 'catx',
  //   search: true,
  //   exclude: 'tags_actions',
  //   connections: [
  //     {
  //       path: API.ACTORS, // filter by actor connection
  //       message: 'entities.actors.plural',
  //       key: 'actor_id',
  //     },
  //   ],
  // },
  connections: { // filter by associated entity
    query: 'connected',
    type: 'action-actors',
    options: [
      {
        search: true,
        message: 'entities.actors_{typeid}.plural',
        path: API.ACTORS,
        query: API.ACTORS,
        entityType: 'actors',
        clientPath: ROUTES.ACTOR,
        connectPath: API.ACTOR_ACTIONS, // filter by actor connection
        key: 'actor_id',
        ownKey: 'measure_id',
        groupByType: true,
        typeFilter: 'is_active',
      },
    ],
  },
  targets: { // filter by associated entity
    query: 'targeted',
    type: 'action-targets',
    options: [
      {
        search: true,
        message: 'entities.actors_{typeid}.plural',
        path: API.ACTORS,
        query: API.ACTORS,
        entityType: 'targets',
        connectionPath: 'actors',
        clientPath: ROUTES.ACTOR,
        connectPath: API.ACTION_ACTORS, // filter by actor connection
        key: 'actor_id',
        ownKey: 'measure_id',
        groupByType: true,
        typeFilter: 'is_target',
      },
    ],
  },
  parents: { // filter by associated entity
    query: 'parent',
    type: 'action-parents',
    options: [
      {
        search: true,
        message: 'entities.actions_{typeid}.plural',
        path: API.ACTIONS,
        query: API.ACTIONS,
        entityType: 'parents',
        clientPath: ROUTES.ACTION,
        attribute: 'parent_id',
        typeFilter: 'has_parent',
        groupByType: true,
      },
    ],
  },
  resources: { // filter by associated entity
    query: 'resources',
    type: 'action-resources',
    options: [
      {
        search: true,
        message: 'entities.resources_{typeid}.plural',
        path: API.RESOURCES,
        query: API.RESOURCES,
        entityType: 'resources',
        clientPath: ROUTES.RESOURCE,
        connectPath: API.ACTION_RESOURCES, // filter by actor connection
        key: 'resource_id',
        ownKey: 'measure_id',
        groupByType: true,
      },
    ],
  },
  attributes: { // filter by attribute value
    options: [
      {
        search: false,
        message: 'attributes.draft',
        attribute: 'draft',
        options: PUBLISH_STATUSES,
        role: USER_ROLES.MANAGER.value,
      },
    ],
  },
};
