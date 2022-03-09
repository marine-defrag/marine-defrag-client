/*
 *
 * EntityListMain
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Map, List } from 'immutable';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import EntityListSearch from 'components/EntityListSearch';
import PrintOnly from 'components/styled/PrintOnly';
import { sortEntities, getSortOption } from 'utils/sort';
import { filterEntitiesByKeywords } from 'utils/entities';
import EntityListPages from './EntityListPages';

import messages from './messages';

const ListWrapper = styled.div``;

const EntityListSearchWrapper = styled.div`
  padding-top: 1em;
  padding-bottom: 12px;
  @media (min-width: ${(props) => props.theme && props.theme.breakpoints ? props.theme.breakpoints.small : '769px'}) {
    padding-top: 2em;
  }
`;

const ListEntities = styled.div``;

const PrintHintKey = styled(PrintOnly)`
  font-style: italic;
  font-size: ${(props) => props.theme.sizes.print.smaller};
  margin-bottom: 20px;
`;

class EntityListMain extends React.Component { // eslint-disable-line react/prefer-stateless-function
  shouldComponentUpdate(nextProps) {
    if (nextProps.listUpdating) {
      return false;
    }
    if (this.props.listUpdating && !nextProps.listUpdating) {
      return true;
    }
    return this.props.entities !== nextProps.entities
      || this.props.entityIdsSelected !== nextProps.entityIdsSelected
      || this.props.dataReady !== nextProps.dataReady
      || this.props.locationQuery !== nextProps.locationQuery
      || this.props.typeId !== nextProps.typeId
      || this.props.errors !== nextProps.errors;
  }

  render() {
    const {
      config,
      entityTitle,
      isManager,
      isAnalyst,
      taxonomies,
      connections,
      locationQuery,
      entities,
      errors,
      showCode,
      onEntityClick,
      onEntitySelect,
      onEntitySelectAll,
      onPageSelect,
      onPageItemsSelect,
      onSortOrder,
      onSortBy,
      onDismissError,
      entityIdsSelected,
      onSearch,
      sortBy,
      sortOrder,
      columns,
    } = this.props;

    // filter entitities by keyword
    const searchQuery = locationQuery.get('search') || '';
    const searchAttributes = (
      config.views
      && config.views.list
      && config.views.list.search
    ) || ['title'];

    let searchedEntities = entities;

    if (searchQuery.length > 2) {
      searchedEntities = filterEntitiesByKeywords(
        entities,
        searchQuery,
        searchAttributes,
      );
    }
    // sort entities
    const sortOption = config
      && config.views
      && config.views.list
      && getSortOption(config.views.list.sorting, sortBy);
    const sortedEntities = searchedEntities && sortEntities(
      searchedEntities,
      sortOrder || (sortOption ? sortOption.order : 'asc'),
      sortBy || (sortOption ? sortOption.attribute : 'title'),
      sortOption ? sortOption.type : 'string'
    );

    return (
      <>
        <ListEntities>
          <PrintHintKey>
            <FormattedMessage {...messages.printHintKey} />
          </PrintHintKey>
          <EntityListSearchWrapper>
            <EntityListSearch
              searchQuery={searchQuery}
              onSearch={onSearch}
            />
          </EntityListSearchWrapper>
          <ListWrapper ref={this.ScrollTarget}>
            <EntityListPages
              entities={sortedEntities}
              errors={errors}
              onDismissError={onDismissError}
              taxonomies={taxonomies}
              connections={connections}
              entityIdsSelected={entityIdsSelected}
              locationQuery={locationQuery}
              onEntityClick={onEntityClick}
              entityTitle={entityTitle}
              config={config}
              isManager={isManager}
              isAnalyst={isAnalyst}
              onPageItemsSelect={onPageItemsSelect}
              onPageSelect={onPageSelect}
              onEntitySelect={onEntitySelect}
              onEntitySelectAll={onEntitySelectAll}
              onSortBy={onSortBy}
              onSortOrder={onSortOrder}
              showCode={showCode}
              columns={columns}
            />
          </ListWrapper>
        </ListEntities>
      </>
    );
  }
}

EntityListMain.propTypes = {
  entities: PropTypes.instanceOf(List),
  taxonomies: PropTypes.instanceOf(Map),
  connections: PropTypes.instanceOf(Map),
  entityIdsSelected: PropTypes.instanceOf(List),
  locationQuery: PropTypes.instanceOf(Map),
  errors: PropTypes.instanceOf(Map),
  // object/arrays
  config: PropTypes.object,
  columns: PropTypes.array,
  entityTitle: PropTypes.object, // single/plural
  // primitive
  dataReady: PropTypes.bool,
  isManager: PropTypes.bool,
  isAnalyst: PropTypes.bool,
  typeId: PropTypes.string,
  listUpdating: PropTypes.bool,
  showCode: PropTypes.bool,
  // functions
  onGroupSelect: PropTypes.func,
  onSubgroupSelect: PropTypes.func,
  onEntityClick: PropTypes.func.isRequired,
  onEntitySelect: PropTypes.func,
  onEntitySelectAll: PropTypes.func,
  onPageSelect: PropTypes.func.isRequired,
  onPageItemsSelect: PropTypes.func.isRequired,
  onSortOrder: PropTypes.func.isRequired,
  onSortBy: PropTypes.func.isRequired,
  onDismissError: PropTypes.func,
  onSearch: PropTypes.func.isRequired,
  sortBy: PropTypes.string,
  sortOrder: PropTypes.string,
};

export default EntityListMain;
// export default EntityListMain;
