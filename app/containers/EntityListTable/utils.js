import { STATES as CHECKBOX_STATES } from 'components/forms/IndeterminateCheckbox';

export const prepareEntities = ({
  entities,
  columns,
  entityIdsSelected,
  config,
  url,
  entityPath,
  onEntityClick,
  onEntitySelect,
  // connections,
  // taxonomies,
  // intl,
}) => entities.reduce(
  (memoEntities, entity) => {
    const id = entity.get('id');
    const entityValues = columns.reduce(
      (memoEntity, col) => {
        const path = (config && config.clientPath) || entityPath;
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
                href: url || path,
                onClick: (evt) => {
                  if (evt) evt.preventDefault();
                  onEntityClick(id, path);
                },
                onSelect: (checked) => onEntitySelect(id, checked),
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

export const prepareHeader = ({
  columns,
  // config,
  sortBy,
  sortOrder,
  onSort,
  onSelectAll,
  selectedState,
  title,
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
      default:
        return col;
    }
  }
);
