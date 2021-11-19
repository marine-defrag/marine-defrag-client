import { truncateText } from 'utils/string';
import { sortEntities, sortCategories } from 'utils/sort';
import { filterTaxonomies } from 'utils/entities';
import {
  USER_ROLES, TEXT_TRUNCATE, ROUTES,
} from 'themes/config';

import appMessages from 'containers/App/messages';

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
export const getReferenceField = (entity, isManager, defaultToId) => {
  const value = defaultToId
    ? entity.getIn(['attributes', 'reference']) || entity.get('id')
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
const getHighestUserRoleId = (roles) => roles.reduce(
  (memo, role) => role.get('id') < memo ? role.get('id') : memo,
  USER_ROLES.DEFAULT.value
);

export const getRoleField = (entity) => ({
  controlType: 'info',
  type: 'role',
  value: entity.get('roles') && getHighestUserRoleId(entity.get('roles')),
  options: Object.values(USER_ROLES),
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
    });
  }
  return {
    controlType: 'info',
    type: 'meta',
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

export const getAmountField = (
  entity,
  attribute,
  showEmpty,
  emptyMessage,
) => (showEmpty || checkEmpty(entity.getIn(['attributes', attribute]))) && ({
  type: 'text',
  value: !!entity.getIn(['attributes', attribute]) && entity.getIn(['attributes', attribute]),
  label: appMessages.attributes[attribute],
  showEmpty: showEmpty && (emptyMessage || appMessages.attributes[`${attribute}_empty`]),
});

export const getDateField = (
  entity,
  attribute,
  showEmpty,
  emptyMessage,
) => (showEmpty || checkEmpty(entity.getIn(['attributes', attribute]))) && ({
  type: 'date',
  value: !!entity.getIn(['attributes', attribute]) && entity.getIn(['attributes', attribute]),
  label: appMessages.attributes[attribute],
  showEmpty: showEmpty && (emptyMessage || appMessages.attributes[`${attribute}_empty`]),
});

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
      reference: cat.getIn(['attributes', 'reference']) || null,
      draft: cat.getIn(['attributes', 'draft']) || null,
      linkTo: `${ROUTES.CATEGORY}/${cat.get('id')}`,
    }))
    .valueSeq().toArray()
  : [];

const mapSmartCategoryOptions = (categories) => categories
  ? sortEntities(
    categories,
    'asc',
    'referenceThenTitle',
  )
    .map((cat) => ({
      label: cat.getIn(['attributes', 'title']),
      isSmart: cat.get('associated') && cat.get('associated').size > 0,
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
      entityType: 'taxonomies',
      id: taxonomy.get('id'),
      values: mapCategoryOptions(taxonomy.get('categories'), taxonomy.get('id')),
    })
  ).valueSeq().toArray();

export const getSmartTaxonomyField = (taxonomy) => ({
  type: 'smartTaxonomy',
  entityType: 'taxonomies',
  id: taxonomy.get('id'),
  values: mapSmartCategoryOptions(taxonomy.get('categories')),
});

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
});

