/**
 * The global state selectors
 *
 * use the makeSelector () => createSelector pattern when you want a selector that
 * doesn't take arguments, but can have its own cache between components
 *
 * otherwise use straight createSelector
 * https://github.com/react-boilerplate/react-boilerplate/pull/1205#issuecomment-274319934
 *
 */
import { createSelector } from 'reselect';
import { reduce } from 'lodash/collection';
import { Map, List } from 'immutable';

import asArray from 'utils/as-array';
import asList from 'utils/as-list';
import { sortEntities } from 'utils/sort';

import { USER_ROLES, API, ROUTES } from 'themes/config';

import {
  filterEntitiesByAttributes,
  filterEntitiesByKeywords,
  entitiesSetCategoryIds,
  prepareTaxonomies,
} from 'utils/entities';
import { qe } from 'utils/quasi-equals';
import { PARAMS } from './constants';

// high level state selects
const getRoute = (state) => state.get('route');
const getGlobal = (state) => state.get('global');
const getGlobalRequested = (state) => state.getIn(['global', 'requested']);

export const selectNewEntityModal = createSelector(
  getGlobal,
  (globalState) => globalState.get('newEntityModal')
);

export const selectIsAuthenticating = createSelector(
  getGlobal,
  (globalState) => globalState.getIn(['auth', 'sending'])
);

const selectReadyUserRoles = (state) => !!state.getIn(['global', 'ready', 'user_roles']);

export const selectReadyForAuthCheck = createSelector(
  selectIsAuthenticating,
  selectReadyUserRoles,
  (isAuthenticating, rolesReady) => !isAuthenticating && rolesReady
);

export const selectSessionUser = createSelector(
  getGlobal,
  (state) => state.get('user')
);

export const selectIsSignedIn = createSelector(
  selectSessionUser,
  (sessionUser) => sessionUser && sessionUser.get('isSignedIn')
);

export const selectSessionUserAttributes = createSelector(
  selectSessionUser,
  (sessionUser) => sessionUser && sessionUser.get('attributes')
);

export const selectSessionUserId = createSelector(
  selectSessionUserAttributes,
  (sessionUserAttributes) => sessionUserAttributes && sessionUserAttributes.id.toString()
);

export const selectIsSigningIn = createSelector(
  selectIsSignedIn,
  selectSessionUserAttributes,
  (signedIn, user) => signedIn && !user
);

// const makeSessionUserRoles = () => selectSessionUserRoles;
export const selectSessionUserRoles = createSelector(
  (state) => state,
  selectIsSignedIn,
  selectSessionUserId,
  (state, isSignedIn, sessionUserId) => isSignedIn && sessionUserId
    ? selectEntitiesWhere(state, {
      path: API.USER_ROLES,
      where: { user_id: sessionUserId },
    })
      .map((role) => role.getIn(['attributes', 'role_id']))
      .toList()
    : Map()
);


export const selectIsUserAdmin = createSelector(
  selectSessionUserRoles,
  (userRoles) => userRoles.includes(USER_ROLES.ADMIN.value)
);

export const selectIsUserManager = createSelector(
  selectSessionUserRoles,
  (userRoles) => userRoles.includes(USER_ROLES.MANAGER.value)
    || userRoles.includes(USER_ROLES.ADMIN.value)
);

export const selectIsUserAnalyst = createSelector(
  selectSessionUserRoles,
  (userRoles) => userRoles.includes(USER_ROLES.ANALYST.value)
    || userRoles.includes(USER_ROLES.MANAGER.value)
    || userRoles.includes(USER_ROLES.ADMIN.value)
);


export const selectHasUserRole = createSelector(
  selectIsUserAdmin,
  selectIsUserManager,
  selectIsUserAnalyst,
  (isAdmin, isManager, isAnalyst) => ({
    [USER_ROLES.ADMIN.value]: isAdmin,
    [USER_ROLES.MANAGER.value]: isManager,
    [USER_ROLES.ANALYST.value]: isAnalyst,
  })
);

