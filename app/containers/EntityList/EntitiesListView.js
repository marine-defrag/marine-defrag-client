/*
 *
 * EntitiesListView
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Map, List } from 'immutable';
import { Box, Text } from 'grommet';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';

import {
  ROUTES, ACTORTYPES, API, ACTIONTYPE_ACTORTYPES, ACTIONTYPE_TARGETTYPES,
} from 'themes/config';
import { CONTENT_LIST } from 'containers/App/constants';
import { jumpToComponent } from 'utils/scroll-to-component';
import ContainerWrapper from 'components/styled/Container/ContainerWrapper';
import Container from 'components/styled/Container';
import Content from 'components/styled/Content';
import Loading from 'components/Loading';
import EntityListViewOptions from 'components/EntityListViewOptions';
import EntityListMain from 'components/EntityListMain';
import MapSubjectOptions from 'containers/MapContainer/MapInfoOptions/MapSubjectOptions';
import MapMemberOption from 'containers/MapContainer/MapInfoOptions/MapMemberOption';
import ButtonPill from 'components/buttons/ButtonPill';

import ContentHeader from 'components/ContentHeader';
import qe from 'utils/quasi-equals';
import appMessages from 'containers/App/messages';

import { getActorsForEntities } from './utils';

class EntitiesListView extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.ScrollContainer = React.createRef();
    this.ScrollTarget = React.createRef();
    this.ScrollReference = React.createRef();
    this.state = {
      viewType: ACTORTYPES.COUNTRY,
    };
  }

  scrollToTop = () => {
    jumpToComponent(
      this.ScrollTarget.current,
      this.ScrollReference.current,
      this.ScrollContainer.current
    );
  }

  setType = (type) => {
    this.setState({ viewType: type });
  }

  render() {
    const {
      config,
      header,
      entityTitle,
      dataReady,
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
      hasHeader,
      viewOptions,
      hasFilters,
      showCode,
      entityIdsSelected,
      listUpdating,
      onEntityClick,
      onEntitySelect,
      onEntitySelectAll,
      onPageSelect,
      onPageItemsSelect,
      onSortOrder,
      onSortBy,
      onDismissError,
      typeId,
      mapSubject,
      onSetMapSubject,
      onSetIncludeActorMembers,
      onSetIncludeTargetMembers,
      includeActorMembers,
      includeTargetMembers,
      actiontypes,
      intl,
      onSearch,
      sortBy,
      sortOrder,
    } = this.props;
    const { viewType } = this.state;
    let type;
    let hasByTarget;
    let subjectOptions;
    let memberOption;
    let entityActors;
    let mapSubjectClean;
    const hasSubjectOptions = config.types === 'actiontypes';
    if (hasSubjectOptions && dataReady) {
      type = actiontypes.find((at) => qe(at.get('id'), typeId));
      hasByTarget = type.getIn(['attributes', 'has_target']);
      if (hasByTarget || mapSubject !== 'targets') {
        mapSubjectClean = mapSubject;
      }
      subjectOptions = [
        {
          type: 'secondary',
          title: 'Activities',
          onClick: () => onSetMapSubject(),
          active: !mapSubjectClean,
          disabled: !mapSubjectClean,
        },
        {
          type: 'secondary',
          title: 'By actor',
          onClick: () => onSetMapSubject('actors'),
          active: mapSubjectClean === 'actors',
          disabled: mapSubjectClean === 'actors',
        },
      ];
      if (hasByTarget) {
        subjectOptions = [
          ...subjectOptions,
          {
            type: 'secondary',
            title: 'By target',
            onClick: () => onSetMapSubject('targets'),
            active: mapSubjectClean === 'targets',
            disabled: mapSubjectClean === 'targets',
          },
        ];
      }
      if (mapSubjectClean === 'targets' && qe(viewType, ACTORTYPES.COUNTRY)) {
        memberOption = {
          active: includeTargetMembers,
          onClick: () => onSetIncludeTargetMembers(includeTargetMembers ? '0' : '1'),
          label: 'Include activities targeting regions, intergovernmental organisations and classes (countries belong to)',
        };
      } else if (mapSubjectClean === 'actors' && qe(viewType, ACTORTYPES.COUNTRY)) {
        memberOption = {
          active: includeActorMembers,
          onClick: () => onSetIncludeActorMembers(includeActorMembers ? '0' : '1'),
          label: 'Include activities of intergovernmental organisations (countries belong to)',
        };
      }
      entityActors = mapSubject && config.types === 'actiontypes' && getActorsForEntities(
        entities,
        connections && connections.get('actors'),
        mapSubject,
        mapSubject === 'actors'
          ? includeActorMembers
          : includeTargetMembers,
      );
      entityActors = entityActors && entityActors.groupBy(
        (actor) => actor.getIn(['attributes', 'actortype_id'])
      );
    } else {
      mapSubjectClean = null;
    }
    let headerTitle;
    if (entityTitle) {
      headerTitle = entities
        ? `${entities.size} ${entities.size === 1 ? entityTitle.single : entityTitle.plural}`
        : entityTitle.plural;
    }
    if (hasFilters) {
      headerTitle = `${headerTitle} (filtered)`;
    }
    return (
      <ContainerWrapper hasHeader={hasHeader} ref={this.ScrollContainer}>
        {dataReady && viewOptions && viewOptions.length > 1 && (
          <EntityListViewOptions options={viewOptions} />
        )}
        <Container ref={this.ScrollReference}>
          <Content>
            {!dataReady && <Loading />}
            {dataReady && (
              <div>
                <ContentHeader
                  type={CONTENT_LIST}
                  title={headerTitle}
                  buttons={header && header.actions}
                  hasViewOptions={viewOptions && viewOptions.length > 1}
                />
                {dataReady && hasSubjectOptions && (
                  <Box>
                    {subjectOptions && (
                      <MapSubjectOptions options={subjectOptions} />
                    )}
                  </Box>
                )}
                {dataReady && entityActors && (
                  <Box>
                    <Box direction="row" gap="xsmall" margin={{ vertical: 'small' }}>
                      {mapSubject === 'actors'
                        && ACTIONTYPE_ACTORTYPES[typeId].length > 1
                        && ACTIONTYPE_ACTORTYPES[typeId].map(
                          (actortypeId) => (
                            <ButtonPill
                              key={actortypeId}
                              onClick={() => this.setType(actortypeId)}
                              active={qe(viewType, actortypeId)}
                            >
                              <Text size="small">
                                <FormattedMessage {...appMessages.entities[`actors_${actortypeId}`].pluralShort} />
                              </Text>
                            </ButtonPill>
                          )
                        )}
                      {mapSubject === 'targets'
                        && ACTIONTYPE_TARGETTYPES[typeId].length > 1
                        && ACTIONTYPE_TARGETTYPES[typeId].map(
                          (actortypeId) => (
                            <ButtonPill
                              key={actortypeId}
                              onClick={() => this.setType(actortypeId)}
                              active={qe(viewType, actortypeId)}
                            >
                              <Text size="small">
                                <FormattedMessage {...appMessages.entities[`actors_${actortypeId}`].pluralShort} />
                              </Text>
                            </ButtonPill>
                          )
                        )}
                    </Box>
                    {memberOption && (
                      <Box>
                        <MapMemberOption option={memberOption} />
                      </Box>
                    )}
                    {entityActors.get(parseInt(viewType, 10)) && (
                      <EntityListMain
                        entities={entityActors.get(parseInt(viewType, 10))}
                        entityPath={ROUTES.ACTOR}
                        onEntityClick={onEntityClick}
                        entityTitle={{
                          single: intl.formatMessage(appMessages.entities[`actors_${viewType}`].single),
                          plural: intl.formatMessage(appMessages.entities[`actors_${viewType}`].plural),
                        }}
                        onPageItemsSelect={(no) => {
                          this.scrollToTop();
                          onPageItemsSelect(no);
                        }}
                        onPageSelect={(page) => {
                          this.scrollToTop();
                          onPageSelect(page);
                        }}
                        config={{
                          types: 'actortypes',
                          clientPath: ROUTES.ACTOR,
                          views: {
                            list: {
                              search: ['code', 'title', 'description'],
                              sorting: [
                                {
                                  attribute: 'title',
                                  type: 'string',
                                  order: 'asc',
                                  default: true,
                                },
                                {
                                  attribute: 'code',
                                  type: 'string',
                                  order: 'asc',
                                },
                                {
                                  attribute: 'updated_at',
                                  type: 'date',
                                  order: 'desc',
                                },
                                {
                                  attribute: 'id', // proxy for created at
                                  type: 'number',
                                  order: 'desc',
                                },
                              ],
                            },
                          },
                          connections: {
                            actions: { // filter by associated entity
                              entityType: 'actions', // filter by actor connection
                              path: API.ACTIONS, // filter by actor connection
                              clientPath: ROUTES.ACTION,
                              actionTypeId: typeId,
                            },
                            actionsMembers: { // filter by associated entity
                              entityType: 'actions', // filter by actor connection
                              entityTypeAs: 'actionsMembers',
                              path: API.ACTIONS, // filter by actor connection
                              clientPath: ROUTES.ACTION,
                              actionTypeId: typeId,
                            },
                            targets: { // filter by associated entity
                              entityType: 'actions', // filter by actor connection
                              entityTypeAs: 'targetingActions',
                              path: API.ACTIONS, // filter by actor connection
                              clientPath: ROUTES.ACTION,
                              actionTypeId: typeId,
                            },
                            targetsMembers: { // filter by associated entity
                              entityType: 'actions', // filter by actor connection
                              entityTypeAs: 'targetingActionsAsMember',
                              path: API.ACTIONS, // filter by actor connection
                              clientPath: ROUTES.ACTION,
                              actionTypeId: typeId,
                            },
                          },
                        }}
                        onSortBy={onSortBy}
                        onSortOrder={onSortOrder}
                        locationQuery={locationQuery}
                        onSearch={onSearch}
                        sortBy={sortBy}
                        sortOrder={sortOrder}
                        connections={connections}
                      />
                    )}
                  </Box>
                )}
                {dataReady && !mapSubjectClean && (
                  <EntityListMain
                    listUpdating={listUpdating}
                    entities={entities}
                    errors={errors}
                    taxonomies={taxonomies}
                    actortypes={actortypes}
                    connections={connections}
                    connectedTaxonomies={connectedTaxonomies}
                    entityIdsSelected={entityIdsSelected}
                    locationQuery={locationQuery}

                    config={config}
                    entityTitle={entityTitle}

                    dataReady={dataReady}
                    isManager={isManager}
                    isAnalyst={isAnalyst}

                    onEntitySelect={onEntitySelect}
                    onEntitySelectAll={onEntitySelectAll}
                    onGroupSelect={onGroupSelect}
                    onSubgroupSelect={onSubgroupSelect}
                    onPageItemsSelect={(no) => {
                      this.scrollToTop();
                      onPageItemsSelect(no);
                    }}
                    onPageSelect={(page) => {
                      this.scrollToTop();
                      onPageSelect(page);
                    }}
                    onEntityClick={onEntityClick}
                    onSortBy={onSortBy}
                    onSortOrder={onSortOrder}
                    onDismissError={onDismissError}
                    typeId={typeId}
                    showCode={showCode}
                    onSearch={onSearch}
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                  />
                )}
              </div>
            )}
          </Content>
        </Container>
      </ContainerWrapper>
    );
  }
}

EntitiesListView.propTypes = {
  entities: PropTypes.instanceOf(List),
  taxonomies: PropTypes.instanceOf(Map),
  actortypes: PropTypes.instanceOf(Map),
  actiontypes: PropTypes.instanceOf(Map),
  targettypes: PropTypes.instanceOf(Map),
  connections: PropTypes.instanceOf(Map),
  connectedTaxonomies: PropTypes.instanceOf(Map),
  entityIdsSelected: PropTypes.instanceOf(List),
  locationQuery: PropTypes.instanceOf(Map),
  errors: PropTypes.instanceOf(Map),
  // object/arrays
  config: PropTypes.object,
  header: PropTypes.object,
  viewOptions: PropTypes.array,
  entityTitle: PropTypes.object, // single/plural
  intl: intlShape.isRequired,
  // primitive
  dataReady: PropTypes.bool,
  isManager: PropTypes.bool,
  isAnalyst: PropTypes.bool,
  includeActorMembers: PropTypes.bool,
  includeTargetMembers: PropTypes.bool,
  listUpdating: PropTypes.bool,
  hasHeader: PropTypes.bool,
  hasFilters: PropTypes.bool,
  typeId: PropTypes.string,
  showCode: PropTypes.bool,
  mapSubject: PropTypes.string,
  sortBy: PropTypes.string,
  sortOrder: PropTypes.string,
  // functions
  onEntityClick: PropTypes.func.isRequired,
  onEntitySelect: PropTypes.func.isRequired,
  onEntitySelectAll: PropTypes.func.isRequired,
  onGroupSelect: PropTypes.func.isRequired,
  onSubgroupSelect: PropTypes.func.isRequired,
  onPageSelect: PropTypes.func.isRequired,
  onPageItemsSelect: PropTypes.func.isRequired,
  onSortOrder: PropTypes.func.isRequired,
  onSortBy: PropTypes.func.isRequired,
  onDismissError: PropTypes.func.isRequired,
  onSetMapSubject: PropTypes.func,
  onSetIncludeActorMembers: PropTypes.func,
  onSetIncludeTargetMembers: PropTypes.func,
  onSearch: PropTypes.func,
};

export default injectIntl(EntitiesListView);
// export default EntitiesListView;
