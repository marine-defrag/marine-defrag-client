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

import {
  API,
  ROUTES,
  USER_ROLES,
  ACTIONTYPE_ACTORTYPES,
  ACTIONTYPE_TARGETTYPES,
  ACTIONTYPE_RESOURCETYPES,
  DEFAULT_ACTIONTYPE,
  DEFAULT_ACTORTYPE,
  FF_ACTIONTYPE,
  ACTORTYPES_CONFIG,
  ACTIONTYPES_CONFIG,
  ACTORTYPES,
} from 'themes/config';

import {
  filterEntitiesByAttributes,
  filterEntitiesByKeywords,
  entitiesSetCategoryIds,
  prepareTaxonomies,
  prepareTaxonomiesTags,
  // setActorConnections,
} from 'utils/entities';
import { qe } from 'utils/quasi-equals';
import { PARAMS } from './constants';

// high level state selects
const getRoute = (state) => state.get('route');
const getGlobal = (state) => state.get('global');

// data loading ///////////////////////////////////////////////////////////////

const getGlobalRequested = (state) => state.getIn(['global', 'requested']);

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


// ui states ///////////////////////////////////////////////////////////////////

export const selectNewEntityModal = createSelector(
  getGlobal,
  (globalState) => globalState.get('newEntityModal')
);
export const selectMapLoading = createSelector(
  getGlobal,
  (globalState) => globalState.get('mapLoading').size > 0,
);
export const selectMapViewFromState = createSelector(
  (state, mapId) => mapId,
  getGlobal,
  (mapId, globalState) => globalState.getIn(['mapView', mapId])
    && globalState.getIn(['mapView', mapId]).toJS(),
);

// users and user authentication ///////////////////////////////////////////////

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

