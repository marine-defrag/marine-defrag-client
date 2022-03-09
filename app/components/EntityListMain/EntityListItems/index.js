import React from 'react';
import PropTypes from 'prop-types';
import { Map, List } from 'immutable';

import EntityListItem from 'components/EntityListItem';
import EntityListMainHeader from '../EntityListMainHeader';

export class EntityListItems extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const {
      entities,
      pageTotal,
      entitiesTotal,
      isManager,
      entityTitle,
      locationQuery,
      onSortBy,
      onSortOrder,
      onSelect,
      onSelectAll,
      onDismissError,
      onEntitySelect,
      onEntityClick,
      taxonomies,
      connections,
      config,
      entityPath,
      url,
      showValueForAction,
      showCode,
      inSingleView,
      entityIdsSelected,
      errors,
    } = this.props;
    return (
      <div>
        {!inSingleView && (
          <EntityListMainHeader
            selectedTotal={entityIdsSelected && entityIdsSelected.toSet().size}
            pageTotal={pageTotal}
            entitiesTotal={entitiesTotal}
            allSelected={entityIdsSelected && entityIdsSelected.toSet().size === entitiesTotal}
            allSelectedOnPage={entityIdsSelected && entityIdsSelected.toSet().size === pageTotal}
            isManager={isManager}
            entityTitle={entityTitle}
            sortOptions={config.views.list.sorting}
            sortBy={locationQuery.get('sort')}
            sortOrder={locationQuery.get('order')}
            onSortBy={onSortBy}
            onSortOrder={onSortOrder}
            onSelect={onSelect}
            onSelectAll={onSelectAll}
          />
        )}
        <div>
          {entities.size > 0 && entities.map((entity, key) => (
            <EntityListItem
              key={key}
              entity={entity}
              error={errors ? errors.get(entity.get('id')) : null}
              onDismissError={onDismissError}
              isManager={isManager}
              isSelected={isManager && entityIdsSelected.includes(entity.get('id'))}
              onSelect={(checked) => onEntitySelect(entity.get('id'), checked)}
              taxonomies={taxonomies}
              connections={connections}
              config={config}
              onEntityClick={onEntityClick}
              entityPath={entityPath}
              url={url}
              showCode={showCode}
              showValueForAction={showValueForAction}
              inSingleView={inSingleView}
            />
          ))}
        </div>
      </div>
    );
  }
}

EntityListItems.propTypes = {
  config: PropTypes.object,
  entities: PropTypes.instanceOf(List).isRequired,
  taxonomies: PropTypes.instanceOf(Map),
  connections: PropTypes.instanceOf(Map),
  showValueForAction: PropTypes.instanceOf(Map),
  entityIdsSelected: PropTypes.instanceOf(List),
  locationQuery: PropTypes.instanceOf(Map),
  errors: PropTypes.instanceOf(Map),
  onEntityClick: PropTypes.func,
  entityPath: PropTypes.string,
  inSingleView: PropTypes.bool,
  isManager: PropTypes.bool,
  entityTitle: PropTypes.object,
  onEntitySelect: PropTypes.func,
  onSelect: PropTypes.func,
  onSelectAll: PropTypes.func,
  onSortBy: PropTypes.func,
  onSortOrder: PropTypes.func,
  onDismissError: PropTypes.func,
  url: PropTypes.string,
  showCode: PropTypes.bool,
  entitiesTotal: PropTypes.number,
  pageTotal: PropTypes.number,
};

export default EntityListItems;