export const selectSessionUserHighestRoleId = createSelector(
  selectSessionUserRoles,
  (userRoles) => {
    if (userRoles.includes(USER_ROLES.ADMIN.value)) {
      return USER_ROLES.ADMIN.value;
    }
    if (userRoles.includes(USER_ROLES.MANAGER.value)) {
      return USER_ROLES.MANAGER.value;
    }
    if (userRoles.includes(USER_ROLES.ANALYST.value)) {
      return USER_ROLES.ANALYST.value;
    }
    return USER_ROLES.DEFAULT.value;
  }
);


// makeSelectLocationState expects a plain JS object for the routing state
export const makeSelectLocationState = () => {
  let prevRoutingState;
  let prevRoutingStateJS;

  return (state) => {
    const routingState = state.get('route'); // or state.route

    if (!routingState.equals(prevRoutingState)) {
      prevRoutingState = routingState;
      prevRoutingStateJS = routingState.toJS();
    }

    return prevRoutingStateJS;
  };
};

export const selectCurrentPathname = createSelector(
  getRoute,
  (routeState) => {
    try {
      return routeState.getIn(['locationBeforeTransitions', 'pathname']);
    } catch (error) {
      return null;
    }
  }
);

export const selectRedirectOnAuthSuccessPath = createSelector(
  getRoute,
  (routeState) => {
    try {
      return routeState.getIn([
        'locationBeforeTransitions',
        'query',
        PARAMS.REDIRECT_ON_AUTH_SUCCESS,
      ]);
    } catch (error) {
      return null;
    }
  }
);

export const selectQueryMessages = createSelector(
  getRoute,
  (routeState) => {
    try {
      return ({
        info: routeState.getIn(['locationBeforeTransitions', 'query', 'info']),
        warning: routeState.getIn(['locationBeforeTransitions', 'query', 'warning']),
        error: routeState.getIn(['locationBeforeTransitions', 'query', 'error']),
        infotype: routeState.getIn(['locationBeforeTransitions', 'query', 'infotype']),
      });
    } catch (error) {
      return null;
    }
  }
);

export const selectPreviousPathname = createSelector(
  getRoute,
  (routeState) => {
    try {
      return routeState.getIn(['locationBeforeTransitions', 'pathnamePrevious']);
    } catch (error) {
      return null;
    }
  }
);

export const selectRequestedAt = createSelector(
  getGlobalRequested,
  (state, { path }) => path,
  (requested, path) => requested.get(path)
);

export const selectReady = (state, { path }) => reduce(asArray(path),
  (areReady, readyPath) => areReady && (
    !!state.getIn(['global', 'ready', readyPath])
      || Object.values(API).indexOf(readyPath) === -1
  ),
  true);

export const selectLocation = createSelector(
  getRoute,
  (routeState) => {
    try {
      return routeState.get('locationBeforeTransitions');
    } catch (error) {
      return null;
    }
  }
);

export const selectLocationQuery = createSelector(
  selectLocation,
  (location) => location && location.get('query')
);

