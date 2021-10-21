/*
 *
 * CategoryView
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';

import {
  getReferenceField,
  getTitleField,
  getCategoryShortTitleField,
  getStatusField,
  getMetaField,
  getMarkdownField,
  getLinkField,
  getActionConnectionField,
  getActionConnectionGroupsField,
  getActorConnectionField,
  getActorConnectionGroupsField,
  getManagerField,
  getEntityLinkField,
  getTaxonomyFields,
  hasTaxonomyCategories,
  getDateField,
} from 'utils/fields';

import {
  getEntityTitle,
  getEntityTitleTruncated,
  getEntityReference,
} from 'utils/entities';
import { qe } from 'utils/quasi-equals';

import { loadEntitiesIfNeeded, updatePath, closeEntity } from 'containers/App/actions';

import { CONTENT_SINGLE } from 'containers/App/constants';
import { ROUTES } from 'themes/config';

import Loading from 'components/Loading';
import Content from 'components/Content';
import ContentHeader from 'components/ContentHeader';
import EntityView from 'components/EntityView';

import {
  selectReady,
  selectIsUserManager,
  selectActionConnections,
  selectActorConnections,
  selectActiveActortypes,
} from 'containers/App/selectors';


import appMessages from 'containers/App/messages';
import messages from './messages';

import {
  selectViewEntity,
  selectActors,
  selectActions,
  selectTaxonomiesWithCategories,
  selectParentTaxonomy,
  selectChildTaxonomies,
  selectChildActors,
  selectChildActions,
} from './selectors';

import { DEPENDENCIES } from './constants';

export class CategoryView extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  UNSAFE_componentWillMount() {
    this.props.loadEntitiesIfNeeded();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
  }

  getHeaderMainFields = (entity, isManager, parentTaxonomy) => {
    const groups = [];
    groups.push(
      { // fieldGroup
        fields: [
          getReferenceField(entity, isManager),
          getTitleField(entity, isManager),
          getCategoryShortTitleField(entity, isManager),
        ],
      },
    );
    // include parent link
    if (entity.get('category') && parentTaxonomy) {
      groups.push({
        label: appMessages.entities.taxonomies.parent,
        icon: 'categories',
        fields: [getEntityLinkField(entity.get('category'), '/category', '', getEntityTitle(parentTaxonomy))],
      });
    }
    return groups;
  };

  getHeaderAsideFields = (entity, isManager) => {
    const { intl } = this.context;
    const fields = []; // fieldGroups
    if (isManager) {
      fields.push({
        fields: [
          getStatusField(entity),
          getMetaField(entity),
        ],
      });
    }
    if (
      entity.getIn(['taxonomy', 'attributes', 'tags_users'])
      && entity.getIn(['attributes', 'user_only'])
    ) {
      fields.push({
        type: 'dark',
        fields: [{
          type: 'text',
          value: intl.formatMessage(appMessages.textValues.user_only),
          label: appMessages.attributes.user_only,
        }],
      });
    }
    return fields.length > 0 ? fields : null;
  }

  getBodyMainFields = (
    entity,
    actorsByActortype,
    childActorsByActortype,
    actions,
    childActions,
    taxonomies,
    onEntityClick,
    actionConnections,
    actorConnections,
    actortypes,
  ) => {
    const fields = [];
    // own attributes
    fields.push({
      fields: [getMarkdownField(entity, 'description', true)],
    });
    // connections
    if (!entity.getIn(['attributes', 'user_only'])) {
      // actions
      // child categories related actions
      const actionsConnections = [];
      if (childActions) {
        childActions.forEach((tax) => actionsConnections.push(
          getActionConnectionGroupsField(
            tax.get('categories'),
            appMessages.entities.taxonomies[tax.get('id')].single,
            taxonomies,
            actionConnections,
            onEntityClick,
          )
        ));
      } else if (entity.getIn(['taxonomy', 'attributes', 'tags_actions']) && actions) {
        // related actions
        actionsConnections.push(
          getActionConnectionField(
            actions,
            taxonomies,
            actionConnections,
            onEntityClick,
          ),
        );
      }
      fields.push({
        label: appMessages.nav.actionsSuper,
        icon: 'actions',
        fields: actionsConnections,
      });

      // child taxonomies tag actors
      // child categories related actors
      const actorConnectionsLocal = [];
      if (childActorsByActortype) {
        childActorsByActortype.forEach((actors, actortypeid) => {
          const actortype = actortypes.find((type) => qe(type.get('id'), actortypeid));
          const hasResponse = actortype && actortype.getIn(['attributes', 'has_response']);
          actors.forEach((tax) => {
            actorConnectionsLocal.push(
              getActorConnectionGroupsField(
                tax.get('categories'),
                appMessages.entities.taxonomies[tax.get('id')].single,
                taxonomies,
                actorConnections,
                onEntityClick,
                actortypeid,
                hasResponse,
              )
            );
          });
        });
        // related actors
      } else if (entity.getIn(['taxonomy', 'attributes', 'tags_actors']) && actorsByActortype) {
        actorsByActortype.forEach((actors, actortypeid) => {
          const actortype = actortypes.find((type) => qe(type.get('id'), actortypeid));
          const hasResponse = actortype && actortype.getIn(['attributes', 'has_response']);
          actorConnectionsLocal.push(
            getActorConnectionField(
              actors,
              taxonomies,
              actorConnections,
              onEntityClick,
              actortypeid,
              hasResponse,
            ),
          );
        });
      }
      fields.push({
        label: appMessages.nav.actorsSuper,
        icon: 'actors',
        fields: actorConnectionsLocal,
      });
    }
    return fields;
  };

  getBodyAsideFields = (entity, isManager, childTaxonomies) => {
    const fields = [];
    // include children links
    if (childTaxonomies && hasTaxonomyCategories(childTaxonomies)) {
      fields.push({ // fieldGroup
        label: appMessages.entities.taxonomies.children,
        icon: 'categories',
        fields: getTaxonomyFields(childTaxonomies, true),
      });
    }
    const showLink = entity.getIn(['attributes', 'url'])
      && entity.getIn(['attributes', 'url']).trim().length > 0;
    const showDate = entity.getIn(['taxonomy', 'attributes', 'has_date']);
    if (showLink || showDate) {
      fields.push({
        type: 'dark',
        fields: [
          showDate && getDateField(entity, 'date', true),
          showLink && getLinkField(entity),
        ],
      });
    }
    if (isManager && !!entity.getIn(['taxonomy', 'attributes', 'has_manager'])) {
      fields.push({
        type: 'dark',
        fields: [getManagerField(
          entity,
          appMessages.attributes.manager_id.categories,
          appMessages.attributes.manager_id.categoriesEmpty
        )],
      });
    }
    return fields.length > 0 ? fields : null;
  };

  /* eslint-disable react/destructuring-assignment */
  getTaxTitle = (id) => this.context.intl.formatMessage(
    appMessages.entities.taxonomies[id].single
  );
  /* eslint-ensable react/destructuring-assignment */

  render() {
    const { intl } = this.context;
    const {
      viewEntity,
      dataReady,
      isManager,
      actorsByActortype,
      childActorsByActortype,
      actions,
      childActions,
      taxonomies,
      onEntityClick,
      actionConnections,
      actorConnections,
      parentTaxonomy,
      childTaxonomies,
      actortypes,
    } = this.props;
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
            onClick: () => this.props.handleClose(this.props.viewEntity && this.props.viewEntity.getIn(['taxonomy', 'id'])),
          },
        ])
        : buttons.concat([{
          type: 'close',
          onClick: () => this.props.handleClose(this.props.viewEntity && this.props.viewEntity.getIn(['taxonomy', 'id'])),
        }]);
    }

    let pageTitle = intl.formatMessage(messages.pageTitle);
    let metaTitle = pageTitle;
    if (
      viewEntity
      && viewEntity.get('taxonomy')
    ) {
      pageTitle = this.getTaxTitle(viewEntity.getIn(['taxonomy', 'id']));
      const ref = getEntityReference(viewEntity, false);
      metaTitle = ref
        ? `${pageTitle} ${ref}: ${getEntityTitleTruncated(viewEntity)}`
        : `${pageTitle}: ${getEntityTitleTruncated(viewEntity)}`;
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
            icon="categories"
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
                    main: this.getHeaderMainFields(viewEntity, isManager, parentTaxonomy),
                    aside: this.getHeaderAsideFields(viewEntity, isManager),
                  },
                  body: {
                    main: this.getBodyMainFields(
                      viewEntity,
                      actorsByActortype,
                      childActorsByActortype,
                      actions,
                      childActions,
                      taxonomies,
                      onEntityClick,
                      actionConnections,
                      actorConnections,
                      actortypes,
                    ),
                    aside: this.getBodyAsideFields(
                      viewEntity,
                      isManager,
                      childTaxonomies,
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

CategoryView.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  handleEdit: PropTypes.func,
  handleClose: PropTypes.func,
  onEntityClick: PropTypes.func,
  viewEntity: PropTypes.object,
  dataReady: PropTypes.bool,
  params: PropTypes.object,
  isManager: PropTypes.bool,
  parentTaxonomy: PropTypes.object,
  actorsByActortype: PropTypes.object,
  childActorsByActortype: PropTypes.object,
  taxonomies: PropTypes.object,
  childTaxonomies: PropTypes.object,
  actions: PropTypes.object,
  childActions: PropTypes.object,
  actionConnections: PropTypes.object,
  actorConnections: PropTypes.object,
  actortypes: PropTypes.object,
};

CategoryView.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => ({
  isManager: selectIsUserManager(state),
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  viewEntity: selectViewEntity(state, props.params.id),
  actorsByActortype: selectActors(state, props.params.id),
  childActorsByActortype: selectChildActors(state, props.params.id),
  childActions: selectChildActions(state, props.params.id),
  actions: selectActions(state, props.params.id),
  taxonomies: selectTaxonomiesWithCategories(state),
  parentTaxonomy: selectParentTaxonomy(state, props.params.id),
  childTaxonomies: selectChildTaxonomies(state, props.params.id),
  actionConnections: selectActionConnections(state),
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
    handleEdit: (categoryId) => {
      dispatch(updatePath(`${ROUTES.CATEGORIES}${ROUTES.EDIT}/${categoryId}`, { replace: true }));
    },
    handleClose: (taxonomyId) => {
      dispatch(closeEntity(taxonomyId ? `${ROUTES.TAXONOMIES}/${taxonomyId}` : ROUTES.OVERVIEW));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoryView);
