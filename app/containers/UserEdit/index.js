/*
 *
 * UserEdit
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { actions as formActions } from 'react-redux-form/immutable';
import { Map, List } from 'immutable';

import {
  taxonomyOptions,
  getTitleFormField,
  getEmailField,
  getHighestUserRoleId,
  getRoleFormField,
  getUserStatusField,
} from 'utils/forms';

import {
  getMetaField,
  getRoleField,
} from 'utils/fields';

import { scrollToTop } from 'utils/scroll-to-component';
import { hasNewError } from 'utils/entity-form';

import {
  loadEntitiesIfNeeded,
  updatePath,
  updateEntityForm,
  submitInvalid,
  saveErrorDismiss,
  openNewEntityModal,
} from 'containers/App/actions';

import {
  selectReady,
  selectSessionUserHighestRoleId,
} from 'containers/App/selectors';

import { CONTENT_SINGLE } from 'containers/App/constants';
import { ROUTES, USER_ROLES } from 'themes/config';

import Messages from 'components/Messages';
import Loading from 'components/Loading';
import Content from 'components/Content';
import ContentHeader from 'components/ContentHeader';
import EntityForm from 'containers/EntityForm';

import {
  selectDomain,
  selectViewEntity,
  selectRoles,
} from './selectors';

import { save } from './actions';
import messages from './messages';
import { DEPENDENCIES, FORM_INITIAL } from './constants';

export class UserEdit extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.scrollContainer = React.createRef();
  }

  UNSAFE_componentWillMount() {
    this.props.loadEntitiesIfNeeded();
    if (this.props.dataReady && this.props.viewEntity) {
      this.props.initialiseForm('userEdit.form.data', this.getInitialFormData());
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
    if (nextProps.dataReady && !this.props.dataReady && nextProps.viewEntity) {
      this.props.initialiseForm('userEdit.form.data', this.getInitialFormData(nextProps));
    }
    if (hasNewError(nextProps, this.props) && this.scrollContainer) {
      scrollToTop(this.scrollContainer.current);
    }
  }

  getInitialFormData = (nextProps) => {
    const props = nextProps || this.props;
    const { taxonomies, roles, viewEntity } = props;

    return Map({
      id: viewEntity.get('id'),
      attributes: viewEntity.get('attributes').mergeWith(
        (oldVal, newVal) => oldVal === null ? newVal : oldVal,
        FORM_INITIAL.get('attributes')
      ),
      associatedTaxonomies: taxonomyOptions(taxonomies),
      associatedRole: getHighestUserRoleId(roles),
    });
  }

  getHeaderMainFields = () => {
    const { intl } = this.context;
    return ([{ // fieldGroup
      fields: [getTitleFormField(intl.formatMessage, 'title', 'name')],
    }]);
  };

  getHeaderAsideFields = (entity, roles) => {
    const { intl } = this.context;
    let fields = [
      getUserStatusField(intl.formatMessage),
    ];
    if (roles && roles.size > 0) {
      fields = [
        ...fields,
        getRoleFormField(intl.formatMessage, roles),
      ];
    } else {
      fields = [
        ...fields,
        getRoleField(entity),
      ];
    }
    fields = [
      ...fields,
      getMetaField(entity),
    ];
    return ([{ fields }]);
  };

  getBodyMainFields = () => {
    const { intl } = this.context;
    return ([{
      fields: [getEmailField(intl.formatMessage)],
    }]);
  };

  // getBodyAsideFields = (taxonomies, onCreateOption) => {
  //   const { intl } = this.context;
  //   return ([ // fieldGroups
  //     { // fieldGroup
  //       fields: renderTaxonomyControl(taxonomies, onCreateOption, intl),
  //     },
  //   ]);
  // };

  getEditableUserRoles = (roles, sessionUserHighestRoleId) => {
    if (roles) {
      const userHighestRoleId = getHighestUserRoleId(roles);
      // roles are editable by the session user (logged on user) if
      // unless the session user is an ADMIN
      // the session user can only assign roles "lower" (that is higher id) than his/her own role
      // and when the session user has a "higher" (lower id) role than the user profile being edited
      return roles
        .filter((role) => sessionUserHighestRoleId === USER_ROLES.ADMIN.value
          || (sessionUserHighestRoleId < userHighestRoleId && sessionUserHighestRoleId < parseInt(role.get('id'), 10)));
    }
    return Map();
  }

  render() {
    const { intl } = this.context;
    const {
      viewEntity, dataReady, viewDomain, roles, sessionUserHighestRoleId,
    } = this.props;
    const reference = this.props.params.id;
    const { saveSending, saveError, submitValid } = viewDomain.get('page').toJS();

    const editableRoles = this.getEditableUserRoles(roles, sessionUserHighestRoleId);

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
            icon="users"
            buttons={
              viewEntity && [{
                type: 'cancel',
                onClick: () => this.props.handleCancel(this.props.params.id),
              },
              {
                type: 'save',
                disabled: saveSending,
                onClick: () => this.props.handleSubmitRemote('userEdit.form.data'),
              }]
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
          {saveSending && <Loading />}
          {!viewEntity && dataReady && !saveError
            && (
              <div>
                <FormattedMessage {...messages.notFound} />
              </div>
            )
          }
          {viewEntity && (
            <EntityForm
              model="userEdit.form.data"
              formData={viewDomain.getIn(['form', 'data'])}
              saving={saveSending}
              handleSubmit={(formData) => this.props.handleSubmit(
                formData,
                roles,
              )}
              handleSubmitFail={this.props.handleSubmitFail}
              handleCancel={() => this.props.handleCancel(reference)}
              handleUpdate={this.props.handleUpdate}
              fields={{
                header: {
                  main: this.getHeaderMainFields(),
                  aside: this.getHeaderAsideFields(viewEntity, editableRoles),
                },
                body: {
                  main: this.getBodyMainFields(),
                  // aside: (sessionUserHighestRoleId <= USER_ROLES.MANAGER.value) && this.getBodyAsideFields(taxonomies, onCreateOption),
                },
              }}
              scrollContainer={this.scrollContainer.current}
            />
          )}
          { saveSending
            && <Loading />
          }
        </Content>
      </div>
    );
  }
}

UserEdit.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  initialiseForm: PropTypes.func,
  handleSubmitRemote: PropTypes.func.isRequired,
  handleSubmitFail: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleUpdate: PropTypes.func.isRequired,
  viewDomain: PropTypes.object,
  viewEntity: PropTypes.object,
  roles: PropTypes.object,
  dataReady: PropTypes.bool,
  sessionUserHighestRoleId: PropTypes.number,
  params: PropTypes.object,
  onCreateOption: PropTypes.func,
  onErrorDismiss: PropTypes.func.isRequired,
  onServerErrorDismiss: PropTypes.func.isRequired,
};

UserEdit.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => ({
  sessionUserHighestRoleId: selectSessionUserHighestRoleId(state),
  viewDomain: selectDomain(state),
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  viewEntity: selectViewEntity(state, props.params.id),
  roles: selectRoles(state, props.params.id),
});

function mapDispatchToProps(dispatch) {
  return {
    loadEntitiesIfNeeded: () => {
      DEPENDENCIES.forEach((path) => dispatch(loadEntitiesIfNeeded(path)));
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
    handleSubmit: (formData, roles) => {
      let saveData = formData;
      // roles
      // higher is actually lower
      const newHighestRole = parseInt(formData.get('associatedRole'), 10);

      // store all higher roles
      const newRoleIds = newHighestRole === USER_ROLES.DEFAULT.value
        ? List()
        : roles.reduce((memo, role) => newHighestRole <= parseInt(role.get('id'), 10)
          ? memo.push(role.get('id'))
          : memo,
        List());

      saveData = saveData.set('userRoles', Map({
        delete: roles.reduce((memo, role) => role.get('associated')
            && !newRoleIds.includes(role.get('id'))
            && !newRoleIds.includes(parseInt(role.get('id'), 10))
          ? memo.push(role.getIn(['associated', 'id']))
          : memo,
        List()),
        create: newRoleIds.reduce((memo, id) => roles.find((role) => role.get('id') === id && !role.get('associated'))
          ? memo.push(Map({ role_id: id, user_id: formData.get('id') }))
          : memo,
        List()),
      }));
      console.log(saveData.toJS());
      dispatch(save(saveData.toJS()));
    },
    handleCancel: (reference) => {
      dispatch(updatePath(`${ROUTES.USERS}/${reference}`, { replace: true }));
    },
    handleUpdate: (formData) => {
      dispatch(updateEntityForm(formData));
    },
    onCreateOption: (args) => {
      dispatch(openNewEntityModal(args));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserEdit);
