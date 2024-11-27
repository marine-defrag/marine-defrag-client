import { truncateText, startsWith } from 'utils/string';
import { sortEntities, sortCategories } from 'utils/sort';
// import { filterTaxonomies } from 'utils/entities';
import isNumber from 'utils/is-number';

import {
  USER_ROLES,
  TEXT_TRUNCATE,
  ROUTES,
  API,
  USER_STATUSES,
} from 'themes/config';

import appMessages from 'containers/App/messages';

export const roundNumber = (value, digits = 0) => {
  const factor = 10 ** Math.min(digits, 3);
  return isNumber(value) && Math.round(value * factor) / factor;
};
export const formatNumber = (value, args = {}) => {
  const {
    intl,
    digits,
    unit,
    unitBefore,
    abbrevThousands = false,
    round = false,
  } = args;
  let result = value;

  if (isNumber(value)) {
    let dgts = digits;
    if (abbrevThousands && value >= 10000) {
      result /= 1000;
      dgts = 0;
    }
    result = round ? roundNumber(result, dgts) : result;
    result = intl
      ? intl.formatNumber(result)
      : result.toFixed(digits);
    if (abbrevThousands && value >= 10000) {
      result = `${result}k`;
    }
  }
  if (unit && startsWith(unit, '%')) {
    return `${result}${unit.trim()}`;
  }
  if (unit && unit.trim() !== '') {
    return unitBefore
      ? `${unit.trim()} ${result}`
      : `${result} ${unit.trim()}`;
  }
  return result;
};

const checkEmpty = (
  val
) => typeof val !== 'undefined' && val !== null && val.toString().trim().length > 0;

