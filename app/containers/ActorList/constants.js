import {
  API, USER_ROLES, PUBLISH_STATUSES, ROUTES,
} from 'themes/config';

export const DEPENDENCIES = [
  API.ACTIONS,
  API.ACTORS,
  API.ACTION_ACTORS,
  API.ACTOR_ACTIONS,
  API.ACTION_CATEGORIES,
  API.ACTOR_CATEGORIES,
  API.ACTIONTYPES,
  API.ACTORTYPES,
  API.ACTIONTYPE_TAXONOMIES,
  API.ACTORTYPE_TAXONOMIES,
  API.TAXONOMIES,
  API.CATEGORIES,
  API.USERS,
  API.USER_ROLES,
];

export const CONFIG = {
  serverPath: API.ACTORS,
  clientPath: ROUTES.ACTOR,
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
  taxonomies: { // filter by each category
    query: 'cat',
    search: true,
    connectPath: API.ACTOR_CATEGORIES,
    key: 'category_id',
    ownKey: 'actor_id',
    // defaultGroupAttribute: 'groups_actors_default', // used when no actortype is set
    // // TODO better store in database join table actortype_taxonomies
    // defaultGroupsByActortype: {
    //   1: { 1: '1', 2: '2' }, // actortype 1 actors are grouped by taxonomies 1 & 2
    //   2: { 1: '9', 2: '10' }, // actortype 2 SDS are grouped by taxonomies 9 & 10
    //   3: { 1: '7' }, // actortype 3 SDGs are grouped by taxonomy 7
    // },
    // groupBy: 'actortype_id',
    // editForActortypes: true,
  },
  // connections: { // filter by associated entity
  //   query: 'connected',
  //   options: [
  //     {
  //       search: true,
  //       message: 'entities.actions_{actiontypeid}.plural',
  //       path: API.ACTIONS, // filter by actor connection
  //       clientPath: ROUTES.ACTIONS, // filter by actor connection
  //       key: 'measure_id',
  //       connectPath: API.ACTOR_ACTIONS, // filter by actor connection
  //       ownKey: 'actor_id',
  //       groupByActiontype: true,
  //       actiontypeFilter: 'has_actions',
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
        role: USER_ROLES.ANALYST.value,
      },
    ],
  },
};
