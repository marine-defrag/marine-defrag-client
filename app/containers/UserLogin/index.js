/*
 *
 * UserLogin
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { actions as formActions } from 'react-redux-form/immutable';

import {
  getEmailField,
  getPasswordField,
} from 'utils/forms';

import Messages from 'components/Messages';
import Loading from 'components/Loading';
import Icon from 'components/Icon';
import ContentNarrow from 'components/ContentNarrow';
import ContentHeader from 'components/ContentHeader';
import Footer from 'containers/Footer';

import AuthForm from 'components/forms/AuthForm';
import A from 'components/styled/A';

import { selectQueryMessages } from 'containers/App/selectors';
import { updatePath, dismissQueryMessages } from 'containers/App/actions';

import { ROUTES } from 'themes/config';
import messages from './messages';

import { login } from './actions';
import { selectDomain } from './selectors';

const BottomLinks = styled.div`
  padding: 2em 0;
`;

export class UserLogin extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  UNSAFE_componentWillMount() {
    this.props.initialiseForm();
  }

  render() {
    const { intl } = this.context;
    const { authError, authSending } = this.props.viewDomain.get('page').toJS();

    return (
      <>
        <Helmet
          title={`${intl.formatMessage(messages.pageTitle)}`}
          meta={[
            {
              name: 'description',
              content: intl.formatMessage(messages.metaDescription),
            },
          ]}
        />
        <ContentNarrow withoutHeaderNav>
          <ContentHeader
            title={intl.formatMessage(messages.pageTitle)}
          />
          {this.props.queryMessages.info
            && (
              <Messages
                type="info"
                onDismiss={this.props.onDismissQueryMessages}
                messageKey={this.props.queryMessages.info}
              />
            )
          }
          {authError
            && (
              <Messages
                type="error"
                messages={authError.messages}
              />
            )
          }
          {authSending
            && <Loading />
          }
          { this.props.viewDomain.get('form')
            && (
              <AuthForm
                model="userLogin.form.data"
                sending={authSending}
                handleSubmit={(formData) => this.props.handleSubmit(formData)}
                handleCancel={this.props.handleCancel}
                labels={{ submit: intl.formatMessage(messages.submit) }}
                fields={[
                  getEmailField(intl.formatMessage, '.email'),
                  getPasswordField(intl.formatMessage, '.password'),
                ]}
              />
            )
          }
          <BottomLinks>
            <p>
              <FormattedMessage {...messages.registerLinkBefore} />
              <A
                href={ROUTES.REGISTER}
                onClick={(evt) => {
                  if (evt !== undefined && evt.preventDefault) evt.preventDefault();
                  this.props.handleLink(ROUTES.REGISTER, { keepQuery: true });
                }}
              >
                <FormattedMessage {...messages.registerLink} />
                <Icon name="arrowRight" text size="1.5em" sizes={{ mobile: '1em' }} />
              </A>
            </p>
            <p>
              <A
                href={ROUTES.RECOVER_PASSWORD}
                onClick={(evt) => {
                  if (evt !== undefined && evt.preventDefault) evt.preventDefault();
                  this.props.handleLink(ROUTES.RECOVER_PASSWORD, { keepQuery: true });
                }}
              >
                <FormattedMessage {...messages.recoverPasswordLink} />
                <Icon name="arrowRight" text size="1.5em" sizes={{ mobile: '1em' }} />
              </A>
            </p>
          </BottomLinks>
        </ContentNarrow>
        <Footer backgroundImage="footer_home" />
      </>
    );
  }
}

UserLogin.propTypes = {
  viewDomain: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleLink: PropTypes.func.isRequired,
  initialiseForm: PropTypes.func,
  onDismissQueryMessages: PropTypes.func,
  queryMessages: PropTypes.object,
};

UserLogin.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  viewDomain: selectDomain(state),
  queryMessages: selectQueryMessages(state),
});

export function mapDispatchToProps(dispatch) {
  return {
    initialiseForm: () => {
      dispatch(formActions.reset('userLogin.form.data'));
    },
    handleSubmit: (formData) => {
      const jsData = formData.toJS();
      const sanitisedData = Object.keys(jsData).reduce(
        (memo, key) => {
          const value = typeof jsData[key] === 'string'
            ? jsData[key].trim()
            : jsData[key];
          return {
            ...memo,
            [key]: value,
          };
        },
        {},
      );
      dispatch(login(sanitisedData));
      dispatch(dismissQueryMessages());
    },
    handleCancel: () => {
      dispatch(updatePath('/'));
    },
    handleLink: (path, args) => {
      dispatch(updatePath(path, args));
    },
    onDismissQueryMessages: () => {
      dispatch(dismissQueryMessages());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserLogin);
