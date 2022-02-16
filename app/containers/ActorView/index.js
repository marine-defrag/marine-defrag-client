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
import { ROUTES, ACTIONTYPES } from 'themes/config';

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
} from 'containers/App/selectors';

import appMessages from 'containers/App/messages';
import messages from './messages';

import {
  selectViewEntity,
  selectViewTaxonomies,
  selectActionsByType,
  selectActionsAsTargetByType,
  selectMembersByType,
  selectAssociationsByType,
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
  } = props;

  useEffect(() => {
    // kick off loading of data
    onLoadData();
  }, []);

  const typeId = viewEntity && viewEntity.getIn(['attributes', 'actortype_id']);
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

  const actiontypesForSubject = subject === 'actors'
    ? actionsByActiontype
    : actionsAsTargetByActiontype;
  const activeActiontypeId = (!actiontypesForSubject || actiontypesForSubject.get(parseInt(viewActiontypeId, 10)))
    ? viewActiontypeId
    : actiontypesForSubject.keySeq().first();
  const activeActiontypeActions = actiontypesForSubject && actiontypesForSubject.get(parseInt(activeActiontypeId, 10));

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
                      <SubjectButton
                        onClick={() => onSetSubject('actors')}
                        active={subject === 'actors'}
                      >
                        <Text size="large">Activities</Text>
                      </SubjectButton>
                      <SubjectButton
                        onClick={() => onSetSubject('targets')}
                        active={subject === 'targets'}
                      >
                        <Text size="large">Targeted by</Text>
                      </SubjectButton>
                    </Box>
                    {(!actiontypesForSubject || actiontypesForSubject.size === 0) && (
                      <Box margin={{ vertical: 'small', horizontal: 'medium' }}>
                        {subject === 'actors' && (
                          <Text>
                            No activities for actor in database
                          </Text>
                        )}
                        {subject === 'targets' && (
                          <Text>
                            Actor not target of any activities in database
                          </Text>
                        )}
                      </Box>
                    )}
                    {actiontypesForSubject && actiontypesForSubject.size > 0 && (
                      <TypeSelectBox
                        direction="row"
                        gap="hair"
                        margin={{ vertical: 'small', horizontal: 'medium' }}
                      >
                        {actiontypesForSubject.entrySeq().map(
                          ([btntypeId]) => (
                            <TypeButton
                              key={btntypeId}
                              onClick={() => onSetActiontype(btntypeId)}
                              active={qe(activeActiontypeId, btntypeId) || actiontypesForSubject.size === 1}
                            >
                              <Text size="small" weight={600}>
                                <FormattedMessage {...appMessages.entities[`actions_${btntypeId}`].plural} />
                              </Text>
                            </TypeButton>
                          )
                        )}
                      </TypeSelectBox>
                    )}
                    {actiontypesForSubject && actiontypesForSubject.size > 0 && (
                      <Box>
                        <FieldGroup
                          group={{
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
  viewTaxonomies: PropTypes.object,
  taxonomies: PropTypes.object,
  actionConnections: PropTypes.object,
  actionsByActiontype: PropTypes.object,
  actionsAsTargetByActiontype: PropTypes.object,
  membersByType: PropTypes.object,
  associationsByType: PropTypes.object,
  params: PropTypes.object,
  isManager: PropTypes.bool,
  intl: intlShape.isRequired,
  subject: PropTypes.string,
  viewActiontypeId: PropTypes.string,
  onSetSubject: PropTypes.func,
  onSetActiontype: PropTypes.func,
};

const mapStateToProps = (state, props) => ({
  isManager: selectIsUserManager(state),
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  viewEntity: selectViewEntity(state, props.params.id),
  viewTaxonomies: selectViewTaxonomies(state, props.params.id),
  taxonomies: selectTaxonomiesWithCategories(state),
  actionsByActiontype: selectActionsByType(state, props.params.id),
  actionsAsTargetByActiontype: selectActionsAsTargetByType(state, props.params.id),
  actionConnections: selectActionConnections(state),
  membersByType: selectMembersByType(state, props.params.id),
  associationsByType: selectAssociationsByType(state, props.params.id),
  subject: selectSubjectQuery(state),
  viewActiontypeId: selectActiontypeQuery(state),
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
