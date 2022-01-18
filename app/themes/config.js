/*
 * Global config
 *
 * Theme and icons:
 * - theme file is set in app.js "import theme from 'themes/[theme-file]';"
 * - icon file is set in components/Icon/index.js "import icons from 'themes/[icons-file]';"
 *
 * Images: images are stored in 'themes/media' folder
 *
 */

// client app routes **************************
export const ROUTES = {
  ID: '/:id',
  VIEW: '/:view', //  e.g. list or map or stats
  NEW: '/new',
  EDIT: '/edit',
  IMPORT: '/import',
  OVERVIEW: '/overview',
  BOOKMARKS: '/bookmarks',
  PASSWORD: '/password', // change password
  LOGIN: '/login',
  LOGOUT: '/logout',
  REGISTER: '/register',
  UNAUTHORISED: '/unauthorised',
  USERS: '/users',
  ACTIONS: '/actions',
  ACTION: '/action',
  ACTORS: '/actors',
  ACTOR: '/actor',
  RESOURCES: '/resources',
  RESOURCE: '/resource',
  TAXONOMIES: '/categories',
  CATEGORY: '/category',
  PAGES: '/pages',
  SEARCH: '/search',
};

// Server endpoints for database tables **************************
// should match https://github.com/dumparkltd/marine-defrag-server/blob/master/config/routes.rb
export const API = {
  ACTORS: 'actors',
  ACTIONS: 'measures', // actions/ACTIONS
  ACTORTYPES: 'actortypes', // action types
  ACTIONTYPES: 'measuretypes', // action types
  ACTOR_ACTIONS: 'actor_measures', // linking actors with their actions
  ACTION_ACTORS: 'measure_actors', // linking actions with their targets
  ACTOR_CATEGORIES: 'actor_categories',
  ACTION_CATEGORIES: 'measure_categories', // measure_categories
  ACTORTYPE_TAXONOMIES: 'actortype_taxonomies', // action taxonomies
  ACTIONTYPE_TAXONOMIES: 'measuretype_taxonomies', // action taxonomies
  MEMBERSHIPS: 'memberships', // quasi: actor_actors
  RESOURCES: 'resources',
  ACTION_RESOURCES: 'measure_resources',
  RESOURCETYPES: 'resourcetypes', // resource types
  TAXONOMIES: 'taxonomies',
  CATEGORIES: 'categories',
  USERS: 'users',
  USER_ROLES: 'user_roles',
  // USER_CATEGORIES: 'user_categories',
  ROLES: 'roles',
  PAGES: 'pages',
  BOOKMARKS: 'bookmarks',
};

export const ACTIONTYPES = {
  INTL: '1',
  REGLSEAS: '2',
  REGL: '3',
  NATL: '4',
  DONOR: '5',
  INIT: '6',
};
export const ACTORTYPES = {
  COUNTRY: '1',
  ORG: '2',
  CLASS: '3',
  REG: '4',
  GROUP: '5',
};
export const RESOURCETYPES = {
  REF: '1',
  WEB: '2',
  DOC: '3',
  AP: '4',
  MLAP: '5',
};

export const ACTIONTYPE_GROUPS = {
  // donor activities
  1: {
    types: [ACTIONTYPES.DONOR], // donor activities
    primary: true,
  },
  // policies etc
  2: {
    types: [
      ACTIONTYPES.NATL, // national strategies
      ACTIONTYPES.REGL, // regional strategies
      ACTIONTYPES.REGLSEAS, // regional seas conventions
      ACTIONTYPES.INTL, // international frameworks
    ],
  },
  // initiatives
  3: {
    types: [ACTIONTYPES.INIT], // initiatives
  },
};
export const ACTORTYPE_GROUPS = {
  // countries
  1: {
    types: [ACTORTYPES.COUNTRY],
    primary: true,
  },
  // policies etc
  2: {
    types: [
      ACTORTYPES.ORG, // orgs
      ACTORTYPES.GROUP, // groups
      ACTORTYPES.REG, // regions
      ACTORTYPES.CLASS, // classes
    ],
  },
};
export const RESOURCETYPE_GROUPS = {
  // temp: one group only for now
  1: {
    types: [RESOURCETYPES.REF],
    primary: true,
  },
  2: {
    types: [
      RESOURCETYPES.WEB,
      RESOURCETYPES.DOC,
    ],
  },
  3: {
    types: [
      RESOURCETYPES.AP,
      RESOURCETYPES.MLAP,
    ],
  },
};

