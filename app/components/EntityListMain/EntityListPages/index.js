import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import styled from 'styled-components';

import { Map, List } from 'immutable';

// import { isEqual } from 'lodash/lang';

import Messages from 'components/Messages';

import EntityListItem from 'components/EntityListItem';
import EntityListHeader from '../EntityListHeader';
import EntityListFooter from '../EntityListFooter';

import { getPager } from './pagination';
import messages from './messages';

const ListEntitiesMain = styled.div`
  padding-top: 0.5em;
`;
const ListEntitiesEmpty = styled.div``;

const PAGE_SIZE = 20;
const PAGE_SIZE_MAX = 100;
const FILTERS = ['items', 'page', 'sort', 'order'];
export class EntityListGroups extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  transformMessage = (msg, entityId) => {
    const { intl } = this.context;
    return intl
      ? intl.formatMessage(messages.entityNoLongerPresent, { entityId })
      : msg;
  };

  hasLocationQueryFilters = (locationQuery) => locationQuery.reduce(
    (hasFilters, value, arg) => hasFilters
      || FILTERS.indexOf(arg) === -1,
    false,
  );

  render() {
    // console.log('error EntityListGroups.render')
    const {
      entityIdsSelected,
      config,
      entityIcon,
      onEntityClick,
      isManager,
      onEntitySelect,
      entityTitle,
      onEntitySelectAll,
      locationQuery,
      entities,
      errors,
      showCode,
      taxonomies,
      connections,
      entityPath,
      url,
      showValueForAction,
    } = this.props;
    let pageSize = PAGE_SIZE_MAX;
    if (locationQuery.get('items')) {
      if (locationQuery.get('items') === 'all') {
        pageSize = entities.size;
      } else {
        pageSize = Math.min(
          (locationQuery.get('items') && parseInt(locationQuery.get('items'), 10)),
          PAGE_SIZE_MAX
        );
      }
    } else {
      pageSize = Math.min(PAGE_SIZE, PAGE_SIZE_MAX);
    }
    let entityIdsOnPage;
    let entitiesOnPage = entities;
    let pager;
    // grouping and paging
    // if grouping required
    if (entities.size > pageSize) {
      // get new pager object for specified page
      pager = getPager(
        entities.size,
        locationQuery.get('page') && parseInt(locationQuery.get('page'), 10),
        pageSize
      );
      entitiesOnPage = entities.slice(pager.startIndex, pager.endIndex + 1);
      entityIdsOnPage = entitiesOnPage.map((entity) => entity.get('id'));
    } else {
      // neither grouping nor paging required
      entityIdsOnPage = entities.map((entity) => entity.get('id'));
    }
    const errorsWithoutEntities = errors && errors.filter((error, id) => !entities.find((entity) => entity.get('id') === id));

    return (
      <div>
        <EntityListHeader
          selectedTotal={entityIdsSelected && entityIdsSelected.toSet().size}
          pageTotal={entityIdsOnPage.toSet().size}
          entitiesTotal={entities.size}
          allSelected={entityIdsSelected && entityIdsSelected.toSet().size === entities.size}
          allSelectedOnPage={entityIdsSelected && entityIdsSelected.toSet().size === entityIdsOnPage.toSet().size}
          isManager={isManager}
          entityTitle={entityTitle}
          sortOptions={config.views.list.sorting}
          sortBy={locationQuery.get('sort')}
          sortOrder={locationQuery.get('order')}
          onSortBy={this.props.onSortBy}
          onSortOrder={this.props.onSortOrder}
          onSelect={(checked) => {
            onEntitySelectAll(checked ? entityIdsOnPage.valueSeq().toArray() : []);
          }}
          onSelectAll={() => {
            onEntitySelectAll(
              entities.map((entity) => entity.get('id')).valueSeq().toArray(),
            );
          }}
        />
        <ListEntitiesMain>
          {entitiesOnPage.size > 0 && entitiesOnPage.map((entity, key) => (
            <EntityListItem
              key={key}
              entity={entity}
              error={this.props.errors ? this.props.errors.get(entity.get('id')) : null}
              onDismissError={this.props.onDismissError}
              isManager={isManager}
              isSelected={isManager && entityIdsSelected.includes(entity.get('id'))}
              onSelect={(checked) => onEntitySelect(entity.get('id'), checked)}
              entityIcon={entityIcon}
              taxonomies={taxonomies}
              connections={connections}
              config={config}
              onEntityClick={onEntityClick}
              entityPath={entityPath}
              url={url}
              showCode={showCode}
              showValueForAction={showValueForAction}
            />
          ))}
          { entityIdsOnPage.size === 0 && this.hasLocationQueryFilters(locationQuery) && (!errors || errors.size === 0)
            && (
              <ListEntitiesEmpty>
                <FormattedMessage {...messages.listEmptyAfterQuery} />
              </ListEntitiesEmpty>
            )
          }
          { entityIdsOnPage.size === 0 && !this.hasLocationQueryFilters(locationQuery) && (!errors || errors.size === 0)
            && (
              <ListEntitiesEmpty>
                <FormattedMessage {...messages.listEmpty} />
              </ListEntitiesEmpty>
            )
          }
          { entityIdsOnPage.size === 0 && this.hasLocationQueryFilters(locationQuery)
            && errorsWithoutEntities && errorsWithoutEntities.size > 0
            && errors && errors.size > 0
            && (
              <ListEntitiesEmpty>
                <FormattedMessage {...messages.listEmptyAfterQueryAndErrors} />
              </ListEntitiesEmpty>
            )
          }
          { errorsWithoutEntities && errorsWithoutEntities.size > 0 && !this.hasLocationQueryFilters(locationQuery)
            && errorsWithoutEntities.map((entityErrors, entityId) => (
              entityErrors.map((updateError, i) => (
                <Messages
                  key={i}
                  type="error"
                  messages={updateError
                    .getIn(['error', 'messages'])
                    .map((msg) => this.transformMessage(msg, entityId))
                    .valueSeq()
                    .toArray()
                  }
                  onDismiss={() => this.props.onDismissError(updateError.get('key'))}
                  preMessage={false}
                />
              ))
            )).toList()
          }
        </ListEntitiesMain>
        {entitiesOnPage.size > 0 && (
          <EntityListFooter
            pageSize={locationQuery.get('items') === 'all' ? 'all' : pageSize}
            pager={pager}
            onPageSelect={this.props.onPageSelect}
            onPageItemsSelect={this.props.onPageItemsSelect}
          />
        )}
      </div>
    );
  }
}

EntityListGroups.propTypes = {
  entities: PropTypes.instanceOf(List),
  taxonomies: PropTypes.instanceOf(Map),
  connections: PropTypes.instanceOf(Map),
  entityIdsSelected: PropTypes.instanceOf(List),
  locationQuery: PropTypes.instanceOf(Map),
  errors: PropTypes.instanceOf(Map),
  entityTitle: PropTypes.object,
  config: PropTypes.object,
  entityIcon: PropTypes.func,
  isManager: PropTypes.bool,
  isAnalyst: PropTypes.bool,
  onPageSelect: PropTypes.func.isRequired,
  onPageItemsSelect: PropTypes.func.isRequired,
  onEntityClick: PropTypes.func.isRequired,
  onEntitySelect: PropTypes.func,
  onEntitySelectAll: PropTypes.func,
  onSortBy: PropTypes.func.isRequired,
  onSortOrder: PropTypes.func.isRequired,
  onDismissError: PropTypes.func,
  showCode: PropTypes.bool,
  entityPath: PropTypes.string,
  showValueForAction: PropTypes.instanceOf(Map),
  url: PropTypes.string,
};

EntityListGroups.contextTypes = {
  intl: PropTypes.object,
};


export default EntityListGroups;
