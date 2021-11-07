/*
*
* ActorNew
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { actions as formActions } from 'react-redux-form/immutable';

import { Map, List } from 'immutable';

import {
  renderActionControl,
  renderTaxonomyControl,
  getTitleFormField,
  getReferenceFormField,
  getAcceptedField,
  getStatusField,
  getMarkdownField,
  getActortypeFormField,
} from 'utils/forms';

import { qe } from 'utils/quasi-equals';
import { scrollToTop } from 'utils/scroll-to-component';
import { hasNewError } from 'utils/entity-form';

import { getCheckedValuesFromOptions } from 'components/forms/MultiSelectControl';

import { CONTENT_SINGLE } from 'containers/App/constants';
import { ROUTES, USER_ROLES, DEFAULT_ACTIONTYPE } from 'themes/config';
import appMessages from 'containers/App/messages';

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
  selectActionsCategorised,
  selectActorTaxonomies,
  selectActortypeQuery,
  selectActiveActortypes,
} from 'containers/App/selectors';

import Messages from 'components/Messages';
import Loading from 'components/Loading';
import Content from 'components/Content';
import ContentHeader from 'components/ContentHeader';
import EntityForm from 'containers/EntityForm';

import {
  selectDomain,
  selectConnectedTaxonomies,
} from './selectors';

import messages from './messages';
import { save } from './actions';
import { DEPENDENCIES, FORM_INITIAL } from './constants';


export class ActorNew extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.scrollContainer = React.createRef();
  }

  UNSAFE_componentWillMount() {
    this.props.loadEntitiesIfNeeded();
    this.props.initialiseForm('actorNew.form.data', this.getInitialFormData());
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
    if (nextProps.authReady && !this.props.authReady) {
      this.props.redirectIfNotPermitted();
    }
    if (!this.props.actortypeId && nextProps.actortypeId) {
      this.props.initialiseForm('actorNew.form.data', this.getInitialFormData(nextProps));
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
      (actortypeId && actortypeId !== 'all')
        ? actortypeId
        : DEFAULT_ACTIONTYPE,
    ));
  }

  getHeaderMainFields = (actortypes) => {
    const { intl } = this.context;
    return ([ // fieldGroups
      { // fieldGroup
        fields: [
          actortypes && getActortypeFormField(intl.formatMessage, actortypes), // required
          getReferenceFormField(intl.formatMessage, true), // required
          getTitleFormField(intl.formatMessage, 'titleText'),
        ],
      },
    ]);
  };

  getHeaderAsideFields = () => {
    const { intl } = this.context;
    return ([{
      fields: [getStatusField(intl.formatMessage)],
    }]);
  }

  getBodyMainFields = (
    connectedTaxonomies,
    actions,
    onCreateOption,
    hasResponse,
  ) => {
    const { intl } = this.context;
    const groups = [];
    groups.push({
      fields: [
        getMarkdownField(intl.formatMessage, 'description'),
        hasResponse && getAcceptedField(intl.formatMessage),
        hasResponse && getMarkdownField(intl.formatMessage, 'response'),
      ],
    });
    if (actions) {
      groups.push({
        label: intl.formatMessage(appMessages.nav.actionsSuper),
        icon: 'actions',
        fields: [
          renderActionControl(actions, connectedTaxonomies, onCreateOption, intl),
        ],
      });
    }
    return groups;
  }

  getBodyAsideFields = (taxonomies, onCreateOption) => {
    const { intl } = this.context;
    return ([ // fieldGroup
      { // fieldGroup
        label: intl.formatMessage(appMessages.entities.taxonomies.plural),
        icon: 'categories',
        fields: renderTaxonomyControl(taxonomies, onCreateOption, intl),
      },
    ]);
  };

  render() {
    const { intl } = this.context;
    const {
      dataReady,
      viewDomain,
      connectedTaxonomies,
      taxonomies,
      actions,
      onCreateOption,
      actortypeId,
      actortypes,
    } = this.props;
    const { saveSending, saveError, submitValid } = viewDomain.get('page').toJS();
    const actortypeSpecified = (actortypeId && actortypeId !== 'all');

    const type = intl.formatMessage(
      appMessages.entities[actortypeSpecified ? `actors_${actortypeId}` : 'actors'].single
    );

    const currentActortypeId = actortypeSpecified
      ? actortypeId
      : viewDomain.getIn(['form', 'data', 'attributes', 'actortype_id']) || DEFAULT_ACTIONTYPE;
    const currentActortype = dataReady && actortypes.find((actortype) => qe(actortype.get('id'), currentActortypeId));
    const hasResponse = dataReady && currentActortype.getIn(['attributes', 'has_response']);
    const hasActions = dataReady && currentActortype.getIn(['attributes', 'has_actions']);

    const actortypeTaxonomies = taxonomies && taxonomies.filter((tax) => tax.get('actortypeIds').find((id) => qe(id, currentActortypeId))
      || qe(currentActortypeId, tax.getIn(['attributes', 'actortype_id'])));
    return (
      <div>
        <Helmet
          title={`${intl.formatMessage(messages.pageTitle, { type })}`}
          meta={[
            {
              name: 'description',
              content: intl.formatMessage(messages.metaDescription),
            },
          ]}
        />
        <Content ref={this.scrollContainer}>
          <ContentHeader
            title={intl.formatMessage(messages.pageTitle, { type })}
            type={CONTENT_SINGLE}
            icon={actortypeSpecified ? `actors_${actortypeId}` : 'actors'}
            buttons={
              dataReady ? [{
                type: 'cancel',
                onClick: this.props.handleCancel,
              },
              {
                type: 'save',
                disabled: saveSending,
                onClick: () => this.props.handleSubmitRemote('actorNew.form.data'),
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
                model="actorNew.form.data"
                formData={viewDomain.getIn(['form', 'data'])}
                saving={saveSending}
                handleSubmit={(formData) => this.props.handleSubmit(
                  formData,
                  currentActortype,
                  actortypeTaxonomies,
                )}
                handleSubmitFail={this.props.handleSubmitFail}
                handleCancel={this.props.handleCancel}
                handleUpdate={this.props.handleUpdate}
                fields={{ // isManager, taxonomies,
                  header: {
                    main: this.getHeaderMainFields(
                      actortypeId === 'all' ? actortypes : null
                    ),
                    aside: this.getHeaderAsideFields(),
                  },
                  body: {
                    main: this.getBodyMainFields(
                      connectedTaxonomies,
                      hasActions && actions,
                      onCreateOption,
                      hasResponse,
                    ),
                    aside: this.getBodyAsideFields(actortypeTaxonomies, onCreateOption),
                  },
                }}
                scrollContainer={this.scrollContainer.current}
              />
            )
          }
          { saveSending
            && <Loading />
          }
        </Content>
      </div>
    );
  }
}

ActorNew.propTypes = {
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
  taxonomies: PropTypes.object,
  actions: PropTypes.object,
  onCreateOption: PropTypes.func,
  initialiseForm: PropTypes.func,
  connectedTaxonomies: PropTypes.object,
  onErrorDismiss: PropTypes.func.isRequired,
  onServerErrorDismiss: PropTypes.func.isRequired,
  actortypeId: PropTypes.string,
  actortypes: PropTypes.object,
};

ActorNew.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  viewDomain: selectDomain(state),
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  authReady: selectReadyForAuthCheck(state),
  taxonomies: selectActorTaxonomies(state, { includeParents: false }),
  actions: selectActionsCategorised(state),
  connectedTaxonomies: selectConnectedTaxonomies(state),
  actortypeId: selectActortypeQuery(state),
  actortypes: selectActiveActortypes(state),
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
    // handleSubmit: (formData, currentActortype) => {
    handleSubmit: (formData, currentActortype, actortypeTaxonomies) => {
      let saveData = formData;

      // actorCategories=
      if (formData.get('associatedTaxonomies')) {
        // get List of valid categories (for actortype)
        const validCategories = actortypeTaxonomies && actortypeTaxonomies
          .map((actortypet) => actortypet.get('categories').keySeq())
          .valueSeq()
          .flatten();
        // get list of selected categories by taxonomy,
        // filter by valid categories
        const selectedCategories = formData
          .get('associatedTaxonomies')
          .map(getCheckedValuesFromOptions)
          .valueSeq()
          .flatten()
          .filter((id) => !validCategories || validCategories.includes(id));
        // const categoryIds =
        saveData = saveData.set(
          'actorCategories',
          Map({
            delete: List(),
            create: selectedCategories.map((id) => Map({ category_id: id })),
          }),
        );
      }

      // actions if allowed by actortype
      if (
        formData.get('associatedActions')
        && currentActortype.getIn(['attributes', 'has_actions'])
      ) {
        saveData = saveData.set('actorActions', Map({
          delete: List(),
          create: getCheckedValuesFromOptions(formData.get('associatedActions'))
            .map((id) => Map({
              action_id: id,
            })),
        }));
      }

      // cleanup attributes for actortype
      if (!currentActortype.getIn(['attributes', 'has_response'])) {
        saveData = saveData
          .setIn(['attributes', 'accepted'], null)
          .setIn(['attributes', 'response'], null);
      }
      if (!currentActortype.get('id')) {
        saveData = saveData.setIn(['attributes', 'actortype_id'], DEFAULT_ACTIONTYPE);
      }
      dispatch(save(saveData.toJS()));
    },
    handleCancel: () => {
      dispatch(updatePath(ROUTES.ACTORS, { replace: true }));
    },
    handleUpdate: (formData) => {
      dispatch(updateEntityForm(formData));
    },
    onCreateOption: (args) => {
      dispatch(openNewEntityModal(args));
    },
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(ActorNew);
