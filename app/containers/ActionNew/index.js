/*
 *
 * ActionNew
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { actions as formActions } from 'react-redux-form/immutable';

// import { Map, List, fromJS } from 'immutable';
import { Map, List } from 'immutable';

import { getInfoField } from 'utils/fields';
import {
  // getConnectionUpdatesFromFormData,
  getTitleFormField,
  getStatusField,
  getMarkdownField,
  getCodeFormField,
  // renderActorsByActortypeControl,
  getDateField,
  getTextareaField,
  renderTaxonomyControl,
  getLinkFormField,
  getAmountFormField,
  getFormField,
  getCheckboxField,
} from 'utils/forms';

import { getCheckedValuesFromOptions } from 'components/forms/MultiSelectControl';

import { scrollToTop } from 'utils/scroll-to-component';
import { hasNewError } from 'utils/entity-form';

import { CONTENT_SINGLE } from 'containers/App/constants';
import { USER_ROLES, ROUTES, ACTION_FIELDS } from 'themes/config';

import {
  loadEntitiesIfNeeded,
  redirectIfNotPermitted,
  updatePath,
  updateEntityForm,
  openNewEntityModal,
  submitInvalid,
  saveErrorDismiss,
} from 'containers/App/actions';

import {
  selectReady,
  selectReadyForAuthCheck,
  selectActiontypeTaxonomiesWithCats,
  selectActiontype,
} from 'containers/App/selectors';

import Messages from 'components/Messages';
import Loading from 'components/Loading';
import Content from 'components/Content';
import ContentHeader from 'components/ContentHeader';
import EntityForm from 'containers/EntityForm';

import appMessages from 'containers/App/messages';

import {
  selectDomain,
  selectConnectedTaxonomies,
  selectActorsByActortype,
} from './selectors';

import messages from './messages';
import { DEPENDENCIES, FORM_INITIAL } from './constants';
import { save } from './actions';

export class ActionNew extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.scrollContainer = React.createRef();
  }

  UNSAFE_componentWillMount() {
    this.props.loadEntitiesIfNeeded();
    this.props.initialiseForm('actionNew.form.data', this.getInitialFormData());
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
    if (nextProps.authReady && !this.props.authReady) {
      this.props.redirectIfNotPermitted();
    }
    if (hasNewError(nextProps, this.props) && this.scrollContainer) {
      scrollToTop(this.scrollContainer.current);
    }
  }

  getInitialFormData = (nextProps) => {
    const props = nextProps || this.props;
    const { actortypeId } = props;
    return Map(FORM_INITIAL.setIn(
      ['attributes', 'actortype_id'],
      actortypeId
    ));
  }

  checkAttribute = (typeId, att) => {
    if (ACTION_FIELDS && ACTION_FIELDS.ATTRIBUTES && ACTION_FIELDS.ATTRIBUTES[att]) {
      if (ACTION_FIELDS.ATTRIBUTES[att].optional) {
        return ACTION_FIELDS.ATTRIBUTES[att].optional.indexOf(typeId) > -1;
      }
      if (ACTION_FIELDS.ATTRIBUTES[att].required) {
        return ACTION_FIELDS.ATTRIBUTES[att].required.indexOf(typeId) > -1;
      }
    }
    return false;
  }

  checkRequired = (typeId, att) => {
    if (ACTION_FIELDS && ACTION_FIELDS.ATTRIBUTES && ACTION_FIELDS.ATTRIBUTES[att] && ACTION_FIELDS.ATTRIBUTES[att].required) {
      return ACTION_FIELDS.ATTRIBUTES[att].required.indexOf(typeId) > -1;
    }
    return false;
  }

  getHeaderMainFields = (type) => {
    const { intl } = this.context;
    const typeId = type.get('id');
    return ([ // fieldGroups
      { // fieldGroup
        fields: [
          getInfoField(
            'measuretype_id',
            intl.formatMessage(appMessages.actiontypes[typeId]),
            true // large
          ), // required
          this.checkAttribute(typeId, 'code') && getCodeFormField(
            intl.formatMessage,
            'code',
            this.checkRequired(typeId, 'code'),
          ),
          this.checkAttribute(typeId, 'title') && getTitleFormField(
            intl.formatMessage,
            'title',
            'title',
            this.checkRequired(typeId, 'title'),
          ),
          this.checkAttribute(typeId, 'url') && getLinkFormField(
            intl.formatMessage,
            this.checkRequired(typeId, 'url'),
            'url',
          ),
        ],
      },
    ]);
  };

  getHeaderAsideFields = () => {
    const { intl } = this.context;
    return ([
      {
        fields: [
          getStatusField(intl.formatMessage),
        ],
      },
    ]);
  }

  getBodyMainFields = (
    type
    // connectedTaxonomies,
    // actorsByActortype,
    // onCreateOption,
  ) => {
    const { intl } = this.context;
    const typeId = type.get('id');
    const groups = [];
    groups.push(
      {
        fields: [
          // description
          this.checkAttribute(typeId, 'description') && getMarkdownField(
            intl.formatMessage,
            this.checkRequired(typeId, 'description'),
            'description',
          ),
          this.checkAttribute(typeId, 'comment') && getMarkdownField(
            intl.formatMessage,
            this.checkRequired(typeId, 'comment'),
            'comment',
          ),
        ],
      },
      {
        fields: [
          this.checkAttribute(typeId, 'reference_ml') && getMarkdownField(
            intl.formatMessage,
            this.checkRequired(typeId, 'reference_ml'),
            'reference_ml',
          ),
          this.checkAttribute(typeId, 'status_lbs_protocol') && getMarkdownField(
            intl.formatMessage,
            this.checkRequired(typeId, 'status_lbs_protocol'),
            'status_lbs_protocol',
          ),
          this.checkAttribute(typeId, 'has_reference_landbased_ml') && getCheckboxField(
            intl.formatMessage,
            'has_reference_landbased_ml',
          ),
          this.checkAttribute(typeId, 'reference_landbased_ml') && getMarkdownField(
            intl.formatMessage,
            this.checkRequired(typeId, 'reference_landbased_ml'),
            'reference_landbased_ml',
          ),
        ],
      },
      {
        fields: [
          this.checkAttribute(typeId, 'target_comment') && getMarkdownField(
            intl.formatMessage,
            this.checkRequired(typeId, 'target_comment'),
            'target_comment',
          ),
          this.checkAttribute(typeId, 'status_comment') && getMarkdownField(
            intl.formatMessage,
            this.checkRequired(typeId, 'status_comment'),
            'status_comment',
          ),
        ],
      },
    );
    // if (actorsByActortype) {
    //   const actorConnections = renderActorsByActortypeControl(
    //     actorsByActortype,
    //     connectedTaxonomies,
    //     onCreateOption,
    //     intl,
    //   );
    //   if (actorConnections) {
    //     groups.push(
    //       {
    //         label: intl.formatMessage(appMessages.nav.actorsSuper),
    //         icon: 'actors',
    //         fields: actorConnections,
    //       },
    //     );
    //   }
    // }
    return groups;
  };

  getBodyAsideFields = (type, taxonomies, onCreateOption) => {
    const { intl } = this.context;
    const typeId = type.get('id');
    return ([ // fieldGroups
      { // fieldGroup
        fields: [
          this.checkAttribute(typeId, 'amount') && getAmountFormField(
            intl.formatMessage,
            this.checkRequired(typeId, 'amount'),
            'amount',
          ),
          this.checkAttribute(typeId, 'amount_comment') && getFormField({
            formatMessage: intl.formatMessage,
            required: this.checkRequired(typeId, 'amount_comment'),
            attribute: 'amount_comment',
            controlType: 'input',
          }),
        ],
      },
      { // fieldGroup
        fields: [
          this.checkAttribute(typeId, 'date_start') && getDateField(
            intl.formatMessage,
            'date_start',
            this.checkRequired(typeId, 'date_start'),
          ),
          this.checkAttribute(typeId, 'date_end') && getDateField(
            intl.formatMessage,
            'date_end',
            this.checkRequired(typeId, 'date_end'),
          ),
          this.checkAttribute(typeId, 'date_comment') && getTextareaField(
            intl.formatMessage,
            'date_comment',
            this.checkRequired(typeId, 'date_comment'),
          ),
        ],
      },
      { // fieldGroup
        label: intl.formatMessage(appMessages.entities.taxonomies.plural),
        icon: 'categories',
        fields: renderTaxonomyControl(taxonomies, onCreateOption, intl),
      },
    ]);
  }

  render() {
    const { intl } = this.context;
    const {
      dataReady,
      viewDomain,
      actorsByActortype,
      connectedTaxonomies,
      taxonomies,
      onCreateOption,
      actiontype,
    } = this.props;
    // console.log('FORM_INITIAL', FORM_INITIAL && FORM_INITIAL.toJS());
    // console.log('actiontype', actiontype && actiontype.toJS());
    // console.log('taxonomies', taxonomies && taxonomies.toJS());
    // console.log('connectedTaxonomies', connectedTaxonomies && connectedTaxonomies.toJS());
    // console.log('actorsByActortype', actorsByActortype && actorsByActortype.toJS());
    const { saveSending, saveError, submitValid } = viewDomain.get('page').toJS();
    return (
      <div>
        <Helmet
          title={`${intl.formatMessage(messages.pageTitle)}`}
          meta={[
            {
              name: 'description',
              content: intl.formatMessage(messages.metaDescription),
            },
          ]}
        />
        <Content ref={this.scrollContainer}>
          <ContentHeader
            title={intl.formatMessage(messages.pageTitle)}
            type={CONTENT_SINGLE}
            icon="actions"
            buttons={
              dataReady ? [{
                type: 'cancel',
                onClick: this.props.handleCancel,
              },
              {
                type: 'save',
                disabled: saveSending,
                onClick: () => this.props.handleSubmitRemote('actionNew.form.data'),
              }] : null
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
          {(saveSending || !dataReady)
            && <Loading />
          }
          {dataReady
            && (
              <EntityForm
                model="actionNew.form.data"
                formData={viewDomain.getIn(['form', 'data'])}
                saving={saveSending}
                handleSubmit={(formData) => this.props.handleSubmit(formData, actorsByActortype)}
                handleSubmitFail={this.props.handleSubmitFail}
                handleCancel={this.props.handleCancel}
                handleUpdate={this.props.handleUpdate}
                fields={{
                  header: {
                    main: this.getHeaderMainFields(actiontype),
                    aside: this.getHeaderAsideFields(),
                  },
                  body: {
                    main: this.getBodyMainFields(
                      actiontype,
                      connectedTaxonomies,
                      actorsByActortype,
                      onCreateOption,
                    ),
                    aside: this.getBodyAsideFields(
                      actiontype,
                      taxonomies,
                      onCreateOption,
                    ),
                  },
                }}
                scrollContainer={this.scrollContainer.current}
              />
            )
          }
          {saveSending
            && <Loading />
          }
        </Content>
      </div>
    );
  }
}

ActionNew.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  redirectIfNotPermitted: PropTypes.func,
  handleSubmitRemote: PropTypes.func.isRequired,
  handleSubmitFail: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleUpdate: PropTypes.func.isRequired,
  viewDomain: PropTypes.object,
  dataReady: PropTypes.bool,
  authReady: PropTypes.bool,
  actorsByActortype: PropTypes.object,
  initialiseForm: PropTypes.func,
  onErrorDismiss: PropTypes.func.isRequired,
  onServerErrorDismiss: PropTypes.func.isRequired,
  taxonomies: PropTypes.object,
  onCreateOption: PropTypes.func,
  connectedTaxonomies: PropTypes.object,
  actiontype: PropTypes.instanceOf(Map),
};

ActionNew.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state, { params }) => ({
  viewDomain: selectDomain(state),
  authReady: selectReadyForAuthCheck(state),
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  taxonomies: selectActiontypeTaxonomiesWithCats(
    state,
    {
      type: params.id,
      includeParents: false,
    },
  ),
  actorsByActortype: selectActorsByActortype(state),
  connectedTaxonomies: selectConnectedTaxonomies(state),
  actiontype: selectActiontype(state, params.id),
});

function mapDispatchToProps(dispatch) {
  return {
    initialiseForm: (model, formData) => {
      dispatch(formActions.reset(model));
      dispatch(formActions.change(model, formData, { silent: true }));
    },
    loadEntitiesIfNeeded: () => {
      DEPENDENCIES.forEach((path) => dispatch(loadEntitiesIfNeeded(path)));
    },
    redirectIfNotPermitted: () => {
      dispatch(redirectIfNotPermitted(USER_ROLES.MANAGER.value));
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
    // handleSubmit: (formData, actorsByActortype) => {
    handleSubmit: (formData) => {
      let saveData = formData;

      // actionCategories
      if (formData.get('associatedTaxonomies')) {
        saveData = saveData.set(
          'actionCategories',
          formData.get('associatedTaxonomies')
            .map(getCheckedValuesFromOptions)
            .reduce((updates, formCategoryIds) => Map({
              delete: List(),
              create: updates.get('create').concat(formCategoryIds.map((id) => Map({
                category_id: id,
              }))),
            }), Map({ delete: List(), create: List() }))
        );
      }

      // actors
      // if (formData.get('associatedActorsByActortype') && actorsByActortype) {
      //   saveData = saveData.set(
      //     'actorActions',
      //     actorsByActortype
      //       .map((actors, actortypeid) => getConnectionUpdatesFromFormData({
      //         formData,
      //         connections: actors,
      //         connectionAttribute: ['associatedActorsByActortype', actortypeid.toString()],
      //         createConnectionKey: 'actor_id',
      //         createKey: 'action_id',
      //       }))
      //       .reduce(
      //         (memo, deleteCreateLists) => {
      //           const creates = memo.get('create').concat(deleteCreateLists.get('create'));
      //           return memo.set('create', creates);
      //         },
      //         fromJS({
      //           delete: [],
      //           create: [],
      //         }),
      //       )
      //   );
      // }

      dispatch(save(saveData.toJS()));
    },
    handleCancel: () => {
      dispatch(updatePath(ROUTES.ACTIONS), { replace: true });
    },
    handleUpdate: (formData) => {
      dispatch(updateEntityForm(formData));
    },
    onCreateOption: (args) => {
      dispatch(openNewEntityModal(args));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionNew);
