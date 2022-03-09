import React from 'react';
import PropTypes from 'prop-types';
import { Map, List } from 'immutable';
import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableCell,
} from 'grommet';
import EntityListItem from 'components/EntityListItem';
// import EntityListMainHeader from './EntityListMainHeader';
// {!inSingleView && (
//   <EntityListMainHeader
//     selectedTotal={entityIdsSelected && entityIdsSelected.toSet().size}
//     pageTotal={pageTotal}
//     entitiesTotal={entitiesTotal}
//     allSelected={entityIdsSelected && entityIdsSelected.toSet().size === entitiesTotal}
//     allSelectedOnPage={entityIdsSelected && entityIdsSelected.toSet().size === pageTotal}
//     isManager={isManager}
//     entityTitle={entityTitle}
//     sortOptions={config.views.list.sorting}
//     sortBy={locationQuery.get('sort')}
//     sortOrder={locationQuery.get('order')}
//     onSortBy={onSortBy}
//     onSortOrder={onSortOrder}
//     onSelect={onSelect}
//     onSelectAll={onSelectAll}
//   />
// )}
export function EntityListTable({
  entities,
  isManager,
  // pageTotal,
  // entitiesTotal,
  // entityTitle,
  // locationQuery,
  // onSortBy,
  // onSortOrder,
  // onSelect,
  // onSelectAll,
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
  columns,
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map(
            (col) => (
              <TableCell key={col} scope="col" border="bottom">
                {col}
              </TableCell>
            )
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {entities.size > 0 && entities.map((entity, key) => (
          <TableRow key={key}>
            {columns.map((col) => (
              <TableCell key={col} scope="row">
                {col !== 'main' && (
                  <span>{col}</span>
                )}
                {col === 'main' && (
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
                )}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

EntityListTable.propTypes = {
  config: PropTypes.object,
  entities: PropTypes.instanceOf(List).isRequired,
  taxonomies: PropTypes.instanceOf(Map),
  connections: PropTypes.instanceOf(Map),
  showValueForAction: PropTypes.instanceOf(Map),
  entityIdsSelected: PropTypes.instanceOf(List),
  // locationQuery: PropTypes.instanceOf(Map),
  errors: PropTypes.instanceOf(Map),
  onEntityClick: PropTypes.func,
  entityPath: PropTypes.string,
  inSingleView: PropTypes.bool,
  isManager: PropTypes.bool,
  // entityTitle: PropTypes.object,
  onEntitySelect: PropTypes.func,
  // onSelect: PropTypes.func,
  // onSelectAll: PropTypes.func,
  // onSortBy: PropTypes.func,
  // onSortOrder: PropTypes.func,
  onDismissError: PropTypes.func,
  url: PropTypes.string,
  showCode: PropTypes.bool,
  // entitiesTotal: PropTypes.number,
  // pageTotal: PropTypes.number,
  columns: PropTypes.array,
};

export default EntityListTable;
