/*
 *
 * UserPasswordRecover
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
} from 'utils/forms';

import Icon from 'components/Icon';
import Messages from 'components/Messages';
import Loading from 'components/Loading';
import ContentNarrow from 'components/ContentNarrow';
import ContentHeader from 'components/ContentHeader';
import AuthForm from 'components/forms/AuthForm';
import A from 'components/styled/A';
import Footer from 'containers/Footer';

import { ROUTES } from 'themes/config';

import { updatePath } from 'containers/App/actions';

import messages from './messages';

import { recover } from './actions';
import { selectDomain } from './selectors';

const BottomLinks = styled.div`
  padding: 2em 0;
`;

const MODEL = 'userPasswordRecover.form.data';

export class UserPasswordRecover extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  UNSAFE_componentWillMount() {
    this.props.initialiseForm();
  }

  render() {
    const { intl } = this.context;
    const { error, sending } = this.props.viewDomain.get('page').toJS();

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
        <ContentNarrow>
          <ContentHeader
            title={intl.formatMessage(messages.pageTitle)}
          />
          {error
            && <Messages type="error" messages={error.messages} />
          }
          {sending
            && <Loading />
          }
          {this.props.viewDomain.get('form')
            && (
              <AuthForm
                model={MODEL}
                sending={sending}
                handleSubmit={(formData) => this.props.handleSubmit(formData)}
                handleCancel={this.props.handleCancel}
                labels={{ submit: intl.formatMessage(messages.submit) }}
                fields={[
                  getEmailField(intl.formatMessage, '.email'),
                ]}
              />
            )
          }
          <BottomLinks>
            <p>
              <A
                href={ROUTES.LOGIN}
                onClick={(evt) => {
                  if (evt !== undefined && evt.preventDefault) evt.preventDefault();
                  this.props.handleLink(ROUTES.LOGIN, { keepQuery: true });
                }}
              >
                <FormattedMessage {...messages.loginLink} />
                <Icon name="arrowRight" text size="1.5em" sizes={{ mobile: '1em' }} />
              </A>
            </p>
          </BottomLinks>
        </ContentNarrow>
        <Footer />
      </>
    );
  }
}

UserPasswordRecover.propTypes = {
  viewDomain: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleLink: PropTypes.func.isRequired,
  initialiseForm: PropTypes.func,
};

UserPasswordRecover.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  viewDomain: selectDomain(state),
});

export function mapDispatchToProps(dispatch) {
  return {
    initialiseForm: () => {
      dispatch(formActions.reset(MODEL));
      // dispatch(formActions.change(model, formData, { silent: true }));
    },
    handleSubmit: (formData) => {
      dispatch(recover(formData.toJS()));
    },
    handleCancel: () => {
      dispatch(updatePath('/'));
    },
    handleLink: (path, args) => {
      dispatch(updatePath(path, args));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserPasswordRecover);
