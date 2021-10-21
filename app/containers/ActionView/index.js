/*
 *
 * ActionView
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';

import {
  getTitleField,
  getStatusField,
  getMetaField,
  getMarkdownField,
  getActorConnectionField,
  getTaxonomyFields,
  hasTaxonomyCategories,
  getDateField,
  getTextField,
  getIdField,
} from 'utils/fields';

import { qe } from 'utils/quasi-equals';
import { getEntityTitleTruncated, getEntityReference } from 'utils/entities';

import { loadEntitiesIfNeeded, updatePath, closeEntity } from 'containers/App/actions';

import { CONTENT_SINGLE } from 'containers/App/constants';
import { USER_ROLES, ROUTES } from 'themes/config';

import Loading from 'components/Loading';
import Content from 'components/Content';
import ContentHeader from 'components/ContentHeader';
import EntityView from 'components/EntityView';

import {
  selectReady,
  selectHasUserRole,
  selectActorTaxonomies,
  selectActorConnections,
  selectActiveActortypes,
} from 'containers/App/selectors';

import appMessages from 'containers/App/messages';
import messages from './messages';

import {
  selectViewEntity,
  selectTaxonomies,
  selectActors,
} from './selectors';

import { DEPENDENCIES } from './constants';

export class ActionView extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
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
        getIdField(entity, isManager),
        getTitleField(entity, isManager),
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
    actorsByActortype,
    actorTaxonomies,
    actorConnections,
    actortypes,
    onEntityClick,
  ) => {
    const fields = [];
    // own attributes
    fields.push({
      fields: [
        getMarkdownField(entity, 'description', true),
        // getMarkdownField(entity, 'outcome', true),
      ],
    });

    // actors
    if (actorsByActortype) {
      const actorConnections = [];
      actorsByActortype.forEach((actors, actortypeid) => {
        const actortype = actortypes.find((at) => qe(at.get('id'), actortypeid));
        const hasResponse = actortype && actortype.getIn(['attributes', 'has_response']);
        actorConnections.push(
          getActorConnectionField(
            actors,
            actorTaxonomies,
            actorConnections,
            onEntityClick,
            actortypeid,
            hasResponse,
          ),
        );
      });
      fields.push({
        label: appMessages.nav.actorsSuper,
        icon: 'actors',
        fields: actorConnections,
      });
    }
    return fields;
  };

  getBodyAsideFields = (viewEntity, taxonomies) => {
    const fields = [];
    fields.push({
      type: 'dark',
      fields: [
        getDateField(viewEntity, 'target_date', true),
        getTextField(viewEntity, 'target_date_comment'),
      ],
    });
    if (hasTaxonomyCategories(taxonomies)) {
      fields.push({ // fieldGroup
        label: appMessages.entities.taxonomies.plural,
        icon: 'categories',
        fields: getTaxonomyFields(taxonomies),
      });
    }
    return fields;
  };

  render() {
    const { intl } = this.context;
    const {
      viewEntity,
      dataReady,
      hasUserRole,
      actorsByActortype,
      taxonomies,
      actorTaxonomies,
      onEntityClick,
      actorConnections,
      actortypes,
    } = this.props;
    const isManager = hasUserRole[USER_ROLES.MANAGER.value];
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
    const pageTitle = intl.formatMessage(messages.pageTitle);
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
            icon="actions"
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
                    aside: isManager && this.getHeaderAsideFields(viewEntity),
                  },
                  body: {
                    main: this.getBodyMainFields(
                      viewEntity,
                      actorsByActortype,
                      actorTaxonomies,
                      actorConnections,
                      actortypes,
                      onEntityClick,
                    ),
                    aside: this.getBodyAsideFields(
                      viewEntity,
                      taxonomies,
                    ),
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

ActionView.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  handleEdit: PropTypes.func,
  handleClose: PropTypes.func,
  onEntityClick: PropTypes.func,
  viewEntity: PropTypes.object,
  dataReady: PropTypes.bool,
  hasUserRole: PropTypes.object,
  taxonomies: PropTypes.object,
  actorTaxonomies: PropTypes.object,
  actorsByActortype: PropTypes.object,
  actorConnections: PropTypes.object,
  params: PropTypes.object,
  actortypes: PropTypes.object,
};

ActionView.contextTypes = {
  intl: PropTypes.object.isRequired,
};


const mapStateToProps = (state, props) => ({
  hasUserRole: selectHasUserRole(state),
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  viewEntity: selectViewEntity(state, props.params.id),
  taxonomies: selectTaxonomies(state, props.params.id),
  actorsByActortype: selectActors(state, props.params.id),
  actorTaxonomies: selectActorTaxonomies(state),
  actorConnections: selectActorConnections(state),
  actortypes: selectActiveActortypes(state),
});

function mapDispatchToProps(dispatch) {
  return {
    loadEntitiesIfNeeded: () => {
      DEPENDENCIES.forEach((path) => dispatch(loadEntitiesIfNeeded(path)));
    },
    onEntityClick: (id, path) => {
      dispatch(updatePath(`/${path}/${id}`));
    },
    handleEdit: (actionId) => {
      dispatch(updatePath(`${ROUTES.ACTIONS}${ROUTES.EDIT}/${actionId}`, { replace: true }));
    },
    handleClose: () => {
      dispatch(closeEntity(ROUTES.ACTIONS));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionView);