// TODO consider replacing all "(state, locationQuery) => locationQuery" with selectLocationQuery
const selectWhereQuery = createSelector(
  (state, locationQuery) => locationQuery,
  (locationQuery) => locationQuery && locationQuery.get('where')
);
export const selectAttributeQuery = createSelector(
  (state, { locationQuery }) => selectWhereQuery(state, locationQuery),
  (whereQuery) => whereQuery && asList(whereQuery).reduce(
    (memo, where) => {
      const attrValue = where.split(':');
      return Object.assign(memo, { [attrValue[0]]: attrValue[1] });
    },
    {},
  )
);
export const selectWithoutQuery = createSelector(
  (state, locationQuery) => locationQuery,
  (locationQuery) => locationQuery && locationQuery.get('without')
);
export const selectCategoryQuery = createSelector(
  (state, locationQuery) => locationQuery,
  (locationQuery) => locationQuery && locationQuery.get('cat')
);
export const selectConnectionQuery = createSelector(
  (state, locationQuery) => locationQuery,
  (locationQuery) => locationQuery && locationQuery.get('connected')
);
export const selectConnectedCategoryQuery = createSelector(
  (state, locationQuery) => locationQuery,
  (locationQuery) => locationQuery && locationQuery.get('catx')
);
export const selectSearchQuery = createSelector(
  (state, locationQuery) => locationQuery,
  (locationQuery) => locationQuery && locationQuery.get('search')
);
export const selectActortypeListQuery = createSelector(
  (state, locationQuery) => locationQuery,
  (locationQuery) => locationQuery && locationQuery.get('actortypex')
);
export const selectActiontypeListQuery = createSelector(
  (state, locationQuery) => locationQuery,
  (locationQuery) => locationQuery && locationQuery.get('actiontypex')
);
export const selectSortOrderQuery = createSelector(
  (state, locationQuery) => locationQuery,
  (locationQuery) => locationQuery && locationQuery.get('order')
);
export const selectSortByQuery = createSelector(
  (state, locationQuery) => locationQuery,
  (locationQuery) => locationQuery && locationQuery.get('sort')
);

export const selectActortypeQuery = createSelector(
  selectLocationQuery,
  (query) => (query && query.get('actortype'))
    ? query.get('actortype')
    : 'all'
);
export const selectActiontypeQuery = createSelector(
  selectLocationQuery,
  (query) => (query && query.get('actiontype'))
    ? query.get('actiontype')
    : 'all'
);

const selectEntitiesAll = (state) => state.getIn(['global', 'entities']);

export const selectEntities = createSelector(
  selectEntitiesAll,
  (state, path) => path,
  (entities, path) => entities.get(path)
);

export const selectActortypes = createSelector(
  (state) => selectEntities(state, API.ACTORTYPES),
  (entities) => entities
);
export const selectActiontypes = createSelector(
  (state) => selectEntities(state, API.ACTIONTYPES),
  (entities) => entities
);
// use for testing single actortype configuration
// && entities.filter((actortype) => actortype.get('id') === '1')

export const selectActiveActortypes = createSelector(
  selectActortypes,
  selectActortypeQuery,
  (entities, typeQuery) => {
    if (
      entities
      && entities.size > 1
      && typeQuery
      && typeQuery !== 'all'
    ) {
      return entities.filter((type) => qe(typeQuery, type.get('id')));
    }
    return entities;
  }
);
export const selectActiveActiontypes = createSelector(
  selectActiontypes,
  selectActiontypeQuery,
  (entities, typeQuery) => {
    if (
      entities
      && entities.size > 1
      && typeQuery
      && typeQuery !== 'all'
    ) {
      return entities.filter((type) => qe(typeQuery, type.get('id')));
    }
    return entities;
  }
);

