import { createSelector } from 'reselect';
import { DB } from 'themes/config';

import {
  selectEntity,
  selectEntities,
  selectTaxonomiesSorted,
} from 'containers/App/selectors';

import {
  entitySetUser,
  prepareTaxonomiesIsAssociated,
} from 'utils/entities';
import { qe } from 'utils/quasi-equals';

export const selectViewEntity = createSelector(
  (state, id) => selectEntity(state, { path: DB.USERS, id }),
  (state) => selectEntities(state, DB.USERS),
  (state) => selectEntities(state, DB.USER_ROLES),
  (state) => selectEntities(state, DB.ROLES),
  (entity, users, userRoles, roles) => entity && users && userRoles && roles && entitySetUser(entity, users).set(
    'roles',
    userRoles
      .filter((association) => qe(association.getIn(['attributes', 'user_id']), entity.get('id')))
      .map((association) => roles.find((role) => qe(role.get('id'), association.getIn(['attributes', 'role_id']))))
  )
);

export const selectTaxonomies = createSelector(
  (state, id) => id,
  (state) => selectTaxonomiesSorted(state),
  (state) => selectEntities(state, DB.CATEGORIES),
  (state) => selectEntities(state, DB.USER_CATEGORIES),
  (id, taxonomies, categories, associations) => prepareTaxonomiesIsAssociated(taxonomies, categories, associations, 'tags_users', 'user_id', id)
);