export const ACTION_FIELDS = {
  CONNECTIONS: {
    categories: {
      table: API.CATEGORIES,
      connection: API.ACTION_CATEGORIES,
      groupby: {
        table: API.TAXONOMIES,
        on: 'taxonomy_id',
      },
    },
    actors: {
      table: API.ACTORS,
      connection: API.ACTOR_ACTIONS,
      groupby: {
        table: API.ACTORTYPES,
        on: 'actortype_id',
      },
    },
    targets: {
      table: API.ACTORS,
      connection: API.ACTION_ACTORS,
      groupby: {
        table: API.ACTORTYPES,
        on: 'actortype_id',
      },
    },
  },
  ATTRIBUTES: {
    measuretype_id: {
      defaultValue: '1',
      required: Object.values(ACTIONTYPES), // all types
      type: 'number',
      table: API.ACTIONTYPES,
    },
    draft: {
      defaultValue: true,
      required: Object.values(ACTIONTYPES), // all types
      type: 'bool',
      // ui: 'dropdown',
      skipImport: true,
      // options: [
      //   { value: true, message: 'ui.publishStatuses.draft' },
      //   { value: false, message: 'ui.publishStatuses.public' },
      // ],
    },
    code: {
      optional: Object.values(ACTIONTYPES), // all types
      type: 'text',
    },
    title: {
      required: Object.values(ACTIONTYPES), // all types
      type: 'text',
    },
    parent_id: {
      skipImport: true,
      optional: Object.values(ACTIONTYPES), // controlled by type setting
      type: 'number',
    },
    description: {
      optional: [
        ACTIONTYPES.INTL,
        ACTIONTYPES.REGL,
        ACTIONTYPES.NATL,
        ACTIONTYPES.DONOR,
        ACTIONTYPES.INIT,
      ],
      type: 'markdown',
    },
    comment: {
      optional: [
        ACTIONTYPES.REGL,
        ACTIONTYPES.NATL,
        ACTIONTYPES.DONOR,
        ACTIONTYPES.INIT,
      ],
      type: 'markdown',
    },
    url: {
      optional: [
        ACTIONTYPES.INTL,
        ACTIONTYPES.REGL,
        ACTIONTYPES.NATL,
        ACTIONTYPES.REGLSEAS,
        ACTIONTYPES.DONOR,
        ACTIONTYPES.INIT,
      ],
      type: 'url',
    },
    date_start: {
      optional: [
        ACTIONTYPES.INTL,
        ACTIONTYPES.REGLSEAS,
        ACTIONTYPES.REGL,
        ACTIONTYPES.NATL,
        ACTIONTYPES.DONOR,
        ACTIONTYPES.INIT,
      ],
      type: 'date',
    },
    date_end: {
      optional: [
        ACTIONTYPES.INTL,
        ACTIONTYPES.REGLSEAS,
        ACTIONTYPES.REGL,
        ACTIONTYPES.NATL,
        ACTIONTYPES.DONOR,
        ACTIONTYPES.INIT,
      ],
      type: 'date',
    },
    date_comment: {
      optional: [
        ACTIONTYPES.INTL,
        ACTIONTYPES.REGL,
        ACTIONTYPES.REGLSEAS,
        ACTIONTYPES.NATL,
        ACTIONTYPES.DONOR,
        ACTIONTYPES.INIT,
      ],
      type: 'text',
    },
    target_comment: {
      optional: [
        ACTIONTYPES.REGLSEAS,
        ACTIONTYPES.DONOR,
        ACTIONTYPES.INIT,
      ],
      type: 'markdown',
    },
    status_comment: {
      optional: [
        ACTIONTYPES.INTL,
        ACTIONTYPES.REGLSEAS,
      ],
      type: 'markdown',
    },
    reference_ml: {
      optional: [ACTIONTYPES.INTL],
      type: 'text',
    },
    status_lbs_protocol: {
      optional: [ACTIONTYPES.REGLSEAS],
      type: 'text',
    },
    reference_landbased_ml: {
      optional: [ACTIONTYPES.REGLSEAS],
      type: 'text',
    },
    has_reference_landbased_ml: {
      optional: [ACTIONTYPES.REGLSEAS],
      type: 'bool',
      ui: 'checkbox',
      defaultValue: false,
    },
    amount: {
      optional: [ACTIONTYPES.DONOR],
      type: 'number',
    },
    amount_comment: {
      optional: [ACTIONTYPES.DONOR],
      type: 'text',
    },
  },
};