export const getActorConnectionField = (
  entities,
  taxonomies,
  connections,
  onEntityClick,
  actortypeid, // actortype id
) => getConnectionField({
  entities: sortEntities(entities, 'asc', 'id'),
  taxonomies: filterTaxonomies(taxonomies, 'tags_actors'),
  connections,
  connectionOptions: [{
    label: appMessages.entities.actions.plural,
    groupByType: true,
    path: 'measures',
    clientPath: ROUTES.ACTION,
    query: 'actions',
  }],
  entityType: actortypeid ? `actors_${actortypeid}` : 'actors',
  entityPath: ROUTES.ACTOR,
  onEntityClick,
});
export const getTargetConnectionField = getActorConnectionField;
// (
//   entities,
//   taxonomies,
//   connections,
//   onEntityClick,
//   actortypeid, // actortype id
// ) => getConnectionField({
//   entities: sortEntities(entities, 'asc', 'id'),
//   taxonomies: filterTaxonomies(taxonomies, 'tags_actors'),
//   connections,
//   connectionOptions: [{
//     label: appMessages.entities.actions.plural,
//     groupByType: true,
//     path: 'measures',
//     clientPath: ROUTES.ACTION,
//     query: 'actions',
//   }],
//   entityType: actortypeid ? `actors_${actortypeid}` : 'actors',
//   entityPath: ROUTES.ACTOR,
//   onEntityClick,
// });
export const getActionConnectionField = (
  entities,
  taxonomies,
  connections,
  onEntityClick,
  actiontypeid, // actortype id
) => getConnectionField({
  entities: sortEntities(entities, 'asc', 'id'),
  taxonomies: filterTaxonomies(taxonomies, 'tags_actions'),
  connections,
  connectionOptions: [{
    label: appMessages.entities.actors.plural,
    groupByType: true,
    path: 'actors',
    clientPath: ROUTES.ACTOR,
    query: 'actors',
  }],
  entityType: actiontypeid ? `actions_${actiontypeid}` : 'actions',
  entityPath: ROUTES.ACTION,
  onEntityClick,
});
export const getActionAsTargetConnectionField = (
  entities,
  taxonomies,
  connections,
  onEntityClick,
  actiontypeid, // actortype id
) => getConnectionField({
  entities: sortEntities(entities, 'asc', 'id'),
  taxonomies: filterTaxonomies(taxonomies, 'tags_actions'),
  connections,
  connectionOptions: [{
    label: appMessages.entities.actors.plural,
    groupByType: true,
    path: 'actors',
    clientPath: ROUTES.ACTOR,
    query: 'actors',
  }],
  entityType: actiontypeid ? `actions_${actiontypeid}` : 'actions',
  entityPath: ROUTES.ACTION,
  onEntityClick,
});

export const getMemberConnectionField = getActorConnectionField;
export const getAssociationConnectionField = getActorConnectionField;
// (
//   entities,
//   taxonomies,
//   connections,
//   onEntityClick,
//   actortypeid, // actortype id
// ) => getConnectionField({
//   entities: sortEntities(entities, 'asc', 'id'),
//   taxonomies: filterTaxonomies(taxonomies, 'tags_actors'),
//   connections,
//   connectionOptions: [{
//     label: appMessages.entities.actions.plural,
//     groupByType: true,
//     path: 'measures',
//     clientPath: ROUTES.ACTION,
//     query: 'actions',
//   }],
//   entityType: actortypeid ? `actors_${actortypeid}` : 'actors',
//   entityPath: ROUTES.ACTOR,
//   onEntityClick,
// });

const getConnectionGroupsField = ({
  entityGroups,
  groupedBy,
  taxonomies,
  connections,
  connectionOptions,
  entityType,
  entityIcon,
  entityPath,
  onEntityClick,
}) => ({
  type: 'connectionGroups',
  groups: entityGroups.toList(),
  groupedBy,
  taxonomies,
  connections,
  entityType,
  entityIcon,
  entityPath: entityPath || entityType,
  onEntityClick,
  showEmpty: appMessages.entities[entityType].empty,
  connectionOptions: connectionOptions.map((option) => ({
    label: appMessages.entities[option].plural,
    path: option,
    // TODO check path
    clientPath: option === 'actions' ? 'actions' : option,
  })),
});
export const getActorConnectionGroupsField = (
  entityGroups,
  groupedBy,
  taxonomies,
  connections,
  onEntityClick,
  actortypeid, // actortype id
) => getConnectionGroupsField({
  entityGroups,
  groupedBy,
  taxonomies: filterTaxonomies(taxonomies, 'tags_actors'),
  connections,
  connectionOptions: ['actions'],
  entityType: actortypeid ? `actors_${actortypeid}` : 'actors',
  entityPath: ROUTES.ACTOR,
  onEntityClick,
});
export const getActionConnectionGroupsField = (entityGroups, groupedBy, taxonomies, connections, onEntityClick) => getConnectionGroupsField({
  entityGroups,
  groupedBy,
  taxonomies: filterTaxonomies(taxonomies, 'tags_actions'),
  connections,
  connectionOptions: ['actors'],
  entityType: 'actions',
  entityPath: ROUTES.ACTION,
  onEntityClick,
});

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
