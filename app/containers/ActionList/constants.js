import {
  DB, ROUTES, USER_ROLES, PUBLISH_STATUSES,
} from 'themes/config';

export const DEPENDENCIES = [
  DB.USERS,
  DB.USER_ROLES,
  DB.CATEGORIES,
  DB.TAXONOMIES,
  // DB.ACTIONS,
  DB.ACTORS,
  // DB.ACTORTYPES,
  DB.ACTORTYPE_TAXONOMIES,
  // DB.ACTOR_ACTIONS,
  DB.ACTOR_CATEGORIES,
  DB.ACTION_CATEGORIES,
];

export const CONFIG = {
  serverPath: DB.ACTIONS,
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
    connectPath: DB.ACTION_CATEGORIES,
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
        path: DB.ACTORS, // filter by actor connection
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
        path: DB.ACTORS, // filter by actor connection
        key: 'actor_id',
        connectPath: DB.ACTOR_ACTIONS, // filter by actor connection
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
