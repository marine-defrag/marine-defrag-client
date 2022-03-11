import { STATES as CHECKBOX_STATES } from 'components/forms/IndeterminateCheckbox';
import { Map } from 'immutable';
import isNumber from 'utils/is-number';
import { formatNumber } from 'utils/fields';
import appMessages from 'containers/App/messages';

export const prepareHeader = ({
  columns,
  // config,
  sortBy,
  sortOrder,
  onSort,
  onSelectAll,
  selectedState,
  title,
  intl,
}) => columns.map(
  (col) => {
    switch (col.type) {
      case 'main':
        return ({
          ...col,
          title,
          sortActive: sortBy === col.id,
          sortOrder: sortOrder || 'asc',
          onSort,
          onSelect: onSelectAll,
          selectedState,
        });
      case 'amount':
        return ({
          ...col,
          title: col.unit
            ? `${intl.formatMessage(appMessages.attributes[col.attribute])} (${col.unit})`
            : intl.formatMessage(appMessages.attributes[col.attribute]),
          sortActive: sortBy === col.id,
          sortOrder: sortOrder || 'asc',
          onSort,
        });
      case 'date':
        return ({
          ...col,
          title: 'Date',
          sortActive: sortBy === col.id,
          sortOrder: sortOrder || 'asc',
          onSort,
        });
      case 'targets':
        return ({
          ...col,
          title: 'Targets',
          sortActive: sortBy === col.id,
          sortOrder: sortOrder || 'asc',
          onSort,
        });
      case 'actors':
        return ({
          ...col,
          title: 'Actors',
          sortActive: sortBy === col.id,
          sortOrder: sortOrder || 'asc',
          onSort,
        });
      case 'taxonomy':
        return ({
          ...col,
          title: appMessages.entities.taxonomies[col.taxonomy_id]
            ? intl.formatMessage(appMessages.entities.taxonomies[col.taxonomy_id].shortSingle)
            : 'Categories',
          sortActive: sortBy === col.id,
          sortOrder: sortOrder || 'asc',
          onSort,
        });
      case 'hasResources':
        return ({
          ...col,
          title: appMessages.entities[`resources_${col.resourcetype_id}`]
            ? intl.formatMessage(appMessages.entities[`resources_${col.resourcetype_id}`].singleShort)
            : 'Resource',
          sortActive: sortBy === col.id,
          sortOrder: sortOrder || 'asc',
          onSort,
        });
      default:
        return col;
    }
  }
);

const getRelatedEntities = (relatedIDs, connections) => {
  if (relatedIDs && relatedIDs.size > 0) {
    return relatedIDs.reduce(
      (memo, relatedID) => {
        if (connections.get(relatedID.toString())) {
          return memo.set(relatedID, connections.get(relatedID.toString()));
        }
        return memo;
      },
      Map(),
    );
  }
  return null;
};
const getRelatedValue = (relatedEntities, typeLabel) => {
  if (relatedEntities && relatedEntities.size > 0) {
    if (relatedEntities.size > 1) {
      return typeLabel
        ? `${relatedEntities.size} ${typeLabel}`
        : relatedEntities.size;
    }
    return relatedEntities.first().getIn(['attributes', 'title']);
  }
  return null;
};
const getRelatedSortValue = (relatedEntities) => {
  if (relatedEntities && relatedEntities.size > 0) {
    if (relatedEntities.size > 1) {
      return relatedEntities.size;
    }
    return relatedEntities.first().getIn(['attributes', 'title']);
  }
  return null;
};

