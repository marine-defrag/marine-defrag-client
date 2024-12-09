/*
 * AppConstants
 * Each action has a corresponding type, which the reducer knows and picks up on.
 * To avoid weird typos between the reducer and the actions, we save them as
 * constants here. We prefix them with 'yourproject/YourComponent' so we avoid
 * reducers accidentally picking up actions they shouldn't.
 *
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = 'yourproject/YourContainer/YOUR_ACTION_CONSTANT';
 */
// import { API } from 'themes/config';

export const REDIRECT_IF_NOT_PERMITTED = 'impactoss/App/REDIRECT_IF_NOT_PERMITTED';
export const LOAD_ENTITIES_IF_NEEDED = 'impactoss/App/LOAD_ENTITIES_IF_NEEDED';
export const LOADING_ENTITIES = 'impactoss/App/LOADING_ENTITIES';
export const LOAD_ENTITIES_SUCCESS = 'impactoss/App/LOAD_ENTITIES_SUCCESS';
export const LOAD_ENTITIES_ERROR = 'impactoss/App/LOAD_ENTITIES_ERROR';
export const ENTITIES_REQUESTED = 'impactoss/App/ENTITIES_REQUESTED';
export const INVALIDATE_ENTITIES = 'impactoss/App/INVALIDATE_ENTITIES';
export const RESET_PROGRESS = 'impactoss/App/RESET_PROGRESS';

export const AUTHENTICATE_SENDING = 'impactoss/App/AUTHENTICATE_SENDING';
export const AUTHENTICATE = 'impactoss/App/AUTHENTICATE';
export const AUTHENTICATE_SUCCESS = 'impactoss/App/AUTHENTICATE_SUCCESS';
export const AUTHENTICATE_ERROR = 'impactoss/App/AUTHENTICATE_ERROR';
export const SET_AUTHENTICATION_STATE = 'impactoss/App/SET_AUTHENTICATION_STATE';
export const OPEN_BOOKMARK = 'impactoss/App/OPEN_BOOKMARK';
export const LOGOUT = 'impactoss/App/LOGOUT';
export const LOGOUT_SUCCESS = 'impactoss/App/LOGOUT_SUCCESS';
export const LOGOUT_ERROR = 'impactoss/App/LOGOUT_ERROR';
export const VALIDATE_TOKEN = 'impactoss/App/VALIDATE_TOKEN';
export const AUTHENTICATE_FORWARD = 'impactoss/App/AUTHENTICATE_FORWARD';

export const ADD_ENTITY = 'impactoss/App/ADD_ENTITY';
export const UPDATE_ENTITY = 'impactoss/App/UPDATE_ENTITY';
export const REMOVE_ENTITY = 'impactoss/App/REMOVE_ENTITY';
export const UPDATE_ENTITIES = 'impactoss/App/UPDATE_ENTITIES';
export const UPDATE_CONNECTIONS = 'impactoss/App/UPDATE_CONNECTIONS';

export const SAVE_ENTITY = 'impactoss/App/SAVE_ENTITY';
export const SAVE_MULTIPLE_ENTITIES = 'impactoss/App/SAVE_MULTIPLE_ENTITIES';
export const NEW_ENTITY = 'impactoss/App/NEW_ENTITY';
export const NEW_MULTIPLE_ENTITIES = 'impactoss/App/NEW_MULTIPLE_ENTITIES';
export const DELETE_ENTITY = 'impactoss/App/DELETE_ENTITY';
export const DELETE_MULTIPLE_ENTITIES = 'impactoss/App/DELETE_MULTIPLE_ENTITIES';
export const SAVE_CONNECTIONS = 'impactoss/App/SAVE_CONNECTIONS';

export const ENTITIES_READY = 'impactoss/App/ENTITIES_READY';

export const SAVE_SENDING = 'impactoss/App/SAVE_SENDING';
export const SAVE_SUCCESS = 'impactoss/App/SAVE_SUCCESS';
export const SAVE_ERROR = 'impactoss/App/SAVE_ERROR';
export const SAVE_ERROR_DISMISS = 'impactoss/App/SAVE_ERROR_DISMISS';

export const DELETE_SENDING = 'impactoss/App/DELETE_SENDING';
export const DELETE_SUCCESS = 'impactoss/App/DELETE_SUCCESS';
export const DELETE_ERROR = 'impactoss/App/DELETE_ERROR';

