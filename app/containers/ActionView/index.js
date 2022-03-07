/*
 *
 * ActionView
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
  getDateField,
  getTextField,
  getInfoField,
  getLinkField,
  getNumberField,
  getTaxonomyFields,
  hasTaxonomyCategories,
  getActorConnectionField,
  getActionConnectionField,
  getResourceConnectionField,
} from 'utils/fields';

import qe from 'utils/quasi-equals';
import {
  getEntityTitleTruncated,
  checkActionAttribute,
} from 'utils/entities';

import {
  loadEntitiesIfNeeded,
  updatePath,
  closeEntity,
  setSubject,
} from 'containers/App/actions';

import { CONTENT_SINGLE } from 'containers/App/constants';
import { ROUTES, ACTIONTYPES, FF_ACTIONTYPE } from 'themes/config';

import Loading from 'components/Loading';
import Content from 'components/Content';
import ContentHeader from 'components/ContentHeader';
import Main from 'components/EntityView/Main';
import Aside from 'components/EntityView/Aside';
import ViewWrapper from 'components/EntityView/ViewWrapper';
import ViewPanel from 'components/EntityView/ViewPanel';
import ViewPanelInside from 'components/EntityView/ViewPanelInside';
import FieldGroup from 'components/fields/FieldGroup';
import ButtonDefault from 'components/buttons/ButtonDefault';

import {
  selectReady,
  selectIsUserManager,
  selectActorConnections,
  selectResourceConnections,
  selectTaxonomiesWithCategories,
  selectSubjectQuery,
  selectActiontypes,
} from 'containers/App/selectors';

import appMessages from 'containers/App/messages';
import messages from './messages';

import ActionMap from './ActionMap';
import IndicatorMap from './IndicatorMap';
import {
  selectViewEntity,
  selectViewTaxonomies,
  selectActorsByType,
  selectTargetsByType,
  selectResourcesByType,
  selectChildActions,
  selectParentActions,
} from './selectors';

import { DEPENDENCIES } from './constants';

const SubjectButton = styled((p) => <Button plain {...p} />)`
  padding: 2px 4px;
  border-bottom: 2px solid;
  border-bottom-color: ${({ active }) => active ? 'brand' : 'transparent'};
  background: none;
`;

export function ActionView(props) {
  const {
    viewEntity,
    dataReady,
    isManager,
    taxonomies,
    viewTaxonomies,
    actorsByActortype,
    targetsByActortype,
    resourcesByResourcetype,
    onEntityClick,
    actorConnections,
    resourceConnections,
    children,
    parents,
    onLoadData,
    subject,
    onSetSubject,
    intl,
    handleEdit,
    handleClose,
    params,
    activitytypes,
    handleImportConnection,
  } = props;

  useEffect(() => {
    // kick off loading of data
    onLoadData();
  }, []);

  const typeId = viewEntity && viewEntity.getIn(['attributes', 'measuretype_id']);
  const viewActivitytype = activitytypes && activitytypes.find((type) => qe(type.get('id'), typeId));
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
          onClick: handleEdit,
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
    ? intl.formatMessage(appMessages.entities[`actions_${typeId}`].single)
    : intl.formatMessage(appMessages.entities.actions.single);

  const metaTitle = viewEntity
    ? `${pageTitle}: ${getEntityTitleTruncated(viewEntity)}`
    : `${pageTitle}: ${params.id}`;

  const hasTarget = viewActivitytype && viewActivitytype.getIn(['attributes', 'has_target']);
  const hasMemberOption = !!typeId && !qe(typeId, ACTIONTYPES.NATL);
  const hasMap = !!typeId; // && !qe(typeId, ACTIONTYPES.NATL);
  const viewSubject = hasTarget && subject ? subject : 'actors';

  const actortypesForSubject = !hasTarget || viewSubject === 'actors'
    ? actorsByActortype
    : targetsByActortype;

  let hasLandbasedValue;
  if (viewEntity && checkActionAttribute(typeId, 'has_reference_landbased_ml')) {
    if (
      typeof viewEntity.getIn(['attributes', 'has_reference_landbased_ml']) !== 'undefined'
      && viewEntity.getIn(['attributes', 'has_reference_landbased_ml']) !== null
    ) {
      hasLandbasedValue = intl.formatMessage(
        appMessages.ui.checkAttributeStatuses[
          viewEntity.getIn(['attributes', 'has_reference_landbased_ml']).toString()
        ],
      );
    }
  }
  // check date comment for date spceficity
  const DATE_SPECIFICITIES = ['y', 'm'];
  let dateSpecificity;
  if (
    viewEntity
    && viewEntity.getIn(['attributes', 'date_comment'])
    && DATE_SPECIFICITIES.indexOf(viewEntity.getIn(['attributes', 'date_comment']).trim()) > -1
  ) {
    dateSpecificity = viewEntity.getIn(['attributes', 'date_comment']).trim();
  }
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
                        checkActionAttribute(typeId, 'code', isManager) && getInfoField(
                          'code',
                          viewEntity.getIn(['attributes', 'code']),
                        ),
                        checkActionAttribute(typeId, 'title') && getTitleField(viewEntity),
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
                        checkActionAttribute(typeId, 'description')
                          && getMarkdownField(viewEntity, 'description', true),
                        checkActionAttribute(typeId, 'comment')
                          && !qe(typeId, FF_ACTIONTYPE) // (ab)use for unit
                          && getMarkdownField(viewEntity, 'comment', true),
                        checkActionAttribute(typeId, 'status_comment')
                          && getMarkdownField(viewEntity, 'status_comment', true),
                      ],
                    }}
                  />
                  <FieldGroup
                    group={{
                      fields: [
                        checkActionAttribute(typeId, 'reference_ml')
                          && getMarkdownField(viewEntity, 'reference_ml', true),
                        checkActionAttribute(typeId, 'status_lbs_protocol')
                          && getMarkdownField(viewEntity, 'status_lbs_protocol', true),
                        checkActionAttribute(typeId, 'has_reference_landbased_ml')
                          && getInfoField(
                            'has_reference_landbased_ml',
                            hasLandbasedValue,
                          ),
                        checkActionAttribute(typeId, 'reference_landbased_ml')
                          && getMarkdownField(viewEntity, 'reference_landbased_ml', true),
                      ],
                    }}
                  />
                  <Box>
                    <Box direction="row" gap="small" margin={{ vertical: 'small', horizontal: 'medium' }}>
                      <SubjectButton
                        onClick={() => onSetSubject('actors')}
                        active={viewSubject === 'actors'}
                      >
                        <Text size="large">Actors</Text>
                      </SubjectButton>
                      {hasTarget && (
                        <SubjectButton
                          onClick={() => onSetSubject('targets')}
                          active={viewSubject === 'targets'}
                        >
                          <Text size="large">Targets</Text>
                        </SubjectButton>
                      )}
                    </Box>
                    {(!actortypesForSubject || actortypesForSubject.size === 0) && (
                      <Box margin={{ vertical: 'small', horizontal: 'medium' }}>
                        {viewSubject === 'actors' && (
                          <Text>
                            No actors for activity in database
                          </Text>
                        )}
                        {viewSubject === 'targets' && (
                          <Text>
                            No activity targets in database
                          </Text>
                        )}
                      </Box>
                    )}
                    <Box>
                      {dataReady && actortypesForSubject && hasMap && !qe(typeId, FF_ACTIONTYPE) && (
                        <ActionMap
                          entities={actortypesForSubject}
                          mapSubject={viewSubject}
                          onEntityClick={(id) => onEntityClick(id, ROUTES.ACTOR)}
                          hasMemberOption={hasMemberOption}
                        />
                      )}
                      {dataReady && actortypesForSubject && hasMap && qe(typeId, FF_ACTIONTYPE) && (
                        <IndicatorMap
                          entities={actortypesForSubject}
                          mapSubject="actors"
                          onEntityClick={(id) => onEntityClick(id, ROUTES.ACTOR)}
                          indicator={viewEntity}
                        />
                      )}
                      {viewSubject === 'targets' && hasTarget && (
                        <FieldGroup
                          group={{
                            fields: [
                              checkActionAttribute(typeId, 'target_comment')
                                && getMarkdownField(viewEntity, 'target_comment', true),
                            ],
                          }}
                        />
                      )}
                      {actortypesForSubject && (
                        <FieldGroup
                          group={{
                            fields: actortypesForSubject.reduce(
                              (memo, actors, typeid) => memo.concat([
                                getActorConnectionField({
                                  actors,
                                  taxonomies,
                                  onEntityClick,
                                  connections: actorConnections,
                                  typeid,
                                  showValueForAction: qe(typeId, FF_ACTIONTYPE)
                                    ? viewEntity
                                    : null,
                                }),
                              ]),
                              [],
                            ),
                          }}
                        />
                      )}
                      {isManager && qe(typeId, FF_ACTIONTYPE) && (
                        <Box
                          margin={{ bottom: 'large', horizontal: 'medium' }}
                          fill={false}
                          alignContent="start"
                          direction="row"
                        >
                          <ButtonDefault
                            onClick={() => handleImportConnection()}
                          >
                            Import actor connections
                          </ButtonDefault>
                        </Box>
                      )}
                      {resourcesByResourcetype && (
                        <FieldGroup
                          group={{
                            type: 'dark',
                            label: appMessages.nav.resources,
                            fields: resourcesByResourcetype.reduce(
                              (memo, resources, resourcetypeid) => memo.concat([
                                getResourceConnectionField({
                                  resources,
                                  taxonomies,
                                  onEntityClick,
                                  connections: resourceConnections,
                                  typeid: resourcetypeid,
                                }),
                              ]),
                              [],
                            ),
                          }}
                        />
                      )}
                    </Box>
                  </Box>
                </Main>
                <Aside bottom>
                  <FieldGroup
                    aside
                    group={{
                      fields: [
                        checkActionAttribute(typeId, 'url') && getLinkField(viewEntity),
                      ],
                    }}
                  />
                  <FieldGroup
                    aside
                    group={{
                      type: 'dark',
                      fields: [
                        checkActionAttribute(typeId, 'amount')
                          && getNumberField(viewEntity, 'amount', { unit: 'US$', unitBefore: true }),
                        checkActionAttribute(typeId, 'amount_comment') && getTextField(viewEntity, 'amount_comment'),
                      ],
                    }}
                  />
                  <FieldGroup
                    aside
                    group={{
                      type: 'dark',
                      fields: [
                        checkActionAttribute(typeId, 'date_start')
                          && getDateField(viewEntity, 'date_start', { specificity: dateSpecificity }),
                        checkActionAttribute(typeId, 'date_end')
                          && getDateField(viewEntity, 'date_end', { specificity: dateSpecificity }),
                        !dateSpecificity
                          && checkActionAttribute(typeId, 'date_comment')
                          && getTextField(viewEntity, 'date_comment'),
                      ],
                    }}
                  />
                  {hasTaxonomyCategories(viewTaxonomies) && (
                    <FieldGroup
                      aside
                      group={{
                        label: appMessages.entities.taxonomies.plural,
                        icon: 'categories',
                        fields: getTaxonomyFields(viewTaxonomies),
                      }}
                    />
                  )}
                  {parents && parents.size > 0 && (
                    <FieldGroup
                      aside
                      group={{
                        label: appMessages.entities.actions.parent,
                        fields: [
                          getActionConnectionField({
                            actions: parents.toList(),
                            onEntityClick,
                            typeid: typeId,
                            skipLabel: true,
                          }),
                        ],
                      }}
                    />
                  )}
                  {children && children.size > 0 && (
                    <FieldGroup
                      aside
                      group={{
                        label: appMessages.entities.actions.children,
                        fields: [
                          getActionConnectionField({
                            actions: children.toList(),
                            onEntityClick,
                            typeid: typeId,
                            skipLabel: true,
                          }),
                        ],
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

ActionView.propTypes = {
  viewEntity: PropTypes.object,
  onLoadData: PropTypes.func,
  dataReady: PropTypes.bool,
  handleEdit: PropTypes.func,
  handleClose: PropTypes.func,
  onEntityClick: PropTypes.func,
  isManager: PropTypes.bool,
  viewTaxonomies: PropTypes.object,
  taxonomies: PropTypes.object,
  actorsByActortype: PropTypes.object,
  targetsByActortype: PropTypes.object,
  resourcesByResourcetype: PropTypes.object,
  actorConnections: PropTypes.object,
  resourceConnections: PropTypes.object,
  activitytypes: PropTypes.object,
  params: PropTypes.object,
  children: PropTypes.object,
  parents: PropTypes.object,
  onSetSubject: PropTypes.func,
  handleImportConnection: PropTypes.func,
  intl: intlShape.isRequired,
  subject: PropTypes.string,
};

ActionView.contextTypes = {
  intl: PropTypes.object.isRequired,
};


const mapStateToProps = (state, props) => ({
  isManager: selectIsUserManager(state),
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  viewEntity: selectViewEntity(state, props.params.id),
  viewTaxonomies: selectViewTaxonomies(state, props.params.id),
  taxonomies: selectTaxonomiesWithCategories(state),
  actorsByActortype: selectActorsByType(state, props.params.id),
  resourcesByResourcetype: selectResourcesByType(state, props.params.id),
  targetsByActortype: selectTargetsByType(state, props.params.id),
  actorConnections: selectActorConnections(state),
  resourceConnections: selectResourceConnections(state),
  children: selectChildActions(state, props.params.id),
  parents: selectParentActions(state, props.params.id),
  subject: selectSubjectQuery(state),
  activitytypes: selectActiontypes(state),
});

function mapDispatchToProps(dispatch, props) {
  return {
    onLoadData: () => {
      DEPENDENCIES.forEach((path) => dispatch(loadEntitiesIfNeeded(path)));
    },
    onEntityClick: (id, path) => {
      dispatch(updatePath(`${path}/${id}`));
    },
    handleEdit: () => {
      dispatch(updatePath(`${ROUTES.ACTION}${ROUTES.EDIT}/${props.params.id}`, { replace: true }));
    },
    handleImportConnection: () => {
      dispatch(updatePath(`${ROUTES.ACTOR_ACTIONS}${ROUTES.IMPORT}/${props.params.id}`, { replace: true }));
    },
    handleClose: (typeId) => {
      dispatch(closeEntity(`${ROUTES.ACTIONS}/${typeId}`));
    },
    onSetSubject: (type) => {
      dispatch(setSubject(type));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(ActionView));
