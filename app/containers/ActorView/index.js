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
import { Map } from 'immutable';

import {
  getTitleField,
  getStatusField,
  getMetaField,
  getMarkdownField,
  getReferenceField,
  getLinkField,
  getNumberField,
  getTaxonomyFields,
  hasTaxonomyCategories,
  getActorConnectionField,
} from 'utils/fields';
import qe from 'utils/quasi-equals';

import { getEntityTitleTruncated, checkActorAttribute } from 'utils/entities';

import {
  loadEntitiesIfNeeded,
  updatePath,
  closeEntity,
} from 'containers/App/actions';

import { CONTENT_SINGLE } from 'containers/App/constants';
import { ROUTES, ACTORTYPES } from 'themes/config';

import Loading from 'components/Loading';
import Content from 'components/Content';
import ViewHeader from 'components/EntityView/ViewHeader';
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
  selectActorConnections,
} from 'containers/App/selectors';

import appMessages from 'containers/App/messages';
import messages from './messages';
import ActorViewDetails from './ActorViewDetails';
import CountryMap from './CountryMap';

import {
  selectViewEntity,
  selectViewTaxonomies,
  selectAssociationsByType,
} from './selectors';

import { DEPENDENCIES } from './constants';

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
    handleTypeClick,
    viewTaxonomies,
    associationsByType,
    onEntityClick,
    taxonomies,
  } = props;
  useEffect(() => {
    // kick off loading of data
    onLoadData();
  }, []);

  const typeId = viewEntity && viewEntity.getIn(['attributes', 'actortype_id']);

  let buttons = [];
  if (dataReady) {
    buttons = [
      ...buttons,
      {
        type: 'icon',
        onClick: () => window.print(),
        title: 'Print',
        icon: 'print',
      },
    ];
    if (isManager) {
      buttons = [
        ...buttons,
        {
          type: 'edit',
          onClick: handleEdit,
        },
      ];
    }
  }
  const pageTitle = typeId
    ? intl.formatMessage(appMessages.entities[`actors_${typeId}`].single)
    : intl.formatMessage(appMessages.entities.actors.single);

  const metaTitle = viewEntity
    ? `${pageTitle}: ${getEntityTitleTruncated(viewEntity)}`
    : `${pageTitle}: ${params.id}`;

  const isCountry = qe(typeId, ACTORTYPES.COUNTRY);

  return (
    <div>
      <Helmet
        title={metaTitle}
        meta={[
          { name: 'description', content: intl.formatMessage(messages.metaDescription) },
        ]}
      />
      <Content isSingle>
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
            <ViewHeader
              title={typeId
                ? intl.formatMessage(appMessages.actortypes[typeId])
                : intl.formatMessage(appMessages.entities.actors.plural)
              }
              type={CONTENT_SINGLE}
              buttons={buttons}
              onClose={() => handleClose(typeId)}
              onTypeClick={() => handleTypeClick(typeId)}
            />
            <ViewPanel>
              <ViewPanelInside>
                <Main hasAside={isManager}>
                  <FieldGroup
                    group={{ // fieldGroup
                      fields: [
                        checkActorAttribute(typeId, 'code', isManager) && getReferenceField(
                          viewEntity,
                          'code',
                          isManager,
                        ),
                        checkActorAttribute(typeId, 'title') && getTitleField(viewEntity),
                      ],
                    }}
                  />
                </Main>
                {isManager && (
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
                )}
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
                  <ActorViewDetails
                    id={params.id}
                    typeId={typeId}
                    viewEntity={viewEntity}
                    onEntityClick={onEntityClick}
                    taxonomies={taxonomies}
                    isCountry={isCountry}
                  />
                </Main>
                <Aside bottom>
                  {isCountry && (
                    <CountryMap actor={viewEntity} />
                  )}
                  <FieldGroup
                    aside
                    group={{
                      fields: [
                        checkActorAttribute(typeId, 'url')
                          && getLinkField(viewEntity),
                        checkActorAttribute(typeId, 'gdp')
                          && getNumberField(
                            viewEntity,
                            'gdp',
                            {
                              unit: 'US$',
                              unitBefore: true,
                              info: appMessages.attributeInfo.gdp && intl.formatMessage(appMessages.attributeInfo.gdp),
                            },
                          ),
                        checkActorAttribute(typeId, 'population')
                          && getNumberField(
                            viewEntity,
                            'population',
                            {
                              info: appMessages.attributeInfo.population && intl.formatMessage(appMessages.attributeInfo.population),
                            },
                          ),
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
  handleTypeClick: PropTypes.func,
  onEntityClick: PropTypes.func,
  viewTaxonomies: PropTypes.instanceOf(Map),
  taxonomies: PropTypes.instanceOf(Map),
  associationsByType: PropTypes.instanceOf(Map),
  params: PropTypes.object,
  isManager: PropTypes.bool,
  intl: intlShape.isRequired,
};


const mapStateToProps = (state, props) => ({
  isManager: selectIsUserManager(state),
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  viewEntity: selectViewEntity(state, props.params.id),
  viewTaxonomies: selectViewTaxonomies(state, props.params.id),
  taxonomies: selectTaxonomiesWithCategories(state),
  actorConnections: selectActorConnections(state),
  associationsByType: selectAssociationsByType(state, props.params.id),
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
    handleTypeClick: (typeId) => {
      dispatch(updatePath(`${ROUTES.ACTORS}/${typeId}`));
    },
    onEntityClick: (id, path) => {
      dispatch(updatePath(`${path}/${id}`));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(ActorView));
