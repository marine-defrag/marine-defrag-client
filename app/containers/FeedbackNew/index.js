/*
 *
 * FeedbackNew
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { actions as formActions } from 'react-redux-form/immutable';

import { Box, Text } from 'grommet';
import styled from 'styled-components';

import {
  getTitleFormField,
  getTextareaField,
} from 'utils/forms';
import { getInfoField } from 'utils/fields';

import { USER_ROLES } from 'themes/config';

import {
  loadEntitiesIfNeeded,
  redirectIfNotPermitted,
  updateEntityForm,
  submitInvalid,
  saveErrorDismiss,
  resetEntityForm,
  updateRouteQuery,
} from 'containers/App/actions';
import {
  selectReady,
  selectReadyForAuthCheck,
} from 'containers/App/selectors';

import Messages from 'components/Messages';
import Loading from 'components/Loading';
import ContentNarrow from 'components/ContentNarrow';
import ContentHeader from 'components/ContentHeader';
import ButtonDefault from 'components/buttons/ButtonDefault';

import EntityForm from 'containers/EntityForm';
import Footer from 'containers/Footer';

import { selectDomain } from './selectors';

import messages from './messages';
import { save } from './actions';
import { DEPENDENCIES, FORM_INITIAL } from './constants';

const StyledResetButton = styled(ButtonDefault)`
  display: block;
  margin: 0 auto 0 0;
`;
export class FeedbackNew extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  UNSAFE_componentWillMount() {
    this.props.loadEntitiesIfNeeded();
    this.props.initialiseForm('feedbackNew.form.data', FORM_INITIAL);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
    if (nextProps.authReady && !this.props.authReady) {
      this.props.redirectIfNotPermitted();
    }
  }

  getHeaderMainFields = (isRequestAccess) => {
    const { intl } = this.context;
    return ([ // fieldGroups
      { // fieldGroup
        fields: isRequestAccess
          ? [
            getInfoField(
              'subject', // attribute
              'Request Access', // value
              true, // large
              true, // noPadding
            ),
          ]
          : [
            getTitleFormField(intl.formatMessage, 'title', 'subject', true),
          ],
      },
    ]);
  }

  getBodyMainFields = () => {
    const { intl } = this.context;
    return ([{
      fields: [getTextareaField(
        intl.formatMessage,
        'message_content',
        true,
        'textareaLarge',
        2000,
      )],
    }]);
  };

  render() {
    const { intl } = this.context;
    const {
      viewDomain,
      dataReady,
      resetForm,
      location,
      onUpdateQuery,
    } = this.props;
    const { query } = location;
    const isRequestAccess = query && query.subject && query.subject === 'access';

    const {
      saveSending,
      saveError,
      submitValid,
      saveSuccess,
    } = viewDomain.get('page').toJS();

    let title = intl.formatMessage(messages.pageTitle);
    if (isRequestAccess) {
      title = intl.formatMessage(messages.pageTitleAccess);
    }
    return (
      <>
        <Helmet
          title={title}
          meta={[{
            name: 'description',
            content: intl.formatMessage(messages.metaDescription),
          }]}
        />
        <ContentNarrow withoutHeaderNav>
          <ContentHeader
            title={title}
          />
          {saveSuccess && (
            <Box fill="horizontal" margin={{ bottom: 'large' }}>
              <Box margin={{ bottom: 'medium' }}>
                <Text>{intl.formatMessage(messages.sendSuccess)}</Text>
              </Box>
              <Box justify="start">
                <StyledResetButton
                  type="primary"
                  onClick={() => {
                    resetForm('feedbackNew.form.data');
                    if (isRequestAccess) {
                      onUpdateQuery({
                        arg: 'subject',
                        remove: true,
                      });
                    }
                  }}
                >
                  <Text>{intl.formatMessage(messages.resetForm)}</Text>
                </StyledResetButton>
              </Box>
            </Box>
          )}
          {!saveSuccess && (
            <Box margin={{ bottom: 'large' }}>
              {!isRequestAccess && (
                <Text>
                  {intl.formatMessage(messages.intro)}
                </Text>
              )}
              {isRequestAccess && (
                <Text>
                  {intl.formatMessage(messages.introAccess)}
                </Text>
              )}
            </Box>
          )}
          {!submitValid && (
            <Messages
              type="error"
              messageKey="submitInvalid"
              onDismiss={this.props.onErrorDismiss}
            />
          )}
          {saveError && (
            <Messages
              type="error"
              messages={saveError.messages}
              onDismiss={this.props.onServerErrorDismiss}
            />
          )}
          {(saveSending || !dataReady) && <Loading />}
          {dataReady && !saveSuccess && (
            <EntityForm
              model="feedbackNew.form.data"
              formData={viewDomain.getIn(['form', 'data'])}
              saving={saveSending}
              handleSubmit={(formData) => this.props.handleSubmit(
                formData,
                'feedbackNew.form.data',
                isRequestAccess ? 'Request Access' : null,
              )}
              handleSubmitFail={this.props.handleSubmitFail}
              handleUpdate={this.props.handleUpdate}
              fields={{
                header: {
                  main: this.getHeaderMainFields(isRequestAccess),
                },
                body: {
                  main: this.getBodyMainFields(),
                },
              }}
              labels={{
                submit: isRequestAccess
                  ? intl.formatMessage(messages.submitAccess)
                  : intl.formatMessage(messages.submit),
              }}
            />
          )}
          {saveSending && <Loading />}
        </ContentNarrow>
        <Footer />
      </>
    );
  }
}

FeedbackNew.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func.isRequired,
  redirectIfNotPermitted: PropTypes.func,
  handleSubmitFail: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleUpdate: PropTypes.func.isRequired,
  onErrorDismiss: PropTypes.func.isRequired,
  onServerErrorDismiss: PropTypes.func.isRequired,
  viewDomain: PropTypes.object,
  location: PropTypes.object,
  dataReady: PropTypes.bool,
  authReady: PropTypes.bool,
  initialiseForm: PropTypes.func,
  resetForm: PropTypes.func,
  onUpdateQuery: PropTypes.func,
};

FeedbackNew.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  viewDomain: selectDomain(state),
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  authReady: selectReadyForAuthCheck(state),
});

function mapDispatchToProps(dispatch) {
  return {
    initialiseForm: (model, formData) => {
      dispatch(formActions.reset(model));
      dispatch(formActions.change(model, formData, { silent: true }));
    },
    resetForm: (model) => {
      dispatch(resetEntityForm());
      dispatch(formActions.reset(model));
    },
    loadEntitiesIfNeeded: () => {
      DEPENDENCIES.forEach((path) => dispatch(loadEntitiesIfNeeded(path)));
    },
    redirectIfNotPermitted: () => {
      dispatch(redirectIfNotPermitted(USER_ROLES.ANALYST.value));
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
    handleSubmit: (formData, model, subject) => {
      let data = formData
        .setIn(['attributes', 'content'], formData.getIn(['attributes', 'message_content']))
        .deleteIn(['attributes', 'message_content']);
      if (subject) {
        // override/set (empty) subject
        data = data.setIn(['attributes', 'subject'], subject);
      }
      const onSaveSuccess = () => {
        dispatch(formActions.reset(model));
      };
      dispatch(save(
        data.toJS(),
        onSaveSuccess,
      ));
    },
    handleUpdate: (formData) => {
      dispatch(updateEntityForm(formData));
    },
    onUpdateQuery: (query) => {
      dispatch(updateRouteQuery(query));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(FeedbackNew);
