import {
  API, ROUTES, USER_ROLES, PUBLISH_STATUSES,
} from 'themes/config';

export const DEPENDENCIES = [
  API.USERS,
  API.USER_ROLES,
  API.CATEGORIES,
  API.TAXONOMIES,
  // API.ACTIONS,
  API.ACTORS,
  // API.ACTORTYPES,
  API.ACTORTYPE_TAXONOMIES,
  // API.ACTOR_ACTIONS,
  API.ACTOR_CATEGORIES,
  API.ACTION_CATEGORIES,
];

export const CONFIG = {
  serverPath: API.ACTIONS,
  clientPath: ROUTES.ACTIONS,
  search: ['title'],
  sorting: [
    {
      attribute: 'id', // proxy for created at
      type: 'number',
      order: 'desc',
      default: true,
    },
    {
      attribute: 'title',
      type: 'string',
      order: 'asc',
    },
    {
      attribute: 'target_date',
      type: 'date',
      order: 'desc',
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
    ownKey: 'action_id',
    defaultGroupAttribute: 'groups_actions_default',
  },
  connectedTaxonomies: { // filter by each category
    query: 'catx',
    search: true,
    exclude: 'tags_actions',
    connections: [
      {
        path: API.ACTORS, // filter by actor connection
        message: 'entities.actors.plural',
        key: 'actor_id',
      },
    ],
  },
  connections: { // filter by associated entity
    query: 'connected',
    options: [
      {
        search: true,
        message: 'entities.actors_{actortypeid}.plural',
        path: API.ACTORS, // filter by actor connection
        key: 'actor_id',
        connectPath: API.ACTOR_ACTIONS, // filter by actor connection
        ownKey: 'action_id',
        groupByActortype: true,
        actortypeFilter: 'has_actions',
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
        role: USER_ROLES.ANALYST.value,
      },
    ],
  },
};