export const selectActortypeActors = createSelector(
  (state) => selectEntities(state, API.ACTORS),
  selectActortypeQuery,
  (entities, actortype) => {
    if (entities && actortype && actortype !== 'all') {
      return entities.filter(
        (actor) => qe(
          actortype,
          actor.getIn(['attributes', 'actortype_id']),
        )
      );
    }
    return entities;
  }
);
export const selectActiontypeActions = createSelector(
  (state) => selectEntities(state, API.ACTIONS),
  selectActiontypeQuery,
  (entities, type) => {
    if (entities && type && type !== 'all') {
      return entities.filter(
        (actor) => qe(
          type,
          actor.getIn(['attributes', 'actiontype_id']),
        )
      );
    }
    return entities;
  }
);
export const selectActions = createSelector(
  (state) => selectEntities(state, API.ACTIONS),
  (entities) => entities
);
export const selectActors = createSelector(
  (state) => selectEntities(state, API.ACTORS),
  (entities) => entities
);
// returns actions not associated or associated with current actortype
export const selectActortypeActions = createSelector(
  (state) => selectEntities(state, API.ACTIONS),
  (entities) => entities
);
// export const selectActortypeActions = createSelector(
//   (state) => selectEntities(state, API.ACTIONS),
//   selectActortypeQuery,
//   selectActortypeActors,
//   (state) => selectEntities(state, API.ACTOR_ACTIONS), // active
//   selectIsUserManager,
//   (entities, actortype, actors, actorActions, isManager) => {
//     if (entities && actors && actorActions) {
//       if (actortype && actortype !== 'all') {
//         return entities.filter(
//           (action) => {
//             const actorIds = actorActions.filter(
//               (rm) => qe(
//                 rm.getIn(['attributes', 'action_id']),
//                 action.get('id'),
//               )
//             ).map(
//               (rm) => rm.getIn(['attributes', 'actor_id'])
//             );
//             return (isManager && actorIds.size === 0) || actorIds.some(
//               (id) => !!actors.find(
//                 (actor) => qe(actor.get('id'), id)
//               )
//             );
//           }
//         );
//       }
//       return entities;
//     }
//     return null;
//   }
// );
export const selectActiontypeActors = createSelector(
  (state) => selectEntities(state, API.ACTORS),
  (entities) => entities
);
// export const selectActiontypeActors = createSelector(
//   (state) => selectEntities(state, API.ACTORS),
//   selectActiontypeQuery,
//   selectActiontypeActions,
//   (state) => selectEntities(state, API.ACTOR_ACTIONS), // active
//   selectIsUserManager,
//   (entities, actiontype, actions, actorActions, isManager) => {
//     if (entities && actions && actorActions) {
//       if (actiontype && actiontype !== 'all') {
//         return entities.filter(
//           (actor) => {
//             const actionIds = actorActions.filter(
//               (rm) => qe(
//                 rm.getIn(['attributes', 'actor_id']),
//                 actor.get('id'),
//               )
//             ).map(
//               (rm) => rm.getIn(['attributes', 'action_id'])
//             );
//             // TODO check manager check here
//             return (isManager && actionIds.size === 0) || actionIds.some(
//               (id) => !!actions.find(
//                 (action) => qe(action.get('id'), id)
//               )
//             );
//           }
//         );
//       }
//       return entities;
//     }
//     return null;
//   }
// );

export const selectActortypeEntitiesAll = createSelector(
  selectEntitiesAll,
  selectActortypeActors,
  selectActortypeActions,
  (entities, actors, actions) => entities
    .set('actors', actors)
    .set('actions', actions)
);
export const selectActiontypeEntitiesAll = createSelector(
  selectEntitiesAll,
  selectActiontypeActors,
  selectActiontypeActions,
  (entities, actors, actions) => entities
    .set('actors', actors)
    .set('actions', actions)
);

export const selectTaxonomies = createSelector(
  (state) => selectEntities(state, API.TAXONOMIES),
  (taxonomies) => taxonomies
);