export const getInfoField = (att, value, large = false) => checkEmpty(value) && ({
  controlType: 'info',
  value,
  large,
  label: appMessages.attributes[att],
});
export const getIdField = (entity) => checkEmpty(entity.get('id')) && ({
  controlType: 'info',
  type: 'reference',
  value: entity.get('id'),
  large: true,
  label: appMessages.attributes.id,
});
export const getReferenceField = (entity, att, isManager) => {
  const value = att
    ? entity.getIn(['attributes', 'reference']) || entity.getIn(['attributes', att])
    : entity.getIn(['attributes', 'reference']);
  if (checkEmpty(value)) {
    return ({
      controlType: 'info',
      type: 'reference',
      value,
      large: true,
      isManager,
    });
  }
  return false;
};
const getLinkAnchor = (url) => truncateText(url.replace(/^https?:\/\//i, ''), TEXT_TRUNCATE.LINK_FIELD);

export const getLinkField = (
  entity
) => checkEmpty(entity.getIn(['attributes', 'url'])) && ({
  type: 'link',
  value: entity.getIn(['attributes', 'url']),
  anchor: getLinkAnchor(entity.getIn(['attributes', 'url'])),
});
export const getEntityLinkField = (
  entity,
  path,
  label,
  labelFormatted,
) => checkEmpty(entity.getIn(['attributes', 'title']) || entity.getIn(['attributes', 'name'])) && ({
  type: 'link',
  internal: true,
  value: `${path}/${entity.get('id')}`,
  anchor: entity.getIn(['attributes', 'title']) || entity.getIn(['attributes', 'name']),
  label,
  labelFormatted,
});

export const getTitleField = (
  entity, isManager, attribute = 'title', label
) => checkEmpty(entity.getIn(['attributes', attribute])) && ({
  type: 'title',
  value: entity.getIn(['attributes', attribute]),
  isManager,
  label,
});
export const getTitleTextField = (
  entity, isManager, attribute = 'title', label
) => checkEmpty(entity.getIn(['attributes', attribute])) && ({
  type: 'titleText',
  value: entity.getIn(['attributes', attribute]),
  isManager,
  label,
});
export const getStatusField = (
  entity,
  attribute = 'draft',
  options,
  label,
  defaultValue = true,
) => (defaultValue || checkEmpty(entity.getIn(['attributes', attribute]))) && ({
  controlType: 'info',
  type: 'status',
  printHide: true,
  value: (
    entity
    && entity.getIn(['attributes', attribute]) !== null
    && typeof entity.getIn(['attributes', attribute]) !== 'undefined'
  )
    ? entity.getIn(['attributes', attribute])
    : defaultValue,
  options,
  label,
});

// only show the highest rated role (lower role ids means higher)
export const getHighestUserRoleId = (roles) => roles.reduce(
  (memo, role) => role.get('id') < memo ? role.get('id') : memo,
  USER_ROLES.DEFAULT.value
);

export const getRoleField = (entity) => ({
  controlType: 'info',
  type: 'role',
  value: entity.get('roles') && getHighestUserRoleId(entity.get('roles')),
  options: Object.values(USER_ROLES),
});
export const getUserStatusField = (
  entity,
  defaultValue = 'false',
) => ({
  controlType: 'info',
  type: 'warning',
  label: appMessages.attributes.is_archived,
  value: (
    entity
    && entity.getIn(['attributes', 'is_archived']) !== null
    && typeof entity.getIn(['attributes', 'is_archived']) !== 'undefined'
  )
    ? entity.getIn(['attributes', 'is_archived'])
    : defaultValue,
  options: USER_STATUSES,
});

export const getMetaField = (entity) => {
  const fields = [];
  fields.push({
    label: appMessages.attributes.meta.created_at,
    value: entity.getIn(['attributes', 'created_at']),
    date: true,
  });
  fields.push({
    label: appMessages.attributes.meta.updated_at,
    value: entity.getIn(['attributes', 'updated_at']),
    date: true,
    time: true,
  });
  if (entity.get('user') && entity.getIn(['user', 'attributes', 'name'])) {
    fields.push({
      label: appMessages.attributes.meta.updated_by_id,
      value: entity.get('user') && entity.getIn(['user', 'attributes', 'name']),
      info: entity.get('user') && entity.getIn(['user', 'attributes', 'is_archived'])
        ? 'ARCHIVED'
        : null,
    });
  }
  return {
    controlType: 'info',
    type: 'meta',
    printHide: true,
    fields,
  };
};

export const getMarkdownField = (
  entity,
  attribute,
  hasLabel = true,
  label,
) => checkEmpty(entity.getIn(['attributes', attribute])) && ({
  type: 'markdown',
  value: entity.getIn(['attributes', attribute]),
  label: hasLabel && (appMessages.attributes[label || attribute]),
});

export const getNumberField = (
  entity,
  attribute,
  args = {},
) => {
  const { showEmpty, emptyMessage, ...otherArgs } = args;
  return (showEmpty || checkEmpty(entity.getIn(['attributes', attribute]))) && ({
    type: 'number',
    value: !!entity.getIn(['attributes', attribute]) && entity.getIn(['attributes', attribute]),
    label: appMessages.attributes[attribute],
    showEmpty: showEmpty && (emptyMessage || appMessages.attributes[`${attribute}_empty`]),
    ...otherArgs,
  });
};

export const getDateField = (
  entity,
  attribute,
  args = {},
) => {
  const {
    showEmpty,
    emptyMessage,
    specificity,
    attributeLabel,
  } = args;
  return (showEmpty || checkEmpty(entity.getIn(['attributes', attribute]))) && ({
    type: 'date',
    value: !!entity.getIn(['attributes', attribute]) && entity.getIn(['attributes', attribute]),
    label: appMessages.attributes[attributeLabel || attribute],
    showEmpty: showEmpty && (emptyMessage || appMessages.attributes[`${attribute}_empty`]),
    specificity,
  });
};

export const getDateRelatedField = (
  value,
  attribute,
  showEmpty,
  emptyMessage,
) => (showEmpty || checkEmpty(value)) && ({
  type: 'date',
  value: !!value && value,
  label: appMessages.attributes[attribute],
  showEmpty: showEmpty && (emptyMessage || appMessages.attributes[`${attribute}_empty`]),
});

export const getTextField = (
  entity,
  attribute,
) => checkEmpty(entity.getIn(['attributes', attribute])) && ({
  type: 'text',
  value: entity.getIn(['attributes', attribute]),
  label: appMessages.attributes[attribute],
});

const mapCategoryOptions = (categories, taxId) => categories
  ? sortCategories(categories, taxId)
    .map((cat) => ({
      label: cat.getIn(['attributes', 'title']),
      info: cat.getIn(['attributes', 'description']),
      reference: cat.getIn(['attributes', 'reference']) || null,
      draft: cat.getIn(['attributes', 'draft']) || null,
      linkTo: `${ROUTES.CATEGORY}/${cat.get('id')}`,
    }))
    .valueSeq().toArray()
  : [];

export const getTaxonomyFields = (taxonomies) => taxonomies
  && sortEntities(
    taxonomies,
    'asc',
    'priority',
  ).map(
    (taxonomy) => ({
      type: 'taxonomy',
      label: appMessages.entities.taxonomies[taxonomy.get('id')].plural,
      info: appMessages.entities.taxonomies[taxonomy.get('id')].description,
      entityType: 'taxonomies',
      id: taxonomy.get('id'),
      values: mapCategoryOptions(taxonomy.get('categories'), taxonomy.get('id')),
    })
  ).valueSeq().toArray();

export const hasTaxonomyCategories = (taxonomies) => taxonomies
  ? taxonomies.reduce((memo, taxonomy) => memo || (taxonomy.get('categories') && taxonomy.get('categories').size > 0), false)
  : false;

const getCategoryShortTitle = (category) => {
  const title = (
    category.getIn(['attributes', 'short_title'])
    && (category.getIn(['attributes', 'short_title']).trim().length > 0)
  )
    ? category.getIn(['attributes', 'short_title'])
    : category.getIn(['attributes', 'title']);
  return truncateText(title, TEXT_TRUNCATE.ENTITY_TAG);
};

export const getCategoryShortTitleField = (entity) => ({
  type: 'short_title',
  value: getCategoryShortTitle(entity),
  inverse: entity.getIn(['attributes', 'draft']),
  taxonomyId: entity.getIn(['attributes', 'taxonomy_id']),
});

const getConnectionField = ({
  entities,
  taxonomies,
  connections,
  connectionOptions,
  entityType,
  entityIcon,
  entityPath,
  onEntityClick,
  skipLabel,
  showValueForAction,
  columns,
  sortBy,
  sortOrder,
}) => ({
  type: 'connections',
  values: entities.toList(),
  taxonomies,
  connections,
  entityType,
  entityIcon,
  entityPath: entityPath || entityType,
  onEntityClick,
  showEmpty: appMessages.entities[entityType].empty,
  connectionOptions,
  skipLabel,
  showValueForAction,
  columns: columns || [{
    id: 'main',
    type: 'main',
    sort: 'title',
    attributes: ['code', 'title'],
  }],
  sortBy,
  sortOrder,
});

export const getActorConnectionField = ({
  actors,
  taxonomies,
  connections,
  onEntityClick,
  typeid, // actortype id
  skipLabel,
  connectionOptions,
  showValueForAction,
  columns,
  sortBy,
  sortOrder,
}) => getConnectionField({
  entities: sortEntities(actors, 'asc', 'id'),
  taxonomies,
  connections,
  connectionOptions: connectionOptions || {
    actions: {
      message: 'entities.actions_{typeid}.plural',
      entityType: 'actions',
      path: API.ACTIONS,
      clientPath: ROUTES.ACTION,
      groupByType: true,
    },
    targets: {
      message: 'entities.actions_{typeid}.plural',
      entityType: 'actions',
      entityTypeAs: 'targetingActions',
      path: API.ACTIONS,
      clientPath: ROUTES.ACTION,
      groupByType: true,
    },
    members: {
      message: 'entities.actors_{typeid}.plural',
      entityType: 'actors',
      entityTypeAs: 'members',
      path: API.ACTORS,
      clientPath: ROUTES.ACTOR,
      groupByType: true,
    },
    associations: {
      message: 'entities.actors_{typeid}.plural',
      entityType: 'actors',
      entityTypeAs: 'associations',
      path: API.ACTORS,
      clientPath: ROUTES.ACTOR,
      groupByType: true,
    },
  },
  entityType: typeid ? `actors_${typeid}` : 'actors',
  entityPath: ROUTES.ACTOR,
  onEntityClick,
  skipLabel,
  showValueForAction,
  columns,
  sortBy,
  sortOrder,
});

export const getActionConnectionField = ({
  actions,
  taxonomies,
  connections,
  onEntityClick,
  typeid, // actortype id
  skipLabel,
  connectionOptions,
  columns,
}) => getConnectionField({
  entities: sortEntities(actions, 'asc', 'id'),
  taxonomies,
  connections,
  connectionOptions: connectionOptions || {
    actors: {
      message: 'entities.actors_{typeid}.plural',
      entityType: 'actors',
      path: API.ACTORS,
      clientPath: ROUTES.ACTOR,
      groupByType: true,
    },
    targets: {
      message: 'entities.actors_{typeid}.plural',
      entityType: 'actors',
      entityTypeAs: 'targets',
      path: API.ACTORS,
      clientPath: ROUTES.ACTOR,
      groupByType: true,
    },
    resources: {
      message: 'entities.resources_{typeid}.plural',
      entityType: 'resources',
      path: API.RESOURCES,
      clientPath: ROUTES.RESOURCE,
      groupByType: true,
    },
  },
  entityType: typeid ? `actions_${typeid}` : 'actions',
  entityPath: ROUTES.ACTION,
  onEntityClick,
  skipLabel,
  columns,
});

export const getResourceConnectionField = ({
  resources,
  connections,
  onEntityClick,
  typeid, // actortype id
  skipLabel,
  connectionOptions,
  columns,
}) => getConnectionField({
  entities: sortEntities(resources, 'asc', 'id'),
  connections,
  connectionOptions: connectionOptions || {
    actions: {
      message: 'entities.actions_{typeid}.plural',
      entityType: 'actions',
      path: API.ACTIONS,
      clientPath: ROUTES.ACTION,
      groupByType: true,
    },
  },
  entityType: typeid ? `resources_${typeid}` : 'resources',
  entityPath: ROUTES.RESOURCE,
  onEntityClick,
  skipLabel,
  columns,
});

// const getConnectionGroupsField = ({
//   entityGroups,
//   groupedBy,
//   taxonomies,
//   connections,
//   connectionOptions,
//   entityType,
//   entityIcon,
//   entityPath,
//   onEntityClick,
// }) => ({
//   type: 'connectionGroups',
//   groups: entityGroups.toList(),
//   groupedBy,
//   taxonomies,
//   connections,
//   entityType,
//   entityIcon,
//   entityPath: entityPath || entityType,
//   onEntityClick,
//   showEmpty: appMessages.entities[entityType].empty,
//   connectionOptions: connectionOptions.map((option) => ({
//     label: appMessages.entities[option].plural,
//     path: option,
//     // TODO check path
//     clientPath: option === 'actions' ? 'actions' : option,
//   })),
// });
// export const getActorConnectionGroupsField = (
//   entityGroups,
//   groupedBy,
//   taxonomies,
//   connections,
//   onEntityClick,
//   actortypeid, // actortype id
// ) => getConnectionGroupsField({
//   entityGroups,
//   groupedBy,
//   taxonomies: filterTaxonomies(taxonomies, 'tags_actors'),
//   connections,
//   connectionOptions: ['actions'],
//   entityType: actortypeid ? `actors_${actortypeid}` : 'actors',
//   entityPath: ROUTES.ACTOR,
//   onEntityClick,
// });
// export const getActionConnectionGroupsField = (entityGroups, groupedBy, taxonomies, connections, onEntityClick) => getConnectionGroupsField({
//   entityGroups,
//   groupedBy,
//   taxonomies: filterTaxonomies(taxonomies, 'tags_actions'),
//   connections,
//   connectionOptions: ['actors'],
//   entityType: 'actions',
//   entityPath: ROUTES.ACTION,
//   onEntityClick,
// });

export const getManagerField = (entity, messageLabel, messageEmpty) => ({
  label: messageLabel,
  type: 'manager',
  value: entity.get('manager') && entity.getIn(['manager', 'attributes', 'name']),
  showEmpty: messageEmpty,
});

export const getEmailField = (entity) => ({
  type: 'email',
  value: entity.getIn(['attributes', 'email']),
});
