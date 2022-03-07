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

import { CONTENT_LIST, PARAMS } from 'containers/App/constants';

import ContentHeader from 'components/ContentHeader';
// import EntityListSearch from 'components/EntityListSearch';
import PrintOnly from 'components/styled/PrintOnly';

import EntityListGroups from './EntityListGroups';

import EntityListOptions from './EntityListOptions';
import { getGroupOptions, getGroupValue } from './group-options';
import { groupEntities } from './group-entities';
import messages from './messages';

const ListWrapper = styled.div``;

// const EntityListSearchWrapper = styled.div`
//   padding-bottom: 1em;
//   @media (min-width: ${(props) => props.theme && props.theme.breakpoints ? props.theme.breakpoints.small : '769px'}) {
//     padding-bottom: 2em;
//   }
// `;

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
      onGroupSelect,
      onSubgroupSelect,
      taxonomies,
      connections,
      connectedTaxonomies,
      locationQuery,
      entities,
      errors,
      actortypes,
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
      header,
      hasFilters,
      hasViewOptions,
      // onSearch,
      // onClearFilters,
    } = this.props;
    const { intl } = this.context;

    let groupSelectValue = locationQuery && locationQuery.get('group');
    if (config.taxonomies && !groupSelectValue) {
      groupSelectValue = getGroupValue(
        taxonomies,
        config.taxonomies.defaultGroupAttribute,
        1,
      );
    }
    let subgroupSelectValue;
    if (groupSelectValue && groupSelectValue !== PARAMS.GROUP_RESET) {
      subgroupSelectValue = locationQuery.get('subgroup');
    }

    // group all entities, regardless of page items
    const entityGroups = groupSelectValue
      && taxonomies
      && taxonomies.get(groupSelectValue)
      && groupSelectValue !== PARAMS.GROUP_RESET
      ? groupEntities(
        entities,
        taxonomies,
        connectedTaxonomies,
        config,
        groupSelectValue,
        subgroupSelectValue !== PARAMS.GROUP_RESET && subgroupSelectValue,
        intl || null,
        actortypes,
      )
      : null;
    let headerTitle;
    if (entityTitle) {
      headerTitle = entities
        ? `${entities.size} ${entities.size === 1 ? entityTitle.single : entityTitle.plural}`
        : entityTitle.plural;
    }
    if (hasFilters) {
      headerTitle = `${headerTitle} (filtered)`;
    }

    // <EntityListSearchWrapper>
    // <EntityListSearch
    // searchQuery={locationQuery.get('search') || ''}
    // onSearch={onSearch}
    // onClear={onClearFilters}
    // />
    // </EntityListSearchWrapper>
    return (
      <>
        {entityTitle && (
          <ContentHeader
            type={CONTENT_LIST}
            title={headerTitle}
            buttons={header && header.actions}
            hasViewOptions={hasViewOptions}
          />
        )}
        <ListEntities>
          <PrintHintKey>
            <FormattedMessage {...messages.printHintKey} />
          </PrintHintKey>
          <EntityListOptions
            groupOptions={getGroupOptions(taxonomies, intl)}
            subgroupOptions={getGroupOptions(taxonomies, intl)}
            groupSelectValue={(taxonomies && taxonomies.get(groupSelectValue)) ? groupSelectValue : ''}
            subgroupSelectValue={(taxonomies && taxonomies.get(subgroupSelectValue)) ? subgroupSelectValue : ''}
            onGroupSelect={onGroupSelect}
            onSubgroupSelect={onSubgroupSelect}
          />
          <ListWrapper ref={this.ScrollTarget}>
            <EntityListGroups
              entities={entities}
              errors={errors}
              onDismissError={onDismissError}
              entityGroups={entityGroups}
              taxonomies={taxonomies}
              connections={connections}
              entityIdsSelected={entityIdsSelected}
              locationQuery={locationQuery}
              groupSelectValue={(taxonomies && taxonomies.get(groupSelectValue)) ? groupSelectValue : ''}
              subgroupSelectValue={(taxonomies && taxonomies.get(subgroupSelectValue)) ? subgroupSelectValue : ''}
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
  actortypes: PropTypes.instanceOf(Map),
  connections: PropTypes.instanceOf(Map),
  connectedTaxonomies: PropTypes.instanceOf(Map),
  entityIdsSelected: PropTypes.instanceOf(List),
  locationQuery: PropTypes.instanceOf(Map),
  errors: PropTypes.instanceOf(Map),
  // object/arrays
  config: PropTypes.object,
  entityTitle: PropTypes.object, // single/plural
  header: PropTypes.object,
  // primitive
  dataReady: PropTypes.bool,
  isManager: PropTypes.bool,
  isAnalyst: PropTypes.bool,
  typeId: PropTypes.string,
  listUpdating: PropTypes.bool,
  showCode: PropTypes.bool,
  hasFilters: PropTypes.bool,
  hasViewOptions: PropTypes.bool,
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
  // onSearch: PropTypes.func.isRequired,
  // onClearFilters: PropTypes.func.isRequired,
};

EntityListMain.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default EntityListMain;
// export default EntityListMain;