export const UPDATE_ROUTE_QUERY = 'impactoss/App/UPDATE_ROUTE_QUERY';
export const UPDATE_PATH = 'impactoss/App/UPDATE_PATH';

export const SAVE_ENTITY_FORM = 'impactoss/App/SAVE_ENTITY_FORM';
export const UPDATE_ENTITY_FORM = 'impactoss/App/UPDATE_ENTITY_FORM';
export const RESET_ENTITY_FORM = 'impactoss/App/RESET_ENTITY_FORM';

export const CLOSE_ENTITY = 'impactoss/App/CLOSE_ENTITY';

export const OPEN_NEW_ENTITY_MODAL = 'impactoss/App/OPEN_NEW_ENTITY_MODAL';
export const SUBMIT_INVALID = 'impactoss/App/SUBMIT_INVALID';

export const DISMISS_QUERY_MESSAGES = 'impactoss/App/DISMISS_QUERY_MESSAGES';
export const SET_ACTIONTYPE = 'impactoss/App/SET_ACTIONTYPE';
export const SET_ACTORTYPE = 'impactoss/App/SET_ACTORTYPE';
export const SET_VIEW = 'impactoss/App/SET_VIEW';
export const SET_SUBJECT = 'impactoss/App/SET_SUBJECT';
export const SET_MAP_SUBJECT = 'impactoss/App/SET_MAP_SUBJECT';
export const SET_INCLUDE_ACTOR_MEMBERS = 'impactoss/App/SET_INCLUDE_ACTOR_MEMBERS';
export const SET_INCLUDE_TARGET_MEMBERS = 'impactoss/App/SET_INCLUDE_TARGET_MEMBERS';
export const SET_INCLUDE_MEMBERS_FORFILTERS = 'impactoss/App/SET_INCLUDE_MEMBERS_FORFILTERS';
export const SET_INCLUDE_TARGET_CHILDREN = 'impactoss/App/SET_INCLUDE_TARGET_CHILDREN';
export const SET_INCLUDE_ACTOR_CHILDREN = 'impactoss/App/SET_INCLUDE_ACTOR_CHILDREN';
export const SET_FF_OVERLAY = 'impactoss/App/SET_FF_OVERLAY';
export const PRINT_VIEW = 'impactoss/App/PRINT_VIEW';
export const CLOSE_PRINT_VIEW = 'impactoss/App/CLOSE_PRINT_VIEW';
export const SET_MAP_LOADING = 'impactoss/App/SET_MAP_LOADING';
export const SET_MAP_LOADED = 'impactoss/App/SET_MAP_LOADED';
export const SET_MAP_TOOLTIPS = 'impactoss/App/SET_MAP_TOOLTIPS';
export const SET_MAP_VIEW = 'impactoss/App/SET_MAP_VIEW';
export const SET_SHOW_FF_AS_CIRCLES = 'impactoss/App/SET_SHOW_FF_AS_CIRCLES';
export const SET_TIMELINE_HIGHLIGHT_CATEGORY = 'impactoss/App/SET_TIMELINE_HIGHLIGHT_CATEGORY';

export const FILTERS_PANEL = 'filters';
export const EDIT_PANEL = 'edit';

export const CONTENT_LIST = 'list';
export const CONTENT_SINGLE = 'single';
export const CONTENT_PAGE = 'page';
export const CONTENT_MODAL = 'modal';

// export const DEPENDENCIES = [
//   // API.USERS,
//   // API.USER_ROLES,
//   API.PAGES,
//   // API.BOOKMARKS,
// ];

export const SORT_ORDER_OPTIONS = [
  {
    value: 'asc',
    icon: 'ascending',
    nextValue: 'desc',
    message: 'ui.sortOrderOptions.asc',
  },
  {
    value: 'desc',
    icon: 'descending',
    nextValue: 'asc',
    message: 'ui.sortOrderOptions.desc',
  },
];
export const PARAMS = {
  GROUP_RESET: '0',
  REDIRECT_ON_AUTH_SUCCESS: 'redirectOnAuthSuccess',
  RECOVER_SUCCESS: 'recoverSuccess',
  ALREADY_SIGNED_IN: 'alreadySignedIn',
  NOT_SIGNED_IN: 'notSignedIn',
};

export const VIEWPORTS = {
  MOBILE: 1,
  SMALL: 2,
  MEDIUM: 3,
  LARGE: 4,
};

export const PRINT_TYPES = {
  LIST: 1,
  SINGLE: 2,
  FF: 3,
};
