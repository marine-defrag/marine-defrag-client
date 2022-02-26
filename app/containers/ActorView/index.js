/*
 *
 * ActorView
 *
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { Map, List } from 'immutable';
import { Box, Text, Button } from 'grommet';
import styled from 'styled-components';

import {
  getTitleField,
  getStatusField,
  getMetaField,
  getMarkdownField,
  getTextField,
  getInfoField,
  getLinkField,
  getAmountField,
  getTaxonomyFields,
  hasTaxonomyCategories,
  getActionConnectionField,
  getActorConnectionField,
} from 'utils/fields';
import qe from 'utils/quasi-equals';

import { getEntityTitleTruncated, checkActorAttribute } from 'utils/entities';

import {
  loadEntitiesIfNeeded,
  updatePath,
  closeEntity,
  setSubject,
  setActiontype,
} from 'containers/App/actions';

import { CONTENT_SINGLE } from 'containers/App/constants';
import { ROUTES, ACTIONTYPES, ACTORTYPES } from 'themes/config';

import Loading from 'components/Loading';
import Content from 'components/Content';
import ContentHeader from 'components/ContentHeader';
// import EntityView from 'components/EntityView';
import Main from 'components/EntityView/Main';
import Aside from 'components/EntityView/Aside';
import ViewWrapper from 'components/EntityView/ViewWrapper';
import ViewPanel from 'components/EntityView/ViewPanel';
import ViewPanelInside from 'components/EntityView/ViewPanelInside';
import FieldGroup from 'components/fields/FieldGroup';

import {
  selectReady,
  selectIsUserManager,
  selectTaxonomiesWithCategories,
  selectActionConnections,
  selectSubjectQuery,
  selectActiontypeQuery,
  selectActortypes,
  selectActiontypes,
} from 'containers/App/selectors';

import appMessages from 'containers/App/messages';
import messages from './messages';
import ActorMap from './ActorMap';

import {
  selectViewEntity,
  selectViewTaxonomies,
  selectActionsByType,
  selectActionsAsTargetByType,
  selectMembersByType,
  selectAssociationsByType,
  selectActionsAsMemberByActortype,
  selectActionsAsTargetAsMemberByActortype,
} from './selectors';

import { DEPENDENCIES } from './constants';

const TypeSelectBox = styled((p) => <Box {...p} />)`
  background: ${({ theme }) => theme.palette.light[0]};
`;
const TypeButton = styled((p) => <Button {...p} />)`
  background: ${({ active, theme }) => active ? theme.palette.primary[0] : theme.palette.light[0]};
  color: ${({ active, theme }) => active ? 'white' : theme.palette.dark[3]};
  padding: 4px 10px;
  text-align: center;
  max-width: ${100 / Object.keys(ACTIONTYPES).length}%;
  min-height: 56px;
  border-right: 1px solid white;
`;
const SubjectButton = styled((p) => <Button plain {...p} />)`
  padding: 2px 4px;
  border-bottom: 2px solid;
  border-bottom-color: ${({ active }) => active ? 'brand' : 'transparent'};
  background: none;
`;

export function ActorView(props) {
  const {
    intl,
    viewEntity,
    dataReady,
    isManager,
    onLoadData,
    params,
    handleEdit,
    handleClose,
    viewTaxonomies,
    associationsByType,
    taxonomies,
    onEntityClick,
    actionConnections,
    subject,
    onSetSubject,
    onSetActiontype,
    viewActiontypeId,
    actionsByActiontype,
    actionsAsTargetByActiontype,
    membersByType,
    actortypes,
    actiontypes,
    actionsAsMemberByActortype,
    actionsAsTargetAsMemberByActortype,
  } = props;

  useEffect(() => {
    // kick off loading of data
    onLoadData();
  }, []);

  const typeId = viewEntity && viewEntity.getIn(['attributes', 'actortype_id']);
  const viewActortype = actortypes && actortypes.find((type) => qe(type.get('id'), typeId));

  let buttons = [];
  if (dataReady) {
    buttons.push({
      type: 'icon',
      onClick: () => window.print(),
      title: 'Print',
      icon: 'print',
    });
    buttons = isManager
      ? buttons.concat([
        {
          type: 'edit',
          onClick: () => handleEdit(params.id),
        },
        {
          type: 'close',
          onClick: () => handleClose(typeId),
        },
      ])
      : buttons.concat([{
        type: 'close',
        onClick: () => handleClose(typeId),
      }]);
  }
  const pageTitle = typeId
    ? intl.formatMessage(appMessages.entities[`actors_${typeId}`].single)
    : intl.formatMessage(appMessages.entities.actors.single);

  const metaTitle = viewEntity
    ? `${pageTitle}: ${getEntityTitleTruncated(viewEntity)}`
    : `${pageTitle}: ${params.id}`;

  const isTarget = viewActortype && viewActortype.getIn(['attributes', 'is_target']);
  const isActive = viewActortype && viewActortype.getIn(['attributes', 'is_active']);
  const canBeMember = viewActortype && !viewActortype.getIn(['attributes', 'has_members']);

  let viewSubject = subject;
  if (!isTarget) {
    viewSubject = 'actors';
  }
  if (!isActive) {
    viewSubject = 'targets';
  }
  // figure out connected action types ##################################################

  // direct actions by type for selected subject
  const actiontypesForSubject = viewSubject === 'actors'
    ? actionsByActiontype
    : actionsAsTargetByActiontype;
  // direct && indirect actiontypeids for selected subject
  let actiontypeIdsForSubjectOptions = actiontypesForSubject && actiontypesForSubject.entrySeq().map(([id]) => id.toString());

  // any indirect actions present for selected subject and type?
  // indirect actions by type for selected subject
  let actiontypesAsMemberByActortypeForSubject;
  let actiontypeIdsAsMemberForSubject;
  let actiontypesAsMemberForSubject;
  if (canBeMember) {
    actiontypesAsMemberByActortypeForSubject = viewSubject === 'actors'
      ? actionsAsMemberByActortype
      : actionsAsTargetAsMemberByActortype;

    // indirect actiontypeids for selected subject
    actiontypeIdsAsMemberForSubject = viewSubject === 'actors'
      ? actiontypesAsMemberByActortypeForSubject.reduce(
        (memo, typeActors) => memo.concat(
          typeActors.reduce(
            (memo2, actor) => memo2.concat(actor.get('actionsByType').keySeq()),
            List(),
          )
        ),
        List(),
      ).toSet()
      : actiontypesAsMemberByActortypeForSubject.reduce(
        (memo, typeActors) => memo.concat(
          typeActors.reduce(
            (memo2, actor) => memo2.concat(actor.get('targetingActionsByType').keySeq()),
            List(),
          )
        ),
        List(),
      ).toSet();
  }

  // concat w/ active types for available tabs
  if (actiontypeIdsAsMemberForSubject) {
    actiontypeIdsForSubjectOptions = actiontypeIdsForSubjectOptions
      ? actiontypeIdsForSubjectOptions.concat(
        actiontypeIdsAsMemberForSubject
      ).toSet()
      : (actiontypeIdsAsMemberForSubject && actiontypeIdsAsMemberForSubject.toSet());
  }

  // figure out active action type #################################################

  // selected actiontype (or first in list when not in list)
  let activeActiontypeId = viewActiontypeId;
  if (!actiontypeIdsForSubjectOptions.includes(viewActiontypeId.toString())) {
    activeActiontypeId = actiontypeIdsForSubjectOptions.first();
  }

  // figure out actions for active action type #################################################

  // direct actions for selected subject and type
  const activeActiontypeActions = actiontypesForSubject && actiontypesForSubject.get(parseInt(activeActiontypeId, 10));
  if (canBeMember) {
    // figure out inactive action types
    actiontypesAsMemberForSubject = viewSubject === 'actors'
      ? actiontypesAsMemberByActortypeForSubject.reduce(
        (memo, typeActors, id) => {
          const typeActorsForActiveType = typeActors.filter(
            (actor) => actor.get('actionsByType')
              && actor.getIn(['actionsByType', activeActiontypeId])
              && actor.getIn(['actionsByType', activeActiontypeId]).size > 0
          );
          if (typeActorsForActiveType && typeActorsForActiveType.size > 0) {
            return memo.merge(Map().set(id, typeActorsForActiveType));
          }
          return memo;
        },
        Map(),
      )
      : actiontypesAsMemberByActortypeForSubject.reduce(
        (memo, typeActors, id) => {
          const typeActorsForActiveType = typeActors.filter(
            (actor) => actor.get('targetingActionsByType')
              && actor.getIn(['targetingActionsByType', activeActiontypeId])
              && actor.getIn(['targetingActionsByType', activeActiontypeId]).size > 0
          );
          if (typeActorsForActiveType && typeActorsForActiveType.size > 0) {
            return memo.merge(Map().set(id, typeActorsForActiveType));
          }
          return memo;
        },
        Map(),
      );
  }
  // figure out if we have a map and what to show #################################################

  // we have the option to include actions for
  //    actors that can be members (i.e. countries)
  // we can have
  // let mapSubject = false;
  // let hasActivityMap = typeId && qe(typeId, ACTORTYPES.COUNTRY);
  let mapSubject = false;
  const hasMemberOption = activeActiontypeId && !qe(activeActiontypeId, ACTIONTYPES.NATL);
  const hasActivityMap = typeId && qe(typeId, ACTORTYPES.COUNTRY);
  let hasTarget;
  const activeActionType = actiontypes && activeActiontypeId && actiontypes.get(activeActiontypeId.toString());
  if (hasActivityMap) {
    if (viewSubject === 'actors') {
      mapSubject = 'targets';
      hasTarget = activeActionType && activeActionType.getIn(['attributes', 'has_target']);
      // only show target maps
      // hasActivityMap = !qe(activeActiontypeId, ACTIONTYPES.NATL);
    } else if (viewSubject === 'targets') {
      mapSubject = 'actors';
    }
  }

  // console.log(
  //   'actionsByActiontype',
  //   actionsByActiontype && actionsByActiontype.toJS(),
  // )
  // console.log(
  //   'actionsAsTargetByActiontype',
  //   actionsAsTargetByActiontype && actionsAsTargetByActiontype.toJS(),
  // )
  // console.log(
  //   'actionsAsMemberByActortype',
  //   actionsAsMemberByActortype && actionsAsMemberByActortype.toJS(),
  // )
  // console.log(
  //   'actionsAsTargetAsMemberByActortype',
  //   actionsAsTargetAsMemberByActortype && actionsAsTargetAsMemberByActortype.toJS(),
  // )
  // console.log('actiontypesAsMemberForSubject', actiontypesAsMemberForSubject && actiontypesAsMemberForSubject.toJS())
  return (
    <div>
      <Helmet
        title={metaTitle}
        meta={[
          { name: 'description', content: intl.formatMessage(messages.metaDescription) },
        ]}
      />
      <Content>
        <ContentHeader
          title={pageTitle}
          type={CONTENT_SINGLE}
          buttons={buttons}
        />
        { !dataReady
          && <Loading />
        }
        { !viewEntity && dataReady
          && (
            <div>
              <FormattedMessage {...messages.notFound} />
            </div>
          )
        }
        { viewEntity && dataReady && (
          <ViewWrapper>
            <ViewPanel>
              <ViewPanelInside>
                <Main hasAside>
                  <FieldGroup
                    group={{ // fieldGroup
                      fields: [
                        checkActorAttribute(typeId, 'code', isManager) && getInfoField(
                          'code',
                          viewEntity.getIn(['attributes', 'code']),
                        ),
                        checkActorAttribute(typeId, 'title') && getTitleField(viewEntity),
                      ],
                    }}
                  />
                </Main>
                <Aside>
                  <FieldGroup
                    group={{
                      fields: [
                        getStatusField(viewEntity),
                        getMetaField(viewEntity),
                      ],
                    }}
                    aside
                  />
                </Aside>
              </ViewPanelInside>
            </ViewPanel>
            <ViewPanel>
              <ViewPanelInside>
                <Main hasAside bottom>
                  <FieldGroup
                    group={{
                      fields: [
                        checkActorAttribute(typeId, 'description')
                          && getMarkdownField(viewEntity, 'description', true),
                        checkActorAttribute(typeId, 'activity_summary')
                          && getMarkdownField(viewEntity, 'activity_summary', true),
                      ],
                    }}
                  />
                  <Box>
                    <Box direction="row" gap="small" margin={{ vertical: 'small', horizontal: 'medium' }}>
                      {isActive && (
                        <SubjectButton
                          onClick={() => onSetSubject('actors')}
                          active={viewSubject === 'actors'}
                        >
                          <Text size="large">Activities</Text>
                        </SubjectButton>
                      )}
                      {isTarget && (
                        <SubjectButton
                          onClick={() => onSetSubject('targets')}
                          active={viewSubject === 'targets'}
                        >
                          <Text size="large">Targeted by</Text>
                        </SubjectButton>
                      )}
                    </Box>
                    {(!actiontypeIdsForSubjectOptions || actiontypeIdsForSubjectOptions.size === 0) && (
                      <Box margin={{ vertical: 'small', horizontal: 'medium' }}>
                        {viewSubject === 'actors' && (
                          <Text>
                            No activities for actor in database
                          </Text>
                        )}
                        {viewSubject === 'targets' && (
                          <Text>
                            Actor not target of any activities in database
                          </Text>
                        )}
                      </Box>
                    )}
                    {actiontypeIdsForSubjectOptions && actiontypeIdsForSubjectOptions.size > 0 && (
                      <TypeSelectBox
                        direction="row"
                        gap="hair"
                        margin={{ vertical: 'small', horizontal: 'medium' }}
                      >
                        {actiontypeIdsForSubjectOptions.map(
                          (id) => (
                            <TypeButton
                              key={id}
                              onClick={() => onSetActiontype(id)}
                              active={qe(activeActiontypeId, id) || actiontypeIdsForSubjectOptions.size === 1}
                            >
                              <Text size="small" weight={600}>
                                <FormattedMessage {...appMessages.entities[`actions_${id}`].plural} />
                              </Text>
                            </TypeButton>
                          )
                        )}
                      </TypeSelectBox>
                    )}
                    <Box>
                      {dataReady && viewEntity && hasActivityMap && (
                        <ActorMap
                          actor={viewEntity}
                          actions={activeActiontypeActions}
                          actionsAsMember={actiontypesAsMemberForSubject}
                          hasMemberOption={hasMemberOption}
                          viewSubject={viewSubject}
                          mapSubject={mapSubject}
                          actiontypeHasTarget={hasTarget}
                          dataReady={dataReady}
                          onEntityClick={(id) => onEntityClick(id, ROUTES.ACTOR)}
                          actiontypeId={activeActiontypeId}
                        />
                      )}
                    </Box>
                    {actiontypesForSubject && activeActiontypeActions && actiontypesForSubject.size > 0 && (
                      <Box>
                        <FieldGroup
                          group={{
                            title: viewSubject === 'actors' ? 'Individually' : 'Explicitly targeted',
                            fields: [
                              getActionConnectionField({
                                actions: activeActiontypeActions,
                                taxonomies,
                                onEntityClick,
                                connections: actionConnections,
                                typeid: activeActiontypeId,
                              }),
                            ],
                          }}
                        />
                      </Box>
                    )}
                    {canBeMember && actiontypesAsMemberForSubject.entrySeq().map(([actortypeId, typeActors]) => (
                      <Box key={actortypeId}>
                        {typeActors.entrySeq().map(([actorId, actor]) => {
                          const typeLabel = intl.formatMessage(appMessages.entities[`actors_${actortypeId}`].singleShort);
                          const prefix = viewSubject === 'actors' ? 'As member of ' : 'Targeted as member of ';
                          return (
                            <Box key={actorId}>
                              <FieldGroup
                                group={{
                                  title: `${prefix} ${typeLabel}: "${actor.getIn(['attributes', 'title'])}"`,
                                  fields: [
                                    getActionConnectionField({
                                      actions: actor.getIn([viewSubject === 'actors' ? 'actionsByType' : 'targetingActionsByType', activeActiontypeId]),
                                      taxonomies,
                                      onEntityClick,
                                      connections: actionConnections,
                                      typeid: activeActiontypeId,
                                    }),
                                  ],
                                }}
                              />
                            </Box>
                          );
                        })}
                      </Box>
                    ))}
                  </Box>
                </Main>
                <Aside bottom>
                  <FieldGroup
                    aside
                    group={{
                      fields: [
                        checkActorAttribute(typeId, 'url') && getLinkField(viewEntity),
                      ],
                    }}
                  />
                  <FieldGroup
                    aside
                    group={{
                      type: 'dark',
                      fields: [
                        checkActorAttribute(typeId, 'gdp') && getAmountField(viewEntity, 'gdp', true),
                        checkActorAttribute(typeId, 'population') && getTextField(viewEntity, 'population'),
                      ],
                    }}
                  />
                  {hasTaxonomyCategories(viewTaxonomies) && (
                    <FieldGroup
                      aside
                      group={{ // fieldGroup
                        label: appMessages.entities.taxonomies.plural,
                        fields: getTaxonomyFields(viewTaxonomies),
                      }}
                    />
                  )}
                  {associationsByType && (
                    <FieldGroup
                      aside
                      group={{
                        label: appMessages.nav.associations,
                        fields: associationsByType.reduce(
                          (memo, actors, typeid) => memo.concat([
                            getActorConnectionField({
                              actors,
                              onEntityClick,
                              typeid,
                            }),
                          ]),
                          [],
                        ),
                      }}
                    />
                  )}
                  {membersByType && (
                    <FieldGroup
                      aside
                      group={{
                        label: appMessages.nav.members,
                        fields: membersByType.reduce(
                          (memo, actors, typeid) => memo.concat([
                            getActorConnectionField({
                              actors,
                              onEntityClick,
                              typeid,
                            }),
                          ]),
                          [],
                        ),
                      }}
                    />
                  )}
                </Aside>
              </ViewPanelInside>
            </ViewPanel>
          </ViewWrapper>
        )}
      </Content>
    </div>
  );
}

ActorView.propTypes = {
  viewEntity: PropTypes.object,
  onLoadData: PropTypes.func,
  dataReady: PropTypes.bool,
  handleEdit: PropTypes.func,
  handleClose: PropTypes.func,
  onEntityClick: PropTypes.func,
  viewTaxonomies: PropTypes.instanceOf(Map),
  taxonomies: PropTypes.instanceOf(Map),
  actionConnections: PropTypes.instanceOf(Map),
  actionsByActiontype: PropTypes.instanceOf(Map),
  actionsAsTargetByActiontype: PropTypes.instanceOf(Map),
  membersByType: PropTypes.instanceOf(Map),
  associationsByType: PropTypes.instanceOf(Map),
  params: PropTypes.object,
  isManager: PropTypes.bool,
  intl: intlShape.isRequired,
  subject: PropTypes.string,
  viewActiontypeId: PropTypes.string,
  onSetSubject: PropTypes.func,
  onSetActiontype: PropTypes.func,
  actortypes: PropTypes.instanceOf(Map),
  actiontypes: PropTypes.instanceOf(Map),
  actionsAsMemberByActortype: PropTypes.instanceOf(Map),
  actionsAsTargetAsMemberByActortype: PropTypes.instanceOf(Map),
};

const mapStateToProps = (state, props) => ({
  isManager: selectIsUserManager(state),
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  viewEntity: selectViewEntity(state, props.params.id),
  viewTaxonomies: selectViewTaxonomies(state, props.params.id),
  taxonomies: selectTaxonomiesWithCategories(state),
  actionsByActiontype: selectActionsByType(state, props.params.id),
  actionsAsTargetByActiontype: selectActionsAsTargetByType(state, props.params.id),
  actionsAsMemberByActortype: selectActionsAsMemberByActortype(state, props.params.id),
  actionsAsTargetAsMemberByActortype: selectActionsAsTargetAsMemberByActortype(state, props.params.id),
  actionConnections: selectActionConnections(state),
  membersByType: selectMembersByType(state, props.params.id),
  associationsByType: selectAssociationsByType(state, props.params.id),
  subject: selectSubjectQuery(state),
  viewActiontypeId: selectActiontypeQuery(state),
  actortypes: selectActortypes(state),
  actiontypes: selectActiontypes(state),
});

function mapDispatchToProps(dispatch, props) {
  return {
    onLoadData: () => {
      DEPENDENCIES.forEach((path) => dispatch(loadEntitiesIfNeeded(path)));
    },
    handleEdit: () => {
      dispatch(updatePath(`${ROUTES.ACTOR}${ROUTES.EDIT}/${props.params.id}`, { replace: true }));
    },
    handleClose: (typeId) => {
      dispatch(closeEntity(`${ROUTES.ACTORS}/${typeId}`));
    },
    onEntityClick: (id, path) => {
      dispatch(updatePath(`${path}/${id}`));
    },
    onSetSubject: (type) => {
      dispatch(setSubject(type));
    },
    onSetActiontype: (type) => {
      dispatch(setActiontype(type));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(ActorView));