export const selectAuthReady = createSelector(
  selectIsSignedIn,
  selectReadyUserRoles,
  (signedIn, rolesReady) => signedIn && rolesReady
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


// location and queries ////////////////////////////////////////////////////////

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

export const selectHasBack = createSelector(
  selectCurrentPathname,
  selectPreviousPathname,
  (currentPath, previousPath) => {
    const isPreviousValid = previousPath.indexOf('/edit') > -1
      || previousPath.indexOf('/new') > -1;
    return !isPreviousValid && previousPath && (previousPath !== currentPath);
  }
);

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

// filter queries //////////////////////////////////////////////////////////////

const selectWhereQuery = createSelector(
  selectLocationQuery,
  (locationQuery) => locationQuery && locationQuery.get('where')
);
export const selectAttributeQuery = createSelector(
  selectWhereQuery,
  (whereQuery) => whereQuery && asList(whereQuery).reduce(
    (memo, where) => {
      const attrValue = where.split(':');
      return Object.assign(memo, { [attrValue[0]]: attrValue[1] });
    },
    {},
  )
);

export const selectWithoutQuery = createSelector(
  selectLocationQuery,
  (locationQuery) => locationQuery && locationQuery.get('without')
);
export const selectAnyQuery = createSelector(
  selectLocationQuery,
  (locationQuery) => locationQuery && locationQuery.get('any')
);
export const selectCategoryQuery = createSelector(
  selectLocationQuery,
  (locationQuery) => locationQuery && locationQuery.get('cat')
);
export const selectConnectionQuery = createSelector(
  selectLocationQuery,
  (locationQuery) => locationQuery && locationQuery.get('connected')
);
export const selectActionQuery = createSelector(
  selectLocationQuery,
  (locationQuery) => locationQuery && locationQuery.get('action')
);
export const selectActorQuery = createSelector(
  selectLocationQuery,
  (locationQuery) => locationQuery && locationQuery.get('actor')
);
export const selectParentQuery = createSelector(
  selectLocationQuery,
  (locationQuery) => locationQuery && locationQuery.get('parent')
);
export const selectTargetedQuery = createSelector(
  selectLocationQuery,
  (locationQuery) => locationQuery && locationQuery.get('targeted')
);
export const selectTargetingQuery = createSelector(
  selectLocationQuery,
  (locationQuery) => locationQuery && locationQuery.get('targeting')
);
export const selectMemberQuery = createSelector(
  selectLocationQuery,
  (locationQuery) => locationQuery && locationQuery.get('by-member')
);
export const selectAssociationQuery = createSelector(
  selectLocationQuery,
  (locationQuery) => locationQuery && locationQuery.get('by-association')
);
export const selectResourceQuery = createSelector(
  selectLocationQuery,
  (locationQuery) => locationQuery && locationQuery.get('resources')
);
export const selectSearchQuery = createSelector(
  selectLocationQuery,
  (locationQuery) => locationQuery && locationQuery.get('search')
);
export const selectSortOrderQuery = createSelector(
  selectLocationQuery,
  (locationQuery) => locationQuery && locationQuery.get('order')
);
export const selectSortByQuery = createSelector(
  selectLocationQuery,
  (locationQuery) => locationQuery && locationQuery.get('sort')
);
export const selectPageItemsQuery = createSelector(
  selectLocationQuery,
  (locationQuery) => locationQuery && locationQuery.get('items')
);
export const selectPageNoQuery = createSelector(
  selectLocationQuery,
  (locationQuery) => locationQuery && locationQuery.get('page')
);
export const selectTimelineHighlightCategory = createSelector(
  selectLocationQuery,
  (locationQuery) => locationQuery && locationQuery.get('tlcat')
);

export const selectActortypeQuery = createSelector(
  selectLocationQuery,
  (query) => (query && query.get('actortype'))
    ? query.get('actortype')
    : DEFAULT_ACTORTYPE
);
export const selectActiontypeQuery = createSelector(
  selectLocationQuery,
  (query) => (query && query.get('actiontype'))
    ? query.get('actiontype')
    : DEFAULT_ACTIONTYPE
);

export const selectViewQuery = createSelector(
  selectLocationQuery,
  (locationQuery) => locationQuery && (locationQuery.get('view'))
);
export const selectSubjectQuery = createSelector(
  selectLocationQuery,
  (locationQuery) => locationQuery && (locationQuery.get('subj'))
);
export const selectMapSubjectQuery = createSelector(
  selectLocationQuery,
  (locationQuery) => locationQuery && (locationQuery.get('msubj'))
);
export const selectIncludeActorMembers = createSelector(
  selectLocationQuery,
  (locationQuery) => {
    if (locationQuery && locationQuery.get('am')) {
      return qe(locationQuery.get('am'), 1) || locationQuery.get('am') === 'true';
    }
    return true; // default
  }
);
export const selectIncludeTargetMembers = createSelector(
  selectLocationQuery,
  (locationQuery) => {
    if (locationQuery && locationQuery.get('tm')) {
      return qe(locationQuery.get('tm'), 1) || locationQuery.get('tm') === 'true';
    }
    return true; // default
  }
);
export const selectIncludeMembersForFiltering = createSelector(
  selectLocationQuery,
  (locationQuery) => {
    if (locationQuery && locationQuery.get('fm')) {
      return qe(locationQuery.get('fm'), 1) || locationQuery.get('fm') === 'true';
    }
    return true; // default
  }
);
export const selectIncludeActorChildren = createSelector(
  selectLocationQuery,
  (locationQuery) => {
    if (locationQuery && locationQuery.get('ac')) {
      return qe(locationQuery.get('ac'), 1) || locationQuery.get('ac') === 'true';
    }
    return true; // default
  }
);
export const selectIncludeTargetChildren = createSelector(
  selectLocationQuery,
  (locationQuery) => {
    if (locationQuery && locationQuery.get('tc')) {
      return qe(locationQuery.get('tc'), 1) || locationQuery.get('tc') === 'true';
    }
    return true; // default
  }
);
export const selectFFOverlay = createSelector(
  selectLocationQuery,
  (locationQuery) => (locationQuery && locationQuery.get('ff')) || '0'
);
export const selectHasFFOverlay = createSelector(
  selectFFOverlay,
  (ffOverlay) => !!ffOverlay && !qe(ffOverlay, 0)
);
export const selectShowFFasCircles = createSelector(
  getGlobal,
  (state) => state.get('showFFasCircles')
);

export const selectIsPrintView = createSelector(
  getGlobal,
  (state) => !!state.get('printConfig')
);

export const selectPrintConfig = createSelector(
  getGlobal,
  (state) => state.get('printConfig') || {}
);
export const selectMapTooltips = createSelector(
  selectLocationQuery,
  (locationQuery) => (locationQuery && locationQuery.get('mtt'))
    ? locationQuery.get('mtt').split(';')
    : []
);
export const selectMapView = createSelector(
  selectLocationQuery,
  (locationQuery) => {
    if (locationQuery && locationQuery.get('mvw')) {
      const [zoom, lat, lng] = locationQuery.get('mvw').split('|');
      return {
        zoom: parseInt(zoom, 10),
        center: { lat: parseFloat(lat), lng: parseFloat(lng) },
      };
    }
    return null;
  }
);


// database ////////////////////////////////////////////////////////////////////////

export const selectEntitiesAll = (state) => state.getIn(['global', 'entities']);

export const selectEntities = createSelector(
  selectEntitiesAll,
  (state, path) => path,
  (entities, path) => entities.get(path)
);

// select a single entity by path and id
export const selectEntity = createSelector(
  (state, { path }) => selectEntities(state, path),
  (state, { id }) => id,
  (entities, id) => id && entities.get(id.toString())
);


// actions and activities //////////////////////////////////////////////////////

// all actions
export const selectActions = createSelector(
  (state) => selectEntities(state, API.ACTIONS),
  (entities) => sortEntities(entities, 'asc', 'title', null, false)
);
export const selectAction = createSelector(
  (state, id) => selectEntity(state, { id, path: API.ACTIONS }),
  (entity) => entity
);
// all actors
export const selectActors = createSelector(
  (state) => selectEntities(state, API.ACTORS),
  (entities) => sortEntities(entities, 'asc', 'title', null, false)
);
export const selectActor = createSelector(
  (state, id) => selectEntity(state, { id, path: API.ACTORS }),
  (entity) => entity
);

// all resources
export const selectResources = createSelector(
  (state) => selectEntities(state, API.RESOURCES),
  (entities) => sortEntities(entities, 'desc', 'id', null, false)
);
export const selectResource = createSelector(
  (state, id) => selectEntity(state, { id, path: API.RESOURCES }),
  (entity) => entity
);
export const selectUsers = createSelector(
  (state) => selectEntities(state, API.USERS),
  (entities) => sortEntities(entities, 'asc', 'name', null, false)
);
// all action types
export const selectActortypes = createSelector(
  (state) => selectEntities(state, API.ACTORTYPES),
  (entities) => entities && entities.sort((a, b) => {
    const configA = ACTORTYPES_CONFIG[a.get('id')];
    const configB = ACTORTYPES_CONFIG[b.get('id')];
    if (configA && configB) {
      return configA.order < configB.order
        ? -1
        : 1;
    }
    return 1;
  })
);
// all action types
export const selectActiontypes = createSelector(
  (state) => selectEntities(state, API.ACTIONTYPES),
  (state, args) => args ? args.includeFacts : false,
  (entities, includeFacts) => {
    if (!entities) return null;
    const sorted = entities.sort((a, b) => {
      const configA = ACTIONTYPES_CONFIG[a.get('id')];
      const configB = ACTIONTYPES_CONFIG[b.get('id')];
      return configA.order < configB.order ? -1 : 1;
    });
    return includeFacts
      ? sorted
      : sorted.filter((t) => !qe(t.get('id'), FF_ACTIONTYPE));
  }
);
export const selectActiontypesWithActionCount = createSelector(
  selectActions,
  selectActiontypes,
  (actions, types) => actions && types && types.map((type) => {
    const typeActions = actions.filter(
      (action) => qe(
        action.getIn(['attributes', 'measuretype_id']),
        type.get('id'),
      )
    );
    return type.set('count', typeActions.size);
  })
);


// all facts action types
export const selectFactsActiontype = createSelector(
  (state) => selectEntities(state, API.ACTIONTYPES),
  (entities) => entities && entities.find((t) => qe(t.get('id'), FF_ACTIONTYPE))
);
// all resource types
export const selectResourcetypes = createSelector(
  (state) => selectEntities(state, API.RESOURCETYPES),
  (entities) => entities
);
export const selectActortypesForActiontype = createSelector(
  (state, { type }) => type,
  selectActortypes,
  (typeId, actortypes) => {
    if (!actortypes) return null;
    const validActortypeIds = ACTIONTYPE_ACTORTYPES[typeId];
    return actortypes.filter(
      (type) => validActortypeIds && validActortypeIds.indexOf(type.get('id')) > -1
    );
  }
);

export const selectActortypesWithActorCount = createSelector(
  selectActors,
  selectActortypes,
  (actors, types) => actors && types && types.map((type) => {
    const typeActors = actors.filter((actor) => qe(actor.getIn(['attributes', 'actortype_id']), type.get('id')));
    return type.set('count', typeActors.size);
  })
);


export const selectResourcetypesForActiontype = createSelector(
  (state, { type }) => type,
  selectResourcetypes,
  (typeId, types) => {
    if (!types) return null;
    const validTypeIds = ACTIONTYPE_RESOURCETYPES[typeId];
    return types.filter(
      (type) => validTypeIds && validTypeIds.indexOf(type.get('id')) > -1
    );
  }
);

export const selectActiontypesForActortype = createSelector(
  (state, { type }) => type,
  selectActiontypes,
  (typeId, actiontypes) => {
    if (!actiontypes) return null;
    const validActiontypeIds = Object.keys(ACTIONTYPE_ACTORTYPES).filter((actiontypeId) => {
      const actortypeIds = ACTIONTYPE_ACTORTYPES[actiontypeId];
      return actortypeIds && actortypeIds.indexOf(typeId) > -1;
    });
    return actiontypes.filter(
      (type) => validActiontypeIds && validActiontypeIds.indexOf(type.get('id')) > -1
    );
  }
);
export const selectActiontypesForResourcetype = createSelector(
  (state, { type }) => type,
  selectActiontypes,
  (typeId, actiontypes) => {
    if (!actiontypes) return null;
    const validActiontypeIds = Object.keys(ACTIONTYPE_RESOURCETYPES).filter((actiontypeId) => {
      const actortypeIds = ACTIONTYPE_RESOURCETYPES[actiontypeId];
      return actortypeIds && actortypeIds.indexOf(typeId) > -1;
    });
    return actiontypes.filter(
      (type) => validActiontypeIds && validActiontypeIds.indexOf(type.get('id')) > -1
    );
  }
);
export const selectTargettypesForActiontype = createSelector(
  (state, { type }) => type,
  selectActortypes,
  (typeId, actortypes) => {
    if (!actortypes) return null;
    const validActortypeIds = ACTIONTYPE_TARGETTYPES[typeId];
    return actortypes.filter(
      (type) => validActortypeIds && validActortypeIds.indexOf(type.get('id')) > -1
    );
  }
);
export const selectMembertypesForActortype = createSelector(
  (state, { type }) => type,
  selectActortypes,
  (typeId, actortypes) => {
    const actortype = actortypes && actortypes.get(typeId);
    if (!actortype || !actortype.getIn(['attributes', 'has_members'])) {
      return null;
    }
    return actortypes.filter(
      (type) => !type.getIn(['attributes', 'has_members'])
    );
  }
);
export const selectAssociationtypesForActortype = createSelector(
  (state, { type }) => type,
  selectActortypes,
  (typeId, actortypes) => {
    const actortype = actortypes && actortypes.get(typeId);
    if (!actortype || actortype.getIn(['attributes', 'has_members'])) {
      return null;
    }
    return actortypes.filter(
      (type) => type.getIn(['attributes', 'has_members'])
    );
  }
);

export const selectActiontypesForTargettype = createSelector(
  (state, { type }) => type,
  selectActiontypes,
  (typeId, actiontypes) => {
    if (!actiontypes) return null;
    const validActiontypeIds = Object.keys(ACTIONTYPE_TARGETTYPES).filter((actiontypeId) => {
      const actortypeIds = ACTIONTYPE_TARGETTYPES[actiontypeId];
      return actortypeIds && actortypeIds.indexOf(typeId) > -1;
    });
    return actiontypes.filter(
      (type) => validActiontypeIds && validActiontypeIds.indexOf(type.get('id')) > -1
    );
  }
);
// single action type
export const selectActiontype = createSelector(
  (state) => selectEntities(state, API.ACTIONTYPES),
  (state, id) => id,
  (entities, id) => entities && entities.get(id.toString())
);
// single actor type
export const selectActortype = createSelector(
  (state) => selectEntities(state, API.ACTORTYPES),
  (state, id) => id, // type id
  (entities, id) => entities && entities.get(id.toString())
);
// single resource type
export const selectResourcetype = createSelector(
  (state) => selectEntities(state, API.RESOURCETYPES),
  (state, id) => id, // type id
  (entities, id) => entities && entities.get(id.toString())
);

// TODO check: likely not needed
// export const selectActiveActortypes = createSelector(
//   selectActortypes,
//   selectActortypeQuery,
//   (entities, typeQuery) => {
//     if (
//       entities
//       && entities.size > 1
//       && typeQuery
//       && typeQuery !== 'all'
//     ) {
//       return entities.filter((type) => qe(typeQuery, type.get('id')));
//     }
//     return entities;
//   }
// );
// // TODO check: likely not needed
// export const selectActiveActiontypes = createSelector(
//   selectActiontypes,
//   selectActiontypeQuery,
//   (entities, typeQuery) => {
//     if (
//       entities
//       && entities.size > 1
//       && typeQuery
//       && typeQuery !== 'all'
//     ) {
//       return entities.filter((type) => qe(typeQuery, type.get('id')));
//     }
//     return entities;
//   }
// );
// all actors for a given type id
export const selectActortypeActors = createSelector(
  selectActors,
  (state, args) => args ? args.type : null,
  (entities, type) => {
    if (entities && type) {
      return entities.filter(
        (actor) => qe(
          type,
          actor.getIn(['attributes', 'actortype_id']),
        )
      );
    }
    return entities;
  }
);
export const selectResourcetypeResources = createSelector(
  selectResources,
  (state, args) => args ? args.type : null,
  (entities, type) => {
    if (entities && type) {
      return entities.filter(
        (actor) => qe(
          type,
          actor.getIn(['attributes', 'resourcetype_id']),
        )
      );
    }
    return entities;
  }
);
// all actions for a given type id
export const selectActiontypeActions = createSelector(
  selectActions,
  (state, args) => args ? args.type : null,
  (entities, type) => {
    if (entities && type) {
      return entities.filter(
        (actor) => qe(
          type,
          actor.getIn(['attributes', 'measuretype_id']),
        )
      );
    }
    return entities;
  }
);

// TODO check: likely not needed
// returns actions not associated or associated with current actortype
// export const selectActortypeActions = createSelector(
//   (state) => selectEntities(state, API.ACTIONS),
//   (entities) => entities
// );
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
//                 rm.getIn(['attributes', 'measure_id']),
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
// );F

// TODO check: likely not needed
export const selectActortypeEntitiesAll = createSelector(
  selectEntitiesAll,
  selectActors,
  selectActions,
  (entities, actors, actions) => entities
    .set('actors', actors)
    .set('actions', actions)
);
// TODO check: likely not needed
export const selectActiontypeEntitiesAll = createSelector(
  selectEntitiesAll,
  selectActors,
  selectActions,
  (entities, actors, actions) => entities
    .set('actors', actors)
    .set('actions', actions)
);

// filtered entities ///////////////////////////////////////////////////////////

// filter entities by attributes, using object
export const selectEntitiesWhere = createSelector(
  (state, { where }) => where,
  (state, { path }) => selectEntities(state, path),
  (query, entities) => query
    ? filterEntitiesByAttributes(entities, query)
    : entities
);

// filter entities by attributes, using locationQuery
export const selectEntitiesWhereQuery = createSelector(
  selectAttributeQuery,
  (state, { path }) => selectEntities(state, path),
  (query, entities) => query
    ? filterEntitiesByAttributes(entities, query)
    : entities
);

// filter entities by attributes, using object
export const selectActorsWhere = createSelector(
  (state, { where }) => where,
  selectActortypeActors, // type should be optional
  (query, entities) => query
    ? filterEntitiesByAttributes(entities, query)
    : entities
);

// filter entities by attributes, using locationQuery
export const selectActorsWhereQuery = createSelector(
  selectAttributeQuery,
  selectActortypeActors, // type should be optional
  (query, entities) => query
    ? filterEntitiesByAttributes(entities, query)
    : entities
);
// filter entities by attributes, using locationQuery
export const selectResourcesWhereQuery = createSelector(
  selectAttributeQuery,
  selectResourcetypeResources, // type should be optional
  (query, entities) => query
    ? filterEntitiesByAttributes(entities, query)
    : entities
);

// TODO: passing of location query likely not needed if selectSearchQuery changed
export const selectActorsSearchQuery = createSelector(
  selectActorsWhereQuery,
  selectSearchQuery,
  (state, { searchAttributes }) => searchAttributes,
  (entities, query, searchAttributes) => query
    ? filterEntitiesByKeywords(entities, query, searchAttributes)
    : entities // !search
);
export const selectResourcesSearchQuery = createSelector(
  selectResourcesWhereQuery,
  selectSearchQuery,
  (state, { searchAttributes }) => searchAttributes,
  (entities, query, searchAttributes) => query
    ? filterEntitiesByKeywords(entities, query, searchAttributes)
    : entities // !search
);

// filter entities by attributes, using object
export const selectActionsWhere = createSelector(
  (state, { where }) => where,
  selectActiontypeActions, // type should be optional
  (query, entities) => query
    ? filterEntitiesByAttributes(entities, query)
    : entities
);

// filter entities by attributes, using locationQuery
export const selectActionsWhereQuery = createSelector(
  selectAttributeQuery,
  selectActiontypeActions, // type should be optional
  (query, entities) => query
    ? filterEntitiesByAttributes(entities, query)
    : entities
);
export const selectActionsSearchQuery = createSelector(
  selectActionsWhereQuery,
  selectSearchQuery,
  (state, { searchAttributes }) => searchAttributes,
  (entities, query, searchAttributes) => query
    ? filterEntitiesByKeywords(entities, query, searchAttributes)
    : entities // !search
);

// taxonomies and categories ///////////////////////////////////////////////////

// select all categories
export const selectCategories = createSelector(
  (state) => selectEntities(state, API.CATEGORIES),
  (entities) => entities
);
// select all taxonomies
export const selectTaxonomies = createSelector(
  (state) => selectEntities(state, API.TAXONOMIES),
  (state) => selectEntities(state, API.ACTORTYPE_TAXONOMIES),
  (state) => selectEntities(state, API.ACTIONTYPE_TAXONOMIES),
  (entities, actortypeTaxonomies, actiontypeTaxonomies) => {
    if (entities) {
      // set and check for applicable types
      return (!actortypeTaxonomies && !actiontypeTaxonomies)
        ? entities
        : entities.map((tax) => {
          const actortypeIds = actortypeTaxonomies && actortypeTaxonomies
            .filter((type) => qe(
              type.getIn(['attributes', 'taxonomy_id']),
              tax.get('id'),
            ))
            .map((type) => type.getIn(['attributes', 'actortype_id']));
          const actiontypeIds = actiontypeTaxonomies && actiontypeTaxonomies
            .filter((type) => qe(
              type.getIn(['attributes', 'taxonomy_id']),
              tax.get('id'),
            ))
            .map((type) => type.getIn(['attributes', 'measuretype_id']));

          return tax
            .setIn(['attributes', 'tags_actors'], actortypeIds && actortypeIds.size > 0)
            .setIn(['attributes', 'tags_actions'], actiontypeIds && actiontypeIds.size > 0)
            .set('actortypeIds', actortypeIds.toList())
            .set('actiontypeIds', actiontypeIds.toList());
        });
    }
    return null;
  }
);

// select all taxonomies sorted by priority
export const selectTaxonomiesSorted = createSelector(
  selectTaxonomies,
  (entities) => entities
    && sortEntities(entities, 'asc', 'id', null, false)
);

// select all taxonomies with respective categories
export const selectTaxonomiesWithCategories = createSelector(
  selectTaxonomiesSorted,
  selectCategories,
  (taxonomies, categories) => taxonomies.map((tax) => tax.set(
    'categories',
    categories.filter(
      (cat) => qe(
        cat.getIn(['attributes', 'taxonomy_id']),
        tax.get('id')
      )
    )
  ))
);


// get all actor taxonomies for a given type

// select single taxonomy
export const selectTaxonomy = createSelector(
  (state, id) => id,
  selectTaxonomies,
  (id, entities) => id && entities.get(id.toString())
);
// select single taxonomy
export const selectCategory = createSelector(
  (state, id) => id,
  selectCategories,
  (id, entities) => id && entities.get(id.toString())
);

// get all taxonomies applicable to actors (of any type)
export const selectActorTaxonomies = createSelector(
  selectTaxonomiesSorted,
  (state) => selectEntities(state, API.ACTORTYPE_TAXONOMIES),
  (taxonomies, actortypeTaxonomies) => taxonomies
    && actortypeTaxonomies
    && taxonomies.filter(
      // connected to current actortype
      (tax) => actortypeTaxonomies.some(
        (type) => qe(
          type.getIn(['attributes', 'taxonomy_id']),
          tax.get('id'),
        )
      )
    ).map(
      // TODO check if really needed
      (tax) => {
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
        return tax.set('actortypeIds', actortypeIds);
      }
    )
);

// get all taxonomies applicable to actions
export const selectActionTaxonomies = createSelector(
  selectTaxonomiesSorted,
  (state) => selectEntities(state, API.ACTIONTYPE_TAXONOMIES),
  (taxonomies, actiontypeTaxonomies) => taxonomies
    && actiontypeTaxonomies
    && taxonomies.filter(
      // connected to any actortype
      (tax) => actiontypeTaxonomies.some(
        (type) => qe(
          type.getIn(['attributes', 'taxonomy_id']),
          tax.get('id'),
        )
      )
    // ).map(
    //   (tax) => {
    //     // connectedActortypes
    //     const actiontypeIds = actiontypeTaxonomies.reduce(
    //       (memo, type) => {
    //         if (
    //           qe(
    //             type.getIn(['attributes', 'taxonomy_id']),
    //             tax.get('id')
    //           )
    //         ) {
    //           return memo.push(type.getIn(['attributes', 'actortype_id']));
    //         }
    //         return memo;
    //       },
    //       List(),
    //     );
    //     return tax.set('actiontypeIds', actiontypeIds);
    //   }
    )
);

// get all taxonomies applicable to actor type
export const selectActortypeTaxonomies = createSelector(
  (state, args) => args ? args.type : null,
  selectTaxonomiesSorted,
  (state) => selectEntities(state, API.ACTORTYPE_TAXONOMIES),
  (typeId, taxonomies, actortypeTaxonomies) => typeId
    && taxonomies
    && actortypeTaxonomies
    && taxonomies.filter(
      // connected to current actortype
      (tax) => actortypeTaxonomies.some(
        (type) => qe(
          type.getIn(['attributes', 'taxonomy_id']),
          tax.get('id'),
        ) && qe(
          type.getIn(['attributes', 'actortype_id']),
          typeId,
        )
      )
    ).map(
      // TODO check if needed
      (tax) => {
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
        return tax.set('actortypeIds', actortypeIds);
      }
    )
);

// get all taxonomies applicable to actor type with categories
export const selectActortypeTaxonomiesWithCats = createSelector(
  (state, args) => args ? args.includeParents : true,
  selectActortypeTaxonomies,
  selectCategories,
  (includeParents, taxonomies, categories) => prepareTaxonomies(
    taxonomies,
    categories,
    includeParents,
  )
);

// // get all taxonomies applicable to action type
export const selectActiontypeTaxonomies = createSelector(
  (state, args) => args ? args.type : null,
  selectTaxonomiesSorted,
  (state) => selectEntities(state, API.ACTIONTYPE_TAXONOMIES),
  (typeId, taxonomies, actiontypeTaxonomies) => typeId
    && taxonomies
    && actiontypeTaxonomies
    && taxonomies.filter(
      // connected to current actortype
      (tax) => actiontypeTaxonomies.some(
        (type) => qe(
          type.getIn(['attributes', 'taxonomy_id']),
          tax.get('id'),
        ) && qe(
          type.getIn(['attributes', 'measuretype_id']),
          typeId,
        )
      )
    // ).map(
    //   (tax) => {
    //     // set all actiontypes valid for taxonomy
    //     const actiontypeIds = actiontypeTaxonomies.reduce(
    //       (memo, type) => {
    //         if (
    //           qe(
    //             type.getIn(['attributes', 'taxonomy_id']),
    //             tax.get('id')
    //           )
    //         ) {
    //           return memo.push(type.getIn(['attributes', 'measuretype_id']));
    //         }
    //         return memo;
    //       },
    //       List(),
    //     );
    //     return tax.set('actiontypeIds', actiontypeIds);
    //   }
    )
);

// get all taxonomies applicable to action type with categories
export const selectActiontypeTaxonomiesWithCats = createSelector(
  (state, args) => args ? args.includeParents : true,
  selectActiontypeTaxonomies,
  selectCategories,
  (includeParents, taxonomies, categories) => prepareTaxonomies(
    taxonomies,
    categories,
    includeParents,
  )
);

// get all taxonomies with nested categories
export const selectAllTaxonomiesWithCategories = createSelector(
  selectTaxonomiesSorted,
  selectCategories,
  (taxonomies, categories) => taxonomies && taxonomies.map(
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
  selectTaxonomiesSorted,
  selectCategories,
  (taxonomies, categories) => prepareTaxonomiesTags(
    taxonomies,
    categories,
    'tags_users',
  )
);

// entity joins ///////////////////////////////////////////////////////

export const selectActorActionsForAction = createSelector(
  (state) => selectEntities(state, API.ACTOR_ACTIONS),
  (state, id) => id,
  (connections, id) => connections && connections
    .filter((connection) => qe(connection.getIn(['attributes', 'measure_id']), id))
    .map((connection) => connection.get('attributes'))
);

// potential connections ///////////////////////////////////////////////////////

export const selectUserConnections = createSelector(
  (state) => selectEntities(state, API.ROLES),
  (roles) => Map().set('roles', roles)
);

export const selectActorConnections = createSelector(
  selectActions,
  selectActors,
  (actions, actors) => Map()
    .set(API.ACTIONS, actions)
    .set(API.ACTORS, actors)
);
export const selectResourceConnections = createSelector(
  selectActiontypeActions,
  (actions) => Map()
    .set(API.ACTIONS, actions)
);

export const selectActionConnections = createSelector(
  selectActors,
  selectActions,
  selectResources,
  (actors, actions, resources) => Map()
    .set(API.ACTORS, actors)
    .set(API.ACTIONS, actions)
    .set(API.RESOURCES, resources)
);

// grouped JOIN tables /////////////////////////////////////////////////////////////////

export const selectActorCategoriesGroupedByActor = createSelector(
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
export const selectActorCategoriesGroupedByCategory = createSelector(
  (state) => selectEntities(state, API.ACTOR_CATEGORIES),
  (entities) => entities
    && entities.groupBy(
      (entity) => entity.getIn(['attributes', 'category_id'])
    ).map(
      (group) => group.map(
        (entity) => entity.getIn(['attributes', 'actor_id'])
      )
    )
);

export const selectActorActions = createSelector(
  (state) => selectEntities(state, API.ACTOR_ACTIONS),
  (entities) => entities,
);
export const selectActorActionsGroupedByActor = createSelector(
  (state) => selectEntities(state, API.ACTOR_ACTIONS),
  (entities) => entities
    && entities.groupBy(
      (entity) => entity.getIn(['attributes', 'actor_id'])
    ).map(
      (group) => group.map(
        (entity) => entity.getIn(['attributes', 'measure_id'])
      )
    ),
);
export const selectActorActionsGroupedByAction = createSelector(
  (state) => selectEntities(state, API.ACTOR_ACTIONS),
  (entities) => entities
    && entities.groupBy(
      (entity) => entity.getIn(['attributes', 'measure_id'])
    ).map(
      (group) => group.map(
        (entity) => entity.getIn(['attributes', 'actor_id'])
      )
    ),
);
export const selectActorActionsGroupedByActionAttributes = createSelector(
  (state) => selectEntities(state, API.ACTOR_ACTIONS),
  (entities) => entities
    && entities.groupBy(
      (entity) => entity.getIn(['attributes', 'measure_id'])
    ).map(
      (group) => group.map((entity) => entity.get('attributes'))
    ),
);
export const selectActionActorsGroupedByActionAttributes = createSelector(
  (state) => selectEntities(state, API.ACTIONS_ACTORS),
  (entities) => entities
    && entities.groupBy(
      (entity) => entity.getIn(['attributes', 'measure_id'])
    ).map(
      (group) => group.map((entity) => entity.get('attributes'))
    ),
);
export const selectActorActionsGroupedByActorAttributes = createSelector(
  (state) => selectEntities(state, API.ACTOR_ACTIONS),
  (entities) => entities
    && entities.groupBy(
      (entity) => entity.getIn(['attributes', 'actor_id'])
    ).map(
      (group) => group.map((entity) => entity.get('attributes'))
    ),
);

export const selectActionActorsGroupedByActor = createSelector(
  (state) => selectEntities(state, API.ACTION_ACTORS),
  (entities) => entities
    && entities.groupBy(
      (entity) => entity.getIn(['attributes', 'actor_id'])
    ).map(
      (group) => group.map(
        (entity) => entity.getIn(['attributes', 'measure_id'])
      )
    ),
);
export const selectActionResourcesGroupedByResource = createSelector(
  (state) => selectEntities(state, API.ACTION_RESOURCES),
  (entities) => entities
    && entities.groupBy(
      (entity) => entity.getIn(['attributes', 'resource_id'])
    ).map(
      (group) => group.map(
        (entity) => entity.getIn(['attributes', 'measure_id'])
      )
    ),
);
export const selectActionResourcesGroupedByAction = createSelector(
  (state) => selectEntities(state, API.ACTION_RESOURCES),
  (entities) => entities
    && entities.groupBy(
      (entity) => entity.getIn(['attributes', 'measure_id'])
    ).map(
      (group) => group.map(
        (entity) => entity.getIn(['attributes', 'resource_id'])
      )
    ),
);
export const selectActionActorsGroupedByAction = createSelector(
  (state) => selectEntities(state, API.ACTION_ACTORS),
  (connections) => connections
    && connections.groupBy(
      (connection) => connection.getIn(['attributes', 'measure_id'])
    ).map(
      (group) => group.map(
        (connection) => connection.getIn(['attributes', 'actor_id'])
      )
    ),
);
export const selectMembershipsGroupedByMember = createSelector(
  (state) => selectEntities(state, API.MEMBERSHIPS),
  (entities) => entities
    && entities.groupBy(
      (entity) => entity.getIn(['attributes', 'member_id'])
    ).map(
      (group) => group.map(
        (entity) => entity.getIn(['attributes', 'memberof_id'])
      )
    ),
);

export const selectMembershipsGroupedByAssociation = createSelector(
  (state) => selectEntities(state, API.MEMBERSHIPS),
  (entities) => entities
    && entities.groupBy(
      (entity) => entity.getIn(['attributes', 'memberof_id'])
    ).map(
      (group) => group.map(
        (entity) => entity.getIn(['attributes', 'member_id'])
      )
    ),
);

export const selectActorActionsMembersGroupedByAction = createSelector(
  selectActorActionsGroupedByAction,
  selectMembershipsGroupedByAssociation,
  (entities, memberships) => entities && memberships && entities.map(
    (actors) => actors.reduce((memo, actorId) => {
      if (memberships.get(actorId)) {
        return memo.concat(memberships.get(actorId));
      }
      return memo;
    }, Map())
  )
);
export const selectActorActionsAssociationsGroupedByAction = createSelector(
  selectActorActionsGroupedByAction,
  selectMembershipsGroupedByMember,
  (entities, memberships) => entities && memberships && entities.map(
    (actors) => actors.reduce((memo, actorId) => {
      if (memberships.get(actorId)) {
        return memo.concat(memberships.get(actorId));
      }
      return memo;
    }, Map())
  )
);
export const selectActionActorsMembersGroupedByAction = createSelector(
  selectActionActorsGroupedByAction,
  selectMembershipsGroupedByAssociation,
  (actionActorsByAction, memberships) => actionActorsByAction && memberships && actionActorsByAction.map(
    (actionActors) => actionActors.reduce((memo, actorId) => {
      if (memberships.get(actorId)) {
        return memo.concat(memberships.get(actorId));
      }
      return memo;
    }, Map())
  )
);
export const selectActionActorsAssociationsGroupedByAction = createSelector(
  selectActionActorsGroupedByAction,
  selectMembershipsGroupedByMember,
  (actionActorsByAction, memberships) => actionActorsByAction && memberships && actionActorsByAction.map(
    (actionActors) => actionActors.reduce((memo, actorId) => {
      if (memberships.get(actorId)) {
        return memo.concat(memberships.get(actorId));
      }
      return memo;
    }, Map())
  )
);

export const selectActionCategoriesGroupedByAction = createSelector(
  (state) => selectEntities(state, API.ACTION_CATEGORIES),
  (entities) => entities
    && entities.groupBy(
      (entity) => entity.getIn(['attributes', 'measure_id'])
    ).map(
      (group) => group.map(
        (entity) => entity.getIn(['attributes', 'category_id'])
      )
    ),
);
export const selectActionCategoriesGroupedByCategory = createSelector(
  (state) => selectEntities(state, API.ACTION_CATEGORIES),
  (entities) => entities
    && entities.groupBy(
      (entity) => entity.getIn(['attributes', 'category_id'])
    ).map(
      (group) => group.map(
        (entity) => entity.getIn(['attributes', 'measure_id'])
      )
    ),
);
export const selectUserCategoriesGroupedByUser = createSelector(
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

// TABLES with nested ids /////////////////////////////////////////////////////////////
// get actors with category ids
export const selectActorsCategorised = createSelector(
  selectActortypeActors,
  selectActorCategoriesGroupedByActor,
  (entities, associationsGrouped) => entitiesSetCategoryIds(
    entities,
    associationsGrouped,
  )
);
// get actions with category ids
export const selectActionsCategorised = createSelector(
  selectActiontypeActions,
  selectActionCategoriesGroupedByAction,
  (entities, associationsGrouped) => entitiesSetCategoryIds(
    entities,
    associationsGrouped,
  )
);

// TODO: check, likely obsolete
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

export const selectCountriesWithIndicators = createSelector(
  (state) => selectActortypeActors(state, { type: ACTORTYPES.COUNTRY }),
  (state) => selectActiontypeActions(state, { type: FF_ACTIONTYPE }),
  selectActorActionsGroupedByActorAttributes,
  (countries, actions, actorConnections) => countries
    && actions
    && actorConnections
    && countries.map(
      (country) => {
        let actorActionValues = actorConnections.get(parseInt(country.get('id'), 10)) || null;
        if (actorActionValues) {
          actorActionValues = actorActionValues
            .filter(
              // make sure we have a connection to an ff-indicator
              (connection) => !!actions.get(connection.get('measure_id').toString())
            ).reduce(
              (memo, connection) => memo.set(
                connection.get('measure_id').toString(),
                connection.get('value'),
              ),
              Map()
            );
        }
        return country.set('actionValues', actorActionValues);
      }
    )
);

export const selectLocationsWithIndicators = createSelector(
  (state) => selectActortypeActors(state, { type: ACTORTYPES.POINT }),
  (state) => selectActiontypeActions(state, { type: FF_ACTIONTYPE }),
  selectActorActionsGroupedByActorAttributes,
  (actors, actions, actorConnections) => actors
    && actions
    && actorConnections
    && actors.map(
      (actor) => {
        let actorActionValues = actorConnections.get(parseInt(actor.get('id'), 10)) || null;
        if (actorActionValues) {
          actorActionValues = actorActionValues
            .filter(
              // make sure we have a connection to an ff-indicator
              (connection) => !!actions.get(connection.get('measure_id').toString())
            ).reduce(
              (memo, connection) => memo.set(
                connection.get('measure_id').toString(),
                connection.get('value'),
              ),
              Map()
            );
        }
        return actor.set('actionValues', actorActionValues);
      }
    )
);
