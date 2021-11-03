/*
 *
 * ActionEdit
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { actions as formActions } from 'react-redux-form/immutable';
import { Map, fromJS } from 'immutable';

import {
  taxonomyOptions,
  entityOptions,
  getCategoryUpdatesFromFormData,
  getConnectionUpdatesFromFormData,
  getTitleFormField,
  getStatusField,
  getMarkdownField,
  renderActorsByActortypeControl,
  getDateField,
  getTextareaField,
  renderTaxonomyControl,
} from 'utils/forms';

import {
  getMetaField,
} from 'utils/fields';

import { scrollToTop } from 'utils/scroll-to-component';
import { hasNewError } from 'utils/entity-form';

import { CONTENT_SINGLE } from 'containers/App/constants';
import { USER_ROLES, API, ROUTES } from 'themes/config';

import {
  loadEntitiesIfNeeded,
  redirectIfNotPermitted,
  updatePath,
  updateEntityForm,
  deleteEntity,
  openNewEntityModal,
  submitInvalid,
  saveErrorDismiss,
} from 'containers/App/actions';

import {
  selectReady,
  selectReadyForAuthCheck,
  selectIsUserAdmin,
} from 'containers/App/selectors';

import Messages from 'components/Messages';
import Loading from 'components/Loading';
import Content from 'components/Content';
import ContentHeader from 'components/ContentHeader';
import EntityForm from 'containers/EntityForm';

import appMessages from 'containers/App/messages';

import {
  selectDomain,
  selectViewEntity,
  selectTaxonomies,
  selectActorsByActortype,
  selectConnectedTaxonomies,
} from './selectors';

import messages from './messages';
import { save } from './actions';
import { DEPENDENCIES, FORM_INITIAL } from './constants';

export class ActionEdit extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.scrollContainer = React.createRef();
  }

  UNSAFE_componentWillMount() {
    this.props.loadEntitiesIfNeeded();
    if (this.props.dataReady && this.props.viewEntity) {
      this.props.initialiseForm('actionEdit.form.data', this.getInitialFormData());
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
    // repopulate if new data becomes ready
    if (nextProps.dataReady && !this.props.dataReady && nextProps.viewEntity) {
      this.props.initialiseForm('actionEdit.form.data', this.getInitialFormData(nextProps));
    }
    //
    if (nextProps.authReady && !this.props.authReady) {
      this.props.redirectIfNotPermitted();
    }
    if (hasNewError(nextProps, this.props) && this.scrollContainer) {
      scrollToTop(this.scrollContainer.current);
    }
  }

  getInitialFormData = (nextProps) => {
    const props = nextProps || this.props;
    const {
      viewEntity, taxonomies, actorsByActortype,
    } = props;

    return viewEntity
      ? Map({
        id: viewEntity.get('id'),
        attributes: viewEntity.get('attributes').mergeWith(
          (oldVal, newVal) => oldVal === null ? newVal : oldVal,
          FORM_INITIAL.get('attributes')
        ),
        associatedTaxonomies: taxonomyOptions(taxonomies),
        associatedActorsByActortype: actorsByActortype
          ? actorsByActortype.map((actors) => entityOptions(actors, true))
          : Map(),
      })
      : Map();
  }

  getHeaderMainFields = () => {
    const { intl } = this.context;
    return (
      [ // fieldGroups
        { // fieldGroup
          fields: [
            getTitleFormField(intl.formatMessage),
          ],
        },
      ]
    );
  };

  getHeaderAsideFields = (entity) => {
    const { intl } = this.context;
    return ([
      {
        fields: [
          getStatusField(intl.formatMessage),
          getMetaField(entity),
        ],
      },
    ]);
  };

  getBodyMainFields = (
    connectedTaxonomies,
    actorsByActortype,
    onCreateOption,
  ) => {
    const { intl } = this.context;
    const groups = [];
    groups.push(
      {
        fields: [
          getMarkdownField(intl.formatMessage),
          // getMarkdownField(intl.formatMessage, 'outcome'),
        ],
      },
    );
    if (actorsByActortype) {
      const actorConnections = renderActorsByActortypeControl(
        actorsByActortype,
        connectedTaxonomies,
        onCreateOption,
        intl,
      );
      if (actorConnections) {
        groups.push(
          {
            label: intl.formatMessage(appMessages.nav.actorsSuper),
            icon: 'actors',
            fields: actorConnections,
          },
        );
      }
    }
    return groups;
  };

  getBodyAsideFields = (taxonomies, onCreateOption) => {
    const { intl } = this.context;
    return ([ // fieldGroups
      { // fieldGroup
        fields: [
          getDateField(
            intl.formatMessage,
            'target_date',
          ),
          getTextareaField(
            intl.formatMessage,
            'target_date_comment',
          ),
        ],
      },
      { // fieldGroup
        label: intl.formatMessage(appMessages.entities.taxonomies.plural),
        icon: 'categories',
        fields: renderTaxonomyControl(taxonomies, onCreateOption, intl),
      },
    ]);
  };

  render() {
    const {
      viewEntity,
      dataReady,
      viewDomain,
      taxonomies,
      connectedTaxonomies,
      actorsByActortype,
      onCreateOption,
    } = this.props;
    const { intl } = this.context;
    const reference = this.props.params.id;
    const {
      saveSending, saveError, deleteSending, deleteError, submitValid,
    } = viewDomain.get('page').toJS();

    return (
      <div>
        <Helmet
          title={`${intl.formatMessage(messages.pageTitle)}: ${reference}`}
          meta={[
            { name: 'description', content: intl.formatMessage(messages.metaDescription) },
          ]}
        />
        <Content ref={this.scrollContainer}>
          <ContentHeader
            title={intl.formatMessage(messages.pageTitle)}
            type={CONTENT_SINGLE}
            icon="actions"
            buttons={
              viewEntity && dataReady
                ? [{
                  type: 'cancel',
                  onClick: this.props.handleCancel,
                },
                {
                  type: 'save',
                  disabled: saveSending,
                  onClick: () => this.props.handleSubmitRemote('actionEdit.form.data'),
                }]
                : null
            }
          />
          {!submitValid
            && (
              <Messages
                type="error"
                messageKey="submitInvalid"
                onDismiss={this.props.onErrorDismiss}
              />
            )
          }
          {saveError
            && (
              <Messages
                type="error"
                messages={saveError.messages}
                onDismiss={this.props.onServerErrorDismiss}
              />
            )
          }
          {deleteError
            && <Messages type="error" messages={deleteError} />
          }
          {(saveSending || deleteSending || !dataReady)
            && <Loading />
          }
          {!viewEntity && dataReady && !saveError && !deleteSending
            && (
              <div>
                <FormattedMessage {...messages.notFound} />
              </div>
            )
          }
          {viewEntity && dataReady && !deleteSending
            && (
              <EntityForm
                model="actionEdit.form.data"
                formData={viewDomain.getIn(['form', 'data'])}
                saving={saveSending}
                handleSubmit={(formData) => this.props.handleSubmit(
                  formData,
                  taxonomies,
                  actorsByActortype
                )}
                handleSubmitFail={this.props.handleSubmitFail}
                handleCancel={this.props.handleCancel}
                handleUpdate={this.props.handleUpdate}
                handleDelete={this.props.isUserAdmin ? this.props.handleDelete : null}
                fields={{
                  header: {
                    main: this.getHeaderMainFields(),
                    aside: this.getHeaderAsideFields(viewEntity),
                  },
                  body: {
                    main: this.getBodyMainFields(
                      connectedTaxonomies,
                      actorsByActortype,
                      onCreateOption,
                    ),
                    aside: this.getBodyAsideFields(
                      taxonomies,
                      onCreateOption,
                    ),
                  },
                }}
                scrollContainer={this.scrollContainer.current}
              />
            )
          }
          {(saveSending || deleteSending)
            && <Loading />
          }
        </Content>
      </div>
    );
  }
}

ActionEdit.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  redirectIfNotPermitted: PropTypes.func,
  initialiseForm: PropTypes.func,
  handleSubmitRemote: PropTypes.func.isRequired,
  handleSubmitFail: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleUpdate: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  viewDomain: PropTypes.object,
  viewEntity: PropTypes.object,
  dataReady: PropTypes.bool,
  authReady: PropTypes.bool,
  isUserAdmin: PropTypes.bool,
  params: PropTypes.object,
  taxonomies: PropTypes.object,
  connectedTaxonomies: PropTypes.object,
  actorsByActortype: PropTypes.object,
  onCreateOption: PropTypes.func,
  onErrorDismiss: PropTypes.func.isRequired,
  onServerErrorDismiss: PropTypes.func.isRequired,
};

ActionEdit.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => ({
  viewDomain: selectDomain(state),
  isUserAdmin: selectIsUserAdmin(state),
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  authReady: selectReadyForAuthCheck(state),
  viewEntity: selectViewEntity(state, props.params.id),
  taxonomies: selectTaxonomies(state, props.params.id),
  connectedTaxonomies: selectConnectedTaxonomies(state),
  actorsByActortype: selectActorsByActortype(state, props.params.id),
});

function mapDispatchToProps(dispatch, props) {
  return {
    loadEntitiesIfNeeded: () => {
      DEPENDENCIES.forEach((path) => dispatch(loadEntitiesIfNeeded(path)));
    },
    redirectIfNotPermitted: () => {
      dispatch(redirectIfNotPermitted(USER_ROLES.MANAGER.value));
    },
    initialiseForm: (model, formData) => {
      dispatch(formActions.reset(model));
      dispatch(formActions.change(model, formData, { silent: true }));
    },
    onErrorDismiss: () => {
      dispatch(submitInvalid(true));
    },
    onServerErrorDismiss: () => {
      dispatch(saveErrorDismiss());
    },
    handleSubmitFail: () => {
      dispatch(submitInvalid(false));
    },
    handleSubmitRemote: (model) => {
      dispatch(formActions.submit(model));
    },
    handleSubmit: (formData, taxonomies, actorsByActortype) => {
      let saveData = formData
        .set(
          'actionCategories',
          getCategoryUpdatesFromFormData({
            formData,
            taxonomies,
            createKey: 'action_id',
          })
        );
      saveData = saveData.set(
        'actorActions',
        actorsByActortype
          .map((actors, actortypeid) => getConnectionUpdatesFromFormData({
            formData: !formData.getIn(['attributes', 'user_only']) ? formData : null,
            connections: actors,
            connectionAttribute: ['associatedActorsByActortype', actortypeid.toString()],
            createConnectionKey: 'actor_id',
            createKey: 'action_id',
          }))
          .reduce(
            (memo, deleteCreateLists) => {
              const deletes = memo.get('delete').concat(deleteCreateLists.get('delete'));
              const creates = memo.get('create').concat(deleteCreateLists.get('create'));
              return memo
                .set('delete', deletes)
                .set('create', creates);
            },
            fromJS({
              delete: [],
              create: [],
            }),
          )
      );

      dispatch(save(saveData.toJS()));
    },
    handleCancel: () => {
      dispatch(updatePath(`/${API.ACTIONS}/${props.params.id}`, { replace: true }));
    },
    handleUpdate: (formData) => {
      dispatch(updateEntityForm(formData));
    },
    handleDelete: () => {
      dispatch(deleteEntity({
        path: API.ACTIONS,
        id: props.params.id,
        redirect: ROUTES.ACTIONS,
      }));
    },
    onCreateOption: (args) => {
      dispatch(openNewEntityModal(args));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionEdit);
