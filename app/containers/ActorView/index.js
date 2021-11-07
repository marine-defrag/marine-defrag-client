/*
 *
 * ActorView
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';

import {
  getReferenceField,
  getTitleTextField,
  getStatusField,
  getMetaField,
  getMarkdownField,
  getActionConnectionField,
  getTaxonomyFields,
  hasTaxonomyCategories,
} from 'utils/fields';
import { qe } from 'utils/quasi-equals';
import { getEntityTitleTruncated, getEntityReference } from 'utils/entities';

import { loadEntitiesIfNeeded, updatePath, closeEntity } from 'containers/App/actions';

import { CONTENT_SINGLE } from 'containers/App/constants';
import { ROUTES, ACCEPTED_STATUSES } from 'themes/config';

import Loading from 'components/Loading';
import Content from 'components/Content';
import ContentHeader from 'components/ContentHeader';
import EntityView from 'components/EntityView';

import {
  selectReady,
  selectIsUserManager,
  selectActionTaxonomies,
  selectActionConnections,
  selectActiveActortypes,
} from 'containers/App/selectors';

import appMessages from 'containers/App/messages';
import messages from './messages';

import {
  selectViewEntity,
  selectTaxonomies,
  selectActions,
} from './selectors';

import { DEPENDENCIES } from './constants';

export class ActorView extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  // shouldComponentUpdate(nextProps) {
  //   console.log('ActorView.shouldComponentUpdate')
  //   console.log(this.props.viewEntity === nextProps.viewEntity)
  //   console.log(this.props.taxonomies === nextProps.taxonomies)
  //   console.log(this.props.actions === nextProps.actions)
  //   console.log(this.props.dataReady === nextProps.dataReady)
  //   // console.log(isEqual(this.props.locationQuery, nextProps.locationQuery))
  //   // console.log(this.props.locationQuery === nextProps.locationQuery)
  //   // console.log(typeof this.props.scrollContainer !== typeof nextProps.scrollContainer)
  //   return this.props.viewEntity !== nextProps.viewEntity
  //     || this.props.taxonomies !== nextProps.taxonomies
  //     || this.props.dataReady !== nextProps.dataReady
  //     || this.props.actions !== nextProps.actions
  // }
  UNSAFE_componentWillMount() {
    this.props.loadEntitiesIfNeeded();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
  }

  getHeaderMainFields = (entity, isManager) => ([ // fieldGroups
    { // fieldGroup
      fields: [
        getReferenceField(entity, isManager),
        getTitleTextField(entity, isManager),
      ],
    },
  ]);

  getHeaderAsideFields = (entity) => ([
    {
      fields: [
        getStatusField(entity),
        getMetaField(entity),
      ],
    },
  ]);


  getBodyMainFields = (
    entity,
    actions,
    actionTaxonomies,
    actionConnections,
    onEntityClick,
    hasResponse,
  ) => {
    const fields = [];
    // own attributes
    fields.push({
      fields: [
        getMarkdownField(entity, 'description', true),
        hasResponse && getStatusField(
          entity,
          'accepted',
          ACCEPTED_STATUSES,
          appMessages.attributes.accepted,
          false // defaultValue
        ),
        hasResponse && getMarkdownField(entity, 'response', true),
      ],
    });

    // actions
    if (actions) {
      fields.push({
        label: appMessages.nav.actionsSuper,
        icon: 'actions',
        fields: [
          getActionConnectionField(
            actions,
            actionTaxonomies,
            actionConnections,
            onEntityClick,
          ),
        ],
      });
    }
    return fields;
  };

  getBodyAsideFields = (taxonomies) => ([ // fieldGroups
    hasTaxonomyCategories(taxonomies)
      ? { // fieldGroup
        label: appMessages.entities.taxonomies.plural,
        icon: 'categories',
        fields: getTaxonomyFields(taxonomies),
      }
      : null,
  ]);

  render() {
    const { intl } = this.context;
    const {
      viewEntity,
      dataReady,
      isManager,
      actions,
      taxonomies,
      actionTaxonomies,
      actionConnections,
      onEntityClick,
      actortypes,
    } = this.props;
    const actortypeId = viewEntity && viewEntity.getIn(['attributes', 'actortype_id']);
    const type = intl.formatMessage(
      appMessages.entities[actortypeId ? `actors_${actortypeId}` : 'actors'].single
    );

    const currentActortype = dataReady
      && (
        actortypes.find(
          (actortype) => qe(actortype.get('id'), actortypeId)
        )
        || actortypes.first()
      );
    const hasResponse = dataReady
      && currentActortype
      && currentActortype.getIn(['attributes', 'has_response']);
    const hasActions = dataReady
      && currentActortype
      && currentActortype.getIn(['attributes', 'has_actions']);
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
            onClick: () => this.props.handleEdit(this.props.params.id),
          },
          {
            type: 'close',
            onClick: this.props.handleClose,
          },
        ])
        : buttons.concat([{
          type: 'close',
          onClick: this.props.handleClose,
        }]);
    }
    const pageTitle = intl.formatMessage(messages.pageTitle, { type });
    const metaTitle = viewEntity
      ? `${pageTitle} ${getEntityReference(viewEntity)}: ${getEntityTitleTruncated(viewEntity)}`
      : `${pageTitle} ${this.props.params.id}`;

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
            icon={actortypeId ? `actors_${actortypeId}` : 'actors'}
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
          { viewEntity && dataReady
            && (
              <EntityView
                fields={{
                  header: {
                    main: this.getHeaderMainFields(viewEntity, isManager),
                    aside: isManager && this.getHeaderAsideFields(viewEntity, isManager),
                  },
                  body: {
                    main: this.getBodyMainFields(
                      viewEntity,
                      hasActions && actions,
                      actionTaxonomies,
                      actionConnections,
                      onEntityClick,
                      hasResponse,
                    ),
                    aside: this.getBodyAsideFields(taxonomies),
                  },
                }}
              />
            )
          }
        </Content>
      </div>
    );
  }
}

ActorView.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  onEntityClick: PropTypes.func,
  handleEdit: PropTypes.func,
  handleClose: PropTypes.func,
  viewEntity: PropTypes.object,
  dataReady: PropTypes.bool,
  taxonomies: PropTypes.object,
  actionTaxonomies: PropTypes.object,
  actionConnections: PropTypes.object,
  actions: PropTypes.object,
  params: PropTypes.object,
  isManager: PropTypes.bool,
  actortypes: PropTypes.object,
};

ActorView.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => ({
  isManager: selectIsUserManager(state),
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  viewEntity: selectViewEntity(state, props.params.id),
  taxonomies: selectTaxonomies(state, props.params.id),
  actions: selectActions(state, props.params.id),
  actionTaxonomies: selectActionTaxonomies(state),
  actionConnections: selectActionConnections(state),
  actortypes: selectActiveActortypes(state),
});

function mapDispatchToProps(dispatch, props) {
  return {
    loadEntitiesIfNeeded: () => {
      DEPENDENCIES.forEach((path) => dispatch(loadEntitiesIfNeeded(path)));
    },
    handleEdit: () => {
      dispatch(updatePath(`${ROUTES.ACTORS}${ROUTES.EDIT}/${props.params.id}`, { replace: true }));
    },
    handleClose: () => {
      dispatch(closeEntity(ROUTES.ACTORS));
    },
    onEntityClick: (id, path) => {
      dispatch(updatePath(`${path}/${id}`));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ActorView);
