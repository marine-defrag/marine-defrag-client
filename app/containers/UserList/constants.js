import { DB, USER_ROLES, ROUTES } from 'themes/config';

export const DEPENDENCIES = [
  DB.USERS,
  DB.ROLES,
  DB.USER_ROLES,
  DB.CATEGORIES,
  DB.TAXONOMIES,
  DB.USER_CATEGORIES,
];

export const CONFIG = {
  clientPath: ROUTES.USERS,
  serverPath: DB.USERS,
  search: ['name'],
  sorting: [
    {
      attribute: 'id', // proxy for created at
      type: 'number',
      order: 'desc',
    },
    {
      attribute: 'name',
      type: 'string',
      order: 'asc',
      default: true,
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
    connectPath: DB.USER_CATEGORIES,
    key: 'category_id',
    ownKey: 'user_id',
  },
  connections: { // filter by associated entity
    query: 'connected',
    options: [
      {
        edit: false,
        search: true,
        popover: false,
        message: 'entities.roles.single',
        path: DB.ROLES, // filter by actor connection
        key: 'role_id',
        labels: Object.values(USER_ROLES),
      },
    ],
  },
};
