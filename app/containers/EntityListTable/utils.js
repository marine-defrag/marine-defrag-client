import { STATES as CHECKBOX_STATES } from 'components/forms/IndeterminateCheckbox';
import isNumber from 'utils/is-number';
import { formatNumber } from 'utils/fields';
import { truncateText } from 'utils/string';
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
          sortActive: sortBy === col.type,
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
          sortActive: sortBy === col.type,
          sortOrder: sortOrder || 'asc',
          onSort,
        });
      case 'targets':
        return ({
          ...col,
          title: 'Targets',
          sortActive: sortBy === col.type,
          sortOrder: sortOrder || 'asc',
          onSort,
        });
      default:
        return col;
    }
  }
);

const getTargets = (targetIDs, connections) => {
  if (targetIDs && targetIDs.size > 0) {
    return targetIDs.map(
      (targetId) => connections.get(targetId.toString())
    );
  }
  return null;
};
const getTargetsValue = (targets) => {
  if (targets && targets.size > 0) {
    if (targets.size > 1) {
      return targets.size;
    }
    return truncateText(targets.first().getIn(['attributes', 'title']), 12);
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
  // taxonomies,
  intl,
}) => entities.reduce(
  (memoEntities, entity) => {
    const id = entity.get('id');
    const entityValues = columns.reduce(
      (memoEntity, col) => {
        const path = (config && config.clientPath) || entityPath;
        let targets;
        switch (col.type) {
          case 'main':
            return {
              ...memoEntity,
              [col.type]: {
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
              [col.type]: {
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
          case 'targets':
            targets = getTargets(entity.get('targets'), connections.get('actors'), col);
            return {
              ...memoEntity,
              [col.type]: {
                ...col,
                value: getTargetsValue(targets, col),
                single: targets && targets.size === 1 && targets.first(),
                tooltip: targets && targets.size > 1
                  && targets.groupBy((t) => t.getIn(['attributes', 'actortype_id'])),
                multiple: targets && targets.size > 1,
                sortValue: targets && targets.size,
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