export const selectActortypeTaxonomies = createSelector(
  (state) => selectEntities(state, API.TAXONOMIES),
  (state) => selectEntities(state, API.ACTORTYPE_TAXONOMIES),
  selectActortypeQuery,
  (taxonomies, actortypeTaxonomies, actortype) => taxonomies
    && actortypeTaxonomies
    && taxonomies.map(
      (tax) => {
        const actortypeNotSet = !actortype || actortype === 'all';

        // connected to current actortype
        const connectedToActortype = actortypeTaxonomies.some(
          (type) => qe(
            type.getIn(['attributes', 'taxonomy_id']),
            tax.get('id'),
          ) && (
            actortypeNotSet
            || qe(
              type.getIn(['attributes', 'actortype_id']),
              actortype,
            )
          )
        );
        // connectedActortypes
        const actortypeIds = actortypeTaxonomies.reduce(
          (memo, type) => {
            if (
              qe(
                type.getIn(['attributes', 'taxonomy_id']),
                tax.get('id')
              )
            ) {
              return memo.push(type.getIn(['attributes', 'actortype_id']));
            }
            return memo;
          },
          List(),
        );
        return tax
          .setIn(['attributes', 'tags_actors'], connectedToActortype)
          .set('actortypeIds', actortypeIds);
      }
    ).filter(
      (tax) => tax.getIn(['attributes', 'tags_actors'])
      // || tax.getIn(['attributes', 'tags_actions'])
      // || tax.getIn(['attributes', 'tags_users'])
    )
);
export const selectActiontypeTaxonomies = createSelector(
  (state) => selectEntities(state, API.TAXONOMIES),
  (state) => selectEntities(state, API.ACTIONTYPE_TAXONOMIES),
  selectActiontypeQuery,
  (taxonomies, actiontypeTaxonomies, actiontype) => taxonomies
    && actiontypeTaxonomies
    && taxonomies.map(
      (tax) => {
        const actortypeNotSet = !actiontype || actiontype === 'all';
        // connected to current actortype
        const connectedToActiontype = actiontypeTaxonomies.some(
          (type) => qe(
            type.getIn(['attributes', 'taxonomy_id']),
            tax.get('id'),
          ) && (
            actortypeNotSet
            || qe(
              type.getIn(['attributes', 'actiontype_id']),
              type,
            )
          )
        );
        // connectedActortypes
        const actiontypeIds = actiontypeTaxonomies.reduce(
          (memo, type) => {
            if (
              qe(
                type.getIn(['attributes', 'taxonomy_id']),
                tax.get('id')
              )
            ) {
              return memo.push(type.getIn(['attributes', 'actiontype_id']));
            }
            return memo;
          },
          List(),
        );
        return tax
          .setIn(['attributes', 'tags_actors'], connectedToActiontype)
          .set('actortypeIds', actiontypeIds);
      }
    ).filter(
      (tax) => tax.getIn(['attributes', 'tags_actors'])
      // || tax.getIn(['attributes', 'tags_actions'])
      // || tax.getIn(['attributes', 'tags_users'])
    )
);
export const selectTaxonomiesSorted = createSelector(
  selectTaxonomies,
  (taxonomies) => taxonomies
    && sortEntities(taxonomies, 'asc', 'priority', null, false)
);
export const selectActortypeTaxonomiesSorted = createSelector(
  selectActortypeTaxonomies,
  (taxonomies) => taxonomies
    && sortEntities(taxonomies, 'asc', 'priority', null, false)
);
export const selectActiontypeTaxonomiesSorted = createSelector(
  selectActiontypeTaxonomies,
  (taxonomies) => taxonomies
    && sortEntities(taxonomies, 'asc', 'priority', null, false)
);

export const selectEntity = createSelector(
  (state, { path }) => selectEntities(state, path),
  (state, { id }) => id,
  (entities, id) => id && entities.get(id.toString())
);
export const selectTaxonomy = createSelector(
  (state, id) => id,
  (state) => selectTaxonomies(state),
  (id, entities) => id && entities.get(id.toString())
);

// filter entities by attributes, using object
export const selectEntitiesWhere = createSelector(
  (state, { where }) => where,
  (state, { path }) => selectEntities(state, path),
  (query, entities) => query
    ? filterEntitiesByAttributes(entities, query)
    : entities
);

// filter entities by attributes, using locationQuery
const selectEntitiesWhereQuery = createSelector(
  selectAttributeQuery,
  (state, { path }) => selectEntities(state, path),
  (query, entities) => query
    ? filterEntitiesByAttributes(entities, query)
    : entities
);
export const selectEntitiesSearchQuery = createSelector(
  selectEntitiesWhereQuery,
  (state, { locationQuery }) => selectSearchQuery(state, locationQuery),
  (state, { searchAttributes }) => searchAttributes,
  (entities, query, searchAttributes) => query
    ? filterEntitiesByKeywords(entities, query, searchAttributes)
    : entities // !search
);

