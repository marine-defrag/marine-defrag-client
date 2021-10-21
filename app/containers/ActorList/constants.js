import {
  DB, USER_ROLES, PUBLISH_STATUSES, ACCEPTED_STATUSES, ROUTES,
} from 'themes/config';

export const DEPENDENCIES = [
  DB.USERS,
  DB.USER_ROLES,
  DB.CATEGORIES,
  DB.TAXONOMIES,
  DB.ACTIONS,
  DB.ACTORS,
  DB.ACTORTYPES,
  DB.ACTORTYPE_TAXONOMIES,
  DB.ACTOR_ACTIONS,
  DB.ACTOR_CATEGORIES,
  DB.ACTION_CATEGORIES,
];

export const CONFIG = {
  serverPath: DB.ACTORS,
  clientPath: ROUTES.ACTORS,
  search: ['reference', 'title', 'description', 'response'],
  sorting: [
    {
      attribute: 'id', // proxy for created at
      type: 'number',
      order: 'desc',
    },
    {
      attribute: 'reference',
      type: 'string',
      order: 'asc',
      default: true,
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
  actortypes: { // filter by actortype
    query: 'actortypex',
    key: 'actortype_id',
  },
  taxonomies: { // filter by each category
    query: 'cat',
    search: true,
    connectPath: DB.ACTOR_CATEGORIES,
    key: 'category_id',
    ownKey: 'actor_id',
    defaultGroupAttribute: 'groups_actors_default', // used when no actortype is set
    // TODO better store in database join table actortype_taxonomies
    defaultGroupsByActortype: {
      1: { 1: '1', 2: '2' }, // actortype 1 actors are grouped by taxonomies 1 & 2
      2: { 1: '9', 2: '10' }, // actortype 2 SDS are grouped by taxonomies 9 & 10
      3: { 1: '7' }, // actortype 3 SDGs are grouped by taxonomy 7
    },
    groupBy: 'actortype_id',
    editForActortypes: true,
  },
  connections: { // filter by associated entity
    query: 'connected',
    options: [
      {
        search: true,
        message: 'entities.actions.plural',
        path: DB.ACTIONS, // filter by actor connection
        clientPath: ROUTES.ACTIONS, // filter by actor connection
        key: 'action_id',
        connectPath: DB.ACTOR_ACTIONS, // filter by actor connection
        ownKey: 'actor_id',
        editForActortypes: true,
        actortypeFilter: 'has_actions',
      },
    ],
  },
  attributes: { // filter by attribute value
    options: [
      {
        search: false,
        message: 'attributes.accepted',
        attribute: 'accepted',
        options: ACCEPTED_STATUSES,
        editForActortypes: true,
        actortypeFilter: 'has_response',
      },
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