export const prepareEntities = ({
  entities,
  columns,
  entityIdsSelected,
  config,
  url,
  entityPath,
  onEntityClick,
  onEntitySelect,
  connections,
  taxonomies,
  resources,
  intl,
}) => entities.reduce(
  (memoEntities, entity) => {
    const id = entity.get('id');
    const entityValues = columns.reduce(
      (memoEntity, col) => {
        const path = (config && config.clientPath) || entityPath;
        let relatedEntities;
        switch (col.type) {
          case 'main':
            return {
              ...memoEntity,
              [col.id]: {
                ...col,
                values: col.attributes.reduce(
                  (memo, att) => ({
                    ...memo,
                    [att]: entity.getIn(['attributes', att]),
                  }),
                  {}
                ),
                draft: entity.getIn(['attributes', 'draft']),
                sortValue: entity.getIn(['attributes', col.sort]),
                selected: entityIdsSelected && entityIdsSelected.includes(id),
                href: url || `${path}/${id}`,
                onClick: (evt) => {
                  if (evt) evt.preventDefault();
                  onEntityClick(id, path);
                },
                onSelect: (checked) => onEntitySelect(id, checked),
              },
            };
          case 'amount':
            return {
              ...memoEntity,
              [col.id]: {
                ...col,
                value: isNumber(entity.getIn(['attributes', col.attribute]))
                  && formatNumber(
                    entity.getIn(['attributes', col.attribute]), { intl },
                  ),
                draft: entity.getIn(['attributes', 'draft']),
                sortValue: entity.getIn(['attributes', col.sort])
                  && parseFloat(entity.getIn(['attributes', col.sort]), 10),
              },
            };
          case 'date':
            return {
              ...memoEntity,
              [col.id]: {
                ...col,
                value: entity.getIn(['attributes', col.attribute])
                  && intl.formatDate(entity.getIn(['attributes', col.attribute])),
                draft: entity.getIn(['attributes', 'draft']),
                sortValue: entity.getIn(['attributes', col.attribute]),
              },
            };
          case 'targets':
            relatedEntities = getRelatedEntities(entity.get('targets'), connections.get('actors'), col);
            return {
              ...memoEntity,
              [col.id]: {
                ...col,
                value: getRelatedValue(relatedEntities, 'targets'),
                single: relatedEntities && relatedEntities.size === 1 && relatedEntities.first(),
                tooltip: relatedEntities && relatedEntities.size > 1
                  && relatedEntities.groupBy((t) => t.getIn(['attributes', 'actortype_id'])),
                multiple: relatedEntities && relatedEntities.size > 1,
                sortValue: getRelatedSortValue(relatedEntities),
              },
            };
          case 'actors':
            relatedEntities = getRelatedEntities(entity.get('actors'), connections.get('actors'), col);
            return {
              ...memoEntity,
              [col.id]: {
                ...col,
                value: getRelatedValue(relatedEntities, 'actors'),
                single: relatedEntities && relatedEntities.size === 1 && relatedEntities.first(),
                tooltip: relatedEntities && relatedEntities.size > 1
                  && relatedEntities.groupBy((t) => t.getIn(['attributes', 'actortype_id'])),
                multiple: relatedEntities && relatedEntities.size > 1,
                sortValue: getRelatedSortValue(relatedEntities),
              },
            };
          case 'taxonomy':
            // console.log(entity && entity.toJS())
            relatedEntities = taxonomies.get(col.taxonomy_id.toString())
              && getRelatedEntities(
                entity.get('categories'),
                taxonomies.get(col.taxonomy_id.toString()).get('categories'),
                col,
              );
            return {
              ...memoEntity,
              [col.id]: {
                ...col,
                value: getRelatedValue(relatedEntities, 'categories'),
                single: relatedEntities && relatedEntities.size === 1 && relatedEntities.first(),
                tooltip: relatedEntities && relatedEntities.size > 1 && relatedEntities,
                multiple: relatedEntities && relatedEntities.size > 1,
                sortValue: getRelatedSortValue(relatedEntities),
              },
            };
          case 'hasResources':
            relatedEntities = entity.getIn(['resourcesByType', parseInt(col.resourcetype_id, 10)])
              && getRelatedEntities(
                entity.getIn(['resourcesByType', parseInt(col.resourcetype_id, 10)]),
                resources,
                col,
              );
            return {
              ...memoEntity,
              [col.id]: {
                ...col,
                value: relatedEntities && relatedEntities.first(),
                sortValue: relatedEntities ? 1 : -1,
              },
            };
          default:
            return memoEntity;
        }
      },
      { id },
    );
    return [
      ...memoEntities,
      entityValues,
    ];
  },
  [],
);

export const getListHeaderLabel = ({
  intl,
  entityTitle,
  selectedTotal,
  pageTotal,
  entitiesTotal,
  allSelectedOnPage,
  messages,
}) => {
  if (selectedTotal > 0) {
    if (allSelectedOnPage) {
      // return `All ${selectedTotal} ${selectedTotal === 1 ? entityTitle.single : entityTitle.plural} on this page are selected. `;
      return intl && intl.formatMessage(messages.entityListHeader.allSelectedOnPage, {
        total: selectedTotal,
        type: selectedTotal === 1 ? entityTitle.single : entityTitle.plural,
      });
    }
    // return `${selectedTotal} ${selectedTotal === 1 ? entityTitle.single : entityTitle.plural} selected. `;
    return intl && intl.formatMessage(messages.entityListHeader.selected, {
      total: selectedTotal,
      type: selectedTotal === 1 ? entityTitle.single : entityTitle.plural,
    });
  }
  if (pageTotal && (pageTotal < entitiesTotal)) {
    return intl && intl.formatMessage(messages.entityListHeader.noneSelected, {
      pageTotal,
      entitiesTotal,
      type: entityTitle.plural,
    });
  }
  return intl && intl.formatMessage(messages.entityListHeader.notPaged, {
    entitiesTotal,
    type: (entitiesTotal === 1) ? entityTitle.single : entityTitle.plural,
  });
};

export const getSelectedState = (
  selectedTotal,
  allSelected,
) => {
  if (selectedTotal === 0) {
    return CHECKBOX_STATES.UNCHECKED;
  }
  if (selectedTotal > 0 && allSelected) {
    return CHECKBOX_STATES.CHECKED;
  }
  return CHECKBOX_STATES.INDETERMINATE;
};