// filter entities by attributes, using object
export const selectActorsWhere = createSelector(
  (state, { where }) => where,
  selectActiontypeActors,
  (query, entities) => query
    ? filterEntitiesByAttributes(entities, query)
    : entities
);

// filter entities by attributes, using locationQuery
const selectActorsWhereQuery = createSelector(
  selectAttributeQuery,
  selectActiontypeActors,
  (query, entities) => query
    ? filterEntitiesByAttributes(entities, query)
    : entities
);
export const selectActorsSearchQuery = createSelector(
  selectActorsWhereQuery,
  (state, { locationQuery }) => selectSearchQuery(state, locationQuery),
  (state, { searchAttributes }) => searchAttributes,
  (entities, query, searchAttributes) => query
    ? filterEntitiesByKeywords(entities, query, searchAttributes)
    : entities // !search
);

// filter entities by attributes, using object
export const selectActionsWhere = createSelector(
  (state, { where }) => where,
  selectActiontypeActions,
  (query, entities) => query
    ? filterEntitiesByAttributes(entities, query)
    : entities
);

// filter entities by attributes, using locationQuery
const selectActionsWhereQuery = createSelector(
  selectAttributeQuery,
  selectActiontypeActions,
  (query, entities) => query
    ? filterEntitiesByAttributes(entities, query)
    : entities
);
export const selectActionsSearchQuery = createSelector(
  selectActionsWhereQuery,
  (state, { locationQuery }) => selectSearchQuery(state, locationQuery),
  (state, { searchAttributes }) => searchAttributes,
  (entities, query, searchAttributes) => query
    ? filterEntitiesByKeywords(entities, query, searchAttributes)
    : entities // !search
);

export const selectUserConnections = createSelector(
  (state) => selectEntities(state, API.ROLES),
  (roles) => Map().set('roles', roles)
);

export const selectActorConnections = createSelector(
  selectActiontypeActions,
  (actions) => Map()
    .set('actions', actions)
);

export const selectActionConnections = createSelector(
  selectActortypeActors,
  (actors) => Map()
    .set('actors', actors)
);

export const selectActionTaxonomies = createSelector(
  (state, args) => args ? args.includeParents : true,
  (state) => selectActiontypeTaxonomiesSorted(state),
  (state) => selectEntities(state, API.CATEGORIES),
  (includeParents, taxonomies, categories) => prepareTaxonomies(
    taxonomies,
    categories,
    'tags_actions',
    includeParents,
  )
);

export const selectActorTaxonomies = createSelector(
  (state, args) => args ? args.includeParents : true,
  (state) => selectActiontypeTaxonomiesSorted(state),
  (state) => selectEntities(state, API.CATEGORIES),
  (includeParents, taxonomies, categories) => prepareTaxonomies(
    taxonomies,
    categories,
    'tags_actors',
    includeParents,
  )
);
export const selectAllTaxonomiesWithCategories = createSelector(
  (state) => selectEntities(state, API.TAXONOMIES),
  (state) => selectEntities(state, API.CATEGORIES),
  (taxonomies, categories) => sortEntities(
    taxonomies,
    'asc',
    'priority',
    null,
    false // as Map
  ).map(
    (tax) => tax.set(
      'categories',
      categories.filter(
        (cat) => qe(
          tax.get('id'),
          cat.getIn(['attributes', 'taxonomy_id']),
        )
      )
    )
  )
);

export const selectUserTaxonomies = createSelector(
  (state) => selectTaxonomiesSorted(state),
  (state) => selectEntities(state, API.CATEGORIES),
  (taxonomies, categories) => prepareTaxonomies(
    taxonomies,
    categories,
    'tags_users',
  )
);