export const ACTOR_FIELDS = {
  CONNECTIONS: {
    categories: {
      table: API.CATEGORIES,
      connection: API.ACTOR_CATEGORIES,
      groupby: {
        table: API.TAXONOMIES,
        on: 'taxonomy_id',
      },
    },
    actions: {
      table: API.ACTIONS,
      connection: API.ACTOR_ACTIONS,
      groupby: {
        table: API.ACTIONTYPES,
        on: 'measuretype_id',
      },
    },
    targeted: {
      table: API.ACTIONS,
      connection: API.ACTION_ACTORS,
      groupby: {
        table: API.ACTIONTYPES,
        on: 'measuretype_id',
      },
    },
  },
  ATTRIBUTES: {
    actortype_id: {
      defaultValue: '1',
      required: Object.values(ACTORTYPES), // all types
      type: 'number',
      table: API.ACTORTYPES,
    },
    draft: {
      defaultValue: true,
      required: Object.values(ACTORTYPES), // all types
      type: 'bool',
      skipImport: true,
      // ui: 'dropdown',
      // options: [
      //   { value: true, message: 'ui.publishStatuses.draft' },
      //   { value: false, message: 'ui.publishStatuses.public' },
      // ],
    },
    code: {
      optional: Object.values(ACTORTYPES), // all types
      type: 'text',
    },
    title: {
      required: Object.values(ACTORTYPES), // all types
      type: 'text',
    },
    description: {
      optional: [
        ACTORTYPES.ORG,
        ACTORTYPES.CLASS,
        ACTORTYPES.REG,
        ACTORTYPES.GROUP,
      ],
      type: 'markdown',
    },
    activity_summary: {
      optional: [
        ACTORTYPES.COUNTRY,
        ACTORTYPES.ORG,
        ACTORTYPES.GROUP,
      ],
      type: 'markdown',
    },
    url: {
      optional: [
        ACTORTYPES.ORG,
        ACTORTYPES.GROUP,
      ],
      type: 'url',
    },
    gdp: {
      optional: [ACTORTYPES.COUNTRY],
      type: 'number',
    },
    population: {
      optional: [ACTORTYPES.COUNTRY],
      type: 'number',
    },
  },
};

export const RESOURCE_FIELDS = {
  CONNECTIONS: {
    actions: {
      table: API.ACTIONS,
      connection: API.ACTION_RESOURCES,
      groupby: {
        table: API.ACTIONTYPES,
        on: 'measuretype_id',
      },
    },
  },
  ATTRIBUTES: {
    resourcetype_id: {
      defaultValue: '1',
      required: Object.values(RESOURCETYPES), // all types
      type: 'number',
      table: API.RESOURCETYPES,
    },
    draft: {
      defaultValue: true,
      required: Object.values(RESOURCETYPES), // all types
      type: 'bool',
      skipImport: true,
      // ui: 'dropdown',
      // options: [
      //   { value: true, message: 'ui.publishStatuses.draft' },
      //   { value: false, message: 'ui.publishStatuses.public' },
      // ],
    },
    title: {
      required: Object.values(RESOURCETYPES), // all types
      type: 'text',
    },
    description: {
      optional: Object.values(RESOURCETYPES), // all types,
      type: 'markdown',
    },
    status: {
      optional: [
        RESOURCETYPES.AP,
        RESOURCETYPES.MLAP,
      ],
      type: 'markdown',
    },
    url: {
      optional: Object.values(RESOURCETYPES), // all types,
      type: 'url',
    },
    publication_date: {
      optional: Object.values(RESOURCETYPES), // all types,
      type: 'date',
    },
    access_date: {
      optional: Object.values(RESOURCETYPES), // all types,
      type: 'date',
    },
  },
};

