// import { API, USER_ROLES, ROUTES } from 'themes/config';
import { API, ROUTES, USER_STATUSES } from 'themes/config';

export const DEPENDENCIES = [
  API.USERS,
  API.ROLES,
  API.USER_ROLES,
  API.CATEGORIES,
  API.TAXONOMIES,
  API.USER_CATEGORIES,
  API.PAGES,
];

export const CONFIG = {
  types: 'users',
  clientPath: ROUTES.USERS,
  serverPath: API.USERS,
  views: {
    list: {
      search: ['name'],
    },
  },
  attributes: { // filter by attribute value
    options: [
      {
        search: false,
        message: 'attributes.is_archived',
        attribute: 'is_archived',
        options: USER_STATUSES,
        filterUI: 'checkboxes',
      },
    ],
  },
};