export const selectActorCategoriesByActor = createSelector(
  (state) => selectEntities(state, API.ACTOR_CATEGORIES),
  (entities) => entities
    && entities.groupBy(
      (entity) => entity.getIn(['attributes', 'actor_id'])
    ).map(
      (group) => group.map(
        (entity) => entity.getIn(['attributes', 'category_id'])
      )
    ),
);
export const selectActorCategoriesByCategory = createSelector(
  (state) => selectEntities(state, API.ACTOR_CATEGORIES),
  (entities) => entities
    && entities.groupBy(
      (entity) => entity.getIn(['attributes', 'category_id'])
    ).map(
      (group) => group.map(
        (entity) => entity.getIn(['attributes', 'actor_id'])
      )
    ),
);
export const selectActorActionsByActor = createSelector(
  (state) => selectEntities(state, API.ACTOR_ACTIONS),
  (entities) => entities
    && entities.groupBy(
      (entity) => entity.getIn(['attributes', 'actor_id'])
    ).map(
      (group) => group.map(
        (entity) => entity.getIn(['attributes', 'action_id'])
      )
    ),
);
export const selectActorActionsByAction = createSelector(
  (state) => selectEntities(state, API.ACTOR_ACTIONS),
  (entities) => entities
    && entities.groupBy(
      (entity) => entity.getIn(['attributes', 'action_id'])
    ).map(
      (group) => group.map(
        (entity) => entity.getIn(['attributes', 'actor_id'])
      )
    ),
);

export const selectActionCategoriesByAction = createSelector(
  (state) => selectEntities(state, API.ACTION_CATEGORIES),
  (entities) => entities
    && entities.groupBy(
      (entity) => entity.getIn(['attributes', 'action_id'])
    ).map(
      (group) => group.map(
        (entity) => entity.getIn(['attributes', 'category_id'])
      )
    ),
);
export const selectActionCategoriesByCategory = createSelector(
  (state) => selectEntities(state, API.ACTION_CATEGORIES),
  (entities) => entities
    && entities.groupBy(
      (entity) => entity.getIn(['attributes', 'category_id'])
    ).map(
      (group) => group.map(
        (entity) => entity.getIn(['attributes', 'action_id'])
      )
    ),
);
export const selectUserCategoriesByUser = createSelector(
  (state) => selectEntities(state, API.USER_CATEGORIES),
  (entities) => entities
    && entities.groupBy(
      (entity) => entity.getIn(['attributes', 'user_id'])
    ).map(
      (group) => group.map(
        (entity) => entity.getIn(['attributes', 'category_id'])
      )
    ),
);
export const selectUserCategoriesByCategory = createSelector(
  (state) => selectEntities(state, API.USER_CATEGORIES),
  (entities) => entities
    && entities.groupBy(
      (entity) => entity.getIn(['attributes', 'category_id'])
    ).map(
      (group) => group.map(
        (entity) => entity.getIn(['attributes', 'user_id'])
      )
    ),
);

// get actors with category ids
export const selectActorsCategorised = createSelector(
  selectActortypeActors,
  selectActorCategoriesByActor,
  (entities, associationsGrouped) => entitiesSetCategoryIds(
    entities,
    associationsGrouped,
  )
);

export const selectActionsCategorised = createSelector(
  selectActiontypeActions,
  selectActionCategoriesByAction,
  (entities, associationsGrouped) => entitiesSetCategoryIds(
    entities,
    associationsGrouped,
  )
);

// TODO: likely obsolete
export const selectViewActorActortypeId = createSelector(
  (state, id) => selectEntity(state, { path: API.ACTORS, id }),
  selectCurrentPathname,
  (entity, pathname) => {
    if (
      pathname.startsWith(ROUTES.ACTORS)
      && entity
      && entity.getIn(['attributes', 'actortype_id'])
    ) {
      return entity.getIn(['attributes', 'actortype_id']).toString();
    }
    return null;
  }
);