// type compatibility: actors for actions
export const ACTIONTYPE_ACTORTYPES = {
  [ACTIONTYPES.INTL]: [
    ACTORTYPES.COUNTRY,
    ACTORTYPES.ORG,
    ACTORTYPES.GROUP,
  ],
  [ACTIONTYPES.REGLSEAS]: [
    ACTORTYPES.COUNTRY,
    ACTORTYPES.GROUP,
  ],
  [ACTIONTYPES.REGL]: [
    ACTORTYPES.COUNTRY,
    ACTORTYPES.GROUP,
  ],
  [ACTIONTYPES.NATL]: [
    ACTORTYPES.COUNTRY,
  ],
  [ACTIONTYPES.DONOR]: [
    ACTORTYPES.COUNTRY,
    ACTORTYPES.ORG,
    ACTORTYPES.GROUP,
  ],
  [ACTIONTYPES.INIT]: [
    ACTORTYPES.COUNTRY,
    ACTORTYPES.ORG,
    ACTORTYPES.GROUP,
  ],
};
// type compatibility: targets for actions
export const ACTIONTYPE_TARGETTYPES = {
  [ACTIONTYPES.INTL]: [],
  [ACTIONTYPES.REGLSEAS]: [
    ACTORTYPES.COUNTRY,
    ACTORTYPES.GROUP,
    ACTORTYPES.REG,
    ACTORTYPES.CLASS,
  ],
  [ACTIONTYPES.REGL]: [],
  [ACTIONTYPES.NATL]: [],
  [ACTIONTYPES.DONOR]: [
    ACTORTYPES.COUNTRY,
    ACTORTYPES.GROUP,
    ACTORTYPES.REG,
    ACTORTYPES.CLASS,
  ],
  [ACTIONTYPES.INIT]: [
    ACTORTYPES.COUNTRY,
    ACTORTYPES.GROUP,
    ACTORTYPES.REG,
    ACTORTYPES.CLASS,
  ],
};

export const ACTIONTYPE_RESOURCETYPES = {
  [ACTIONTYPES.INTL]: [
    RESOURCETYPES.REF,
    RESOURCETYPES.WEB,
    RESOURCETYPES.DOC,
  ],
  [ACTIONTYPES.REGLSEAS]: [
    RESOURCETYPES.REF,
    RESOURCETYPES.DOC,
    RESOURCETYPES.AP,
    RESOURCETYPES.MLAP,
  ],
  [ACTIONTYPES.REGL]: [
    RESOURCETYPES.REF,
    RESOURCETYPES.DOC,
  ],
  [ACTIONTYPES.NATL]: [
    RESOURCETYPES.REF,
    RESOURCETYPES.DOC,
  ],
  [ACTIONTYPES.DONOR]: [
    RESOURCETYPES.REF,
    RESOURCETYPES.DOC,
  ],
  [ACTIONTYPES.INIT]: [
    RESOURCETYPES.REF,
    RESOURCETYPES.WEB,
  ],
};

export const KEEP_FILTERS = ['view', 'ms'];

export const NODE_ENV = sessionStorage.NODE_ENV || 'production';

// Language and date settings ********************
// Note: you may also set the locales in i18n.js

// default language locale
export const DEFAULT_LOCALE = 'en-GB';
// date format - change to format according to locale, only used for form error message
export const DATE_FORMAT = 'dd/MM/yyyy';

// UI settings ************************

// show app title and claim in header when not included in graphic
// set in translations/[LOCALE].js
// - app.containers.App.app.title
// - app.containers.App.app.claim
export const SHOW_HEADER_TITLE = true;

// show header pattern
// specified in themes/[theme].js: theme.backgroundImages.header
export const SHOW_HEADER_PATTERN = true;
export const HEADER_PATTERN_HEIGHT = 254;

// show header pattern
// specified in themes/[theme].js: theme.backgroundImages.sidebarHeader
export const SHOW_SIDEBAR_HEADER_PATTERN = false;

// show app title and claim in home when not included in graphic
// set in translations/[LOCALE].js
// - app.containers.App.app.title
// - app.containers.App.app.claim
export const SHOW_HOME_TITLE = true;

export const SHOW_BRAND_ON_HOME = true;
export const SHOW_HEADER_PATTERN_HOME_GRAPHIC = false;

// show footer logo section
export const FOOTER = {
  PARTNERS: false,
  LINK_TARGET_INTERNAL: false,
  LINK_TARGET_INTERNAL_ID: 1,
};

// entitylists items-per-page options
// export const PAGE_ITEM_OPTIONS = [10, 20, 50, 100, 'all'];
export const PAGE_ITEM_OPTIONS = [
  { value: 10 },
  { value: 20 },
  { value: 50 },
  { value: 100 },
  {
    value: 'all',
    message: 'ui.pageItemOptions.all',
  },
];

