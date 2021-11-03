import {
  API, USER_ROLES, PUBLISH_STATUSES, ACCEPTED_STATUSES, ROUTES,
} from 'themes/config';

export const DEPENDENCIES = [
  API.USERS,
  API.USER_ROLES,
  API.CATEGORIES,
  API.TAXONOMIES,
  API.ACTIONS,
  API.ACTORS,
  API.ACTORTYPES,
  API.ACTORTYPE_TAXONOMIES,
  API.ACTOR_ACTIONS,
  API.ACTOR_CATEGORIES,
  API.ACTION_CATEGORIES,
];

export const CONFIG = {
  serverPath: API.ACTORS,
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
    connectPath: API.ACTOR_CATEGORIES,
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
        path: API.ACTIONS, // filter by actor connection
        clientPath: ROUTES.ACTIONS, // filter by actor connection
        key: 'action_id',
        connectPath: API.ACTOR_ACTIONS, // filter by actor connection
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
