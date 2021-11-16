import {
  API, ROUTES, USER_ROLES, PUBLISH_STATUSES,
} from 'themes/config';

export const DEPENDENCIES = [
  API.ACTORS,
  API.ACTIONS,
  API.ACTOR_ACTIONS,
  API.ACTION_ACTORS,
  API.ACTOR_CATEGORIES,
  API.ACTION_CATEGORIES,
  API.ACTORTYPES,
  API.ACTIONTYPES,
  API.ACTORTYPE_TAXONOMIES,
  API.ACTIONTYPE_TAXONOMIES,
  API.TAXONOMIES,
  API.CATEGORIES,
  API.USERS,
  API.USER_ROLES,
];

export const CONFIG = {
  serverPath: API.ACTIONS,
  clientPath: ROUTES.ACTION,
  search: ['code', 'title', 'description'],
  sorting: [
    {
      attribute: 'id', // proxy for created at
      type: 'number',
      order: 'desc',
      default: true,
    },
    {
      attribute: 'code',
      type: 'string',
      order: 'asc',
    },
    {
      attribute: 'title',
      type: 'string',
      order: 'asc',
    },
    {
      attribute: 'updated_at',
      type: 'date',
      order: 'desc',
    },
  ],
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
    type: 'actors',
    options: [
      {
        search: true,
        message: 'entities.actors_{typeid}.plural',
        path: API.ACTORS, // filter by actor connection
        query: API.ACTORS, // filter by actor connection
        key: 'actor_id',
        connectPath: API.ACTOR_ACTIONS, // filter by actor connection
        ownKey: 'measure_id',
        groupByType: true,
        typeFilter: 'is_active',
      },
    ],
  },
  // targets: { // filter by associated entity
  //   query: 'targeted',
  //   options: [
  //     {
  //       search: true,
  //       message: 'entities.actors_{actortypeid}.plural',
  //       path: 'targets', // filter by actor connection
  //       key: 'actor_id',
  //       connectPath: API.ACTION_ACTORS, // filter by actor connection
  //       ownKey: 'measure_id',
  //       groupByType: true,
  //       typeFilter: 'is_target',
  //     },
  //   ],
  // },
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