export const TEXT_TRUNCATE = {
  CONNECTION_TAG: 20,
  ATTRIBUTE_TAG: 10,
  ENTITY_TAG: 7,
  CONNECTION_POPUP: 80,
  LINK_FIELD: 30,
  TYPE_SELECT: 24,
  GRACE: 2,
  META_TITLE: 20,
};

export const COLUMN_WIDTHS = {
  FULL: 1,
  HALF: 0.5,
  MAIN: 0.72,
  OTHER: 0.28,
};


/**
 * Server settings
 * */

// General ********************
const IS_DEV = true;

export const ENDPOINTS = {
  API: (
    NODE_ENV === 'production' && !IS_DEV
      ? 'https://67vn6.hatchboxapp.com'
      : 'https://marine-defrag-api.herokuapp.com'
  ), // server API endpoint
  SIGN_IN: 'auth/sign_in',
  SIGN_OUT: 'auth/sign_out',
  PASSWORD: 'auth/password',
  VALIDATE_TOKEN: 'auth/validate_token',
};

// API request Authentification keys
export const KEYS = {
  ACCESS_TOKEN: 'access-token',
  TOKEN_TYPE: 'token-type',
  CLIENT: 'client',
  EXPIRY: 'expiry',
  UID: 'uid',
  // RESET_PASSWORD: 'reset_password',
};

// database date format
export const API_DATE_FORMAT = 'yyyy-MM-dd';


// Map server messages *********************************

// Map server error messages to allow client-side translation
export const SERVER_ERRORS = {
  RECORD_OUTDATED: 'Record outdated',
  EMAIL_FORMAT: 'Email: is not an email',
  PASSWORD_MISMATCH: 'Password confirmation doesn\'t match Password',
  PASSWORD_SHORT: 'Password is too short (minimum is 6 characters)',
  PASSWORD_INVALID: 'Current password is invalid',
  TITLE_REQUIRED: 'Title: can\'t be blank',
  REFERENCE_REQUIRED: 'Reference: can\'t be blank',
};

// Map server attribute values **************************

// user roles
export const USER_ROLES = {
  ADMIN: { value: 1, message: 'ui.userRoles.admin' },
  MANAGER: { value: 2, message: 'ui.userRoles.manager' },
  ANALYST: { value: 3, message: 'ui.userRoles.analyst' },
  DEFAULT: { value: 9999, message: 'ui.userRoles.default' }, // note: client side only - no role assigned on server
};
// Entity publish statuses
export const PUBLISH_STATUSES = [
  { value: true, message: 'ui.publishStatuses.draft' },
  { value: false, message: 'ui.publishStatuses.public' },
];

export const DEFAULT_ACTORTYPE = '1';
export const DEFAULT_ACTIONTYPE = '1';
export const DEFAULT_RESOURCETYPE = '1';
export const DEFAULT_TAXONOMY = '11';
export const NO_PARENT_KEY = 'parentUndefined';

export const MAP_OPTIONS = {
  RANGE: ['#CAE0F7', '#164571'],
  NO_DATA_COLOR: '#E2E2E2',
  DEFAULT_STYLE: {
    weight: 1,
    color: '#BBC3CD',
    fillOpacity: 1,
  },
  TOOLTIP_STYLE: {
    weight: 1,
    fillOpacity: 0,
    color: '#666666',
    interactive: false,
  },
  OVER_STYLE: {
    weight: 1,
    fillOpacity: 0,
    color: '#AAAAAA',
    interactive: false,
  },
  BBOX_STYLE: {
    stroke: false,
    fillColor: '#F1F3F3',
    fillOpacity: 1,
  },
  CENTER: [20, 0],
  ZOOM: {
    INIT: 1,
    MIN: 0,
    MAX: 9,
  },
  BOUNDS: {
    N: 90,
    W: -3600,
    S: -90,
    E: 3600,
  },
  PROJ: {
    name: 'Robinson',
    crs: 'ESRI:54030',
    proj4def: '+proj=robin +lon_0=0 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs',
    resolutions: [
      65536, 32768, 16384, 8192, 4096, 2048, 1024, 512, 256, 128,
    ],
    origin: [0, 0],
    bounds: [[90, -180], [-90, 180]], // [[N, W], [S, E]]
  },
};
