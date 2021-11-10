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
  // getActionConnectionField,
} from 'utils/fields';
// import { qe } from 'utils/quasi-equals';
import { getEntityTitleTruncated, checkActorAttribute } from 'utils/entities';

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
  // selectActionTaxonomies,
  // selectActionConnections,
  // selectActiveActortypes,
} from 'containers/App/selectors';

import appMessages from 'containers/App/messages';
import messages from './messages';

import {
  selectViewEntity,
  selectTaxonomies,
  // selectActionsWithAssociations,
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

  getHeaderMainFields = (entity) => {
    const { intl } = this.context;
    const typeId = entity.getIn(['attributes', 'actortype_id']);
    return ([ // fieldGroups
      { // fieldGroup
        fields: [
          getInfoField(
            'actortype_id',
            intl.formatMessage(appMessages.actortypes[typeId]),
            true // large
          ), // required
          checkActorAttribute(typeId, 'code') && getInfoField(
            'code',
            entity.getIn(['attributes', 'code']),
          ),
          checkActorAttribute(typeId, 'title') && getTitleField(entity),
        ],
      },
    ]);
  };

  getHeaderAsideFields = (entity, isManager, taxonomies) => {
    const fields = ([
      {
        fields: [
          isManager && getStatusField(entity),
          getMetaField(entity),
        ],
      },
    ]);
    if (hasTaxonomyCategories(taxonomies)) {
      fields.push({ // fieldGroup
        label: appMessages.entities.taxonomies.plural,
        icon: 'categories',
        fields: getTaxonomyFields(taxonomies),
      });
    }
    return fields;
  };

  getBodyMainFields = (
    entity,
    // actions,
    // actionTaxonomies,
    // actionConnections,
    // onEntityClick,
  ) => {
    const fields = [];
    const typeId = entity.getIn(['attributes', 'actortype_id']);

    // own attributes
    fields.push(
      {
        fields: [
          checkActorAttribute(typeId, 'description')
            && getMarkdownField(entity, 'description', true),
          checkActorAttribute(typeId, 'activity_summary')
            && getMarkdownField(entity, 'activity_summary', true),
        ],
      },
    );

    // actions
    // if (actions) {
    //   fields.push({
    //     label: appMessages.nav.actionsSuper,
    //     icon: 'actions',
    //     fields: [
    //       getActionConnectionField(
    //         actions,
    //         actionTaxonomies,
    //         actionConnections,
    //         onEntityClick,
    //       ),
    //     ],
    //   });
    // }
    return fields;
  };

  getBodyAsideFields = (entity) => {
    const fields = [];
    const typeId = entity.getIn(['attributes', 'actortype_id']);
    fields.push(
      {
        fields: [
          checkActorAttribute(typeId, 'url') && getLinkField(entity),
        ],
      },
      {
        type: 'dark',
        fields: [
          checkActorAttribute(typeId, 'gdp') && getAmountField(entity, 'gdp', true),
          checkActorAttribute(typeId, 'population') && getTextField(entity, 'population'),
        ],
      },
    );
    return fields;
  };

  render() {
    const { intl } = this.context;
    const {
      viewEntity,
      dataReady,
      isManager,
      // actions,
      taxonomies,
      // actionTaxonomies,
      // actionConnections,
      // onEntityClick,
      // actortypes,
    } = this.props;
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
            onClick: () => this.props.handleEdit(this.props.params.id),
          },
          {
            type: 'close',
            onClick: () => this.props.handleClose(typeId),
          },
        ])
        : buttons.concat([{
          type: 'close',
          onClick: () => this.props.handleClose(typeId),
        }]);
    }
    const pageTitle = typeId
      ? intl.formatMessage(appMessages.entities[`actors_${typeId}`].single)
      : intl.formatMessage(appMessages.entities.actors.single);

    const metaTitle = viewEntity
      ? `${pageTitle}: ${getEntityTitleTruncated(viewEntity)}`
      : `${pageTitle}: ${this.props.params.id}`;

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
          { viewEntity && dataReady
            && (
              <EntityView
                fields={{
                  header: {
                    main: this.getHeaderMainFields(viewEntity),
                    aside: this.getHeaderAsideFields(viewEntity, isManager, taxonomies),
                  },
                  body: {
                    main: this.getBodyMainFields(
                      viewEntity,
                      // hasActions && actions,
                      // actionTaxonomies,
                      // actionConnections,
                      // onEntityClick,
                      // hasResponse,
                    ),
                    aside: this.getBodyAsideFields(viewEntity),
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
  viewEntity: PropTypes.object,
  loadEntitiesIfNeeded: PropTypes.func,
  dataReady: PropTypes.bool,
  handleEdit: PropTypes.func,
  handleClose: PropTypes.func,
  onEntityClick: PropTypes.func,
  taxonomies: PropTypes.object,
  // actionTaxonomies: PropTypes.object,
  // actionConnections: PropTypes.object,
  // actions: PropTypes.object,
  // actortypes: PropTypes.object,
  params: PropTypes.object,
  isManager: PropTypes.bool,
};

ActorView.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => ({
  isManager: selectIsUserManager(state),
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  viewEntity: selectViewEntity(state, props.params.id),
  taxonomies: selectTaxonomies(state, props.params.id),
  // actions: selectActionsWithAssociations(state, props.params.id),
  // actionTaxonomies: selectActionTaxonomies(state),
  // actionConnections: selectActionConnections(state),
  // actortypes: selectActiveActortypes(state),
});

function mapDispatchToProps(dispatch, props) {
  return {
    loadEntitiesIfNeeded: () => {
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
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ActorView);
