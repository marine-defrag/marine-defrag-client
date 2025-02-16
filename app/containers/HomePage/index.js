/*
 * HomePage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import styled from 'styled-components';

import { updatePath } from 'containers/App/actions';
import {
  selectIsSigningIn,
  selectIsSignedIn,
  // selectReady,
} from 'containers/App/selectors';
import Loading from 'components/Loading';

import HomePageOverview from 'containers/HomePageOverview';
import Footer from 'containers/Footer';

import Guest from './Guest';
// import { DEPENDENCIES } from './constants';

import messages from './messages';

const Styled = styled.div`
  background: ${({ theme }) => theme.global.colors.background};
`;

export class HomePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { intl } = this.context;
    const {
      onPageLink,
      isUserSigningIn,
      isUserSignedIn,
      // dataReady,
    } = this.props;
    return (
      <Styled>
        <Helmet
          title={intl.formatMessage(messages.pageTitle)}
          meta={[
            { name: 'description', content: intl.formatMessage(messages.metaDescription) },
          ]}
        />
        {isUserSigningIn && !isUserSignedIn && (
          <Loading />
        )}
        {!isUserSigningIn && !isUserSignedIn && (
          <Guest
            onPageLink={onPageLink}
          />
        )}
        {isUserSignedIn && (
          <HomePageOverview />
        )}
        <Footer backgroundImage="footer_actions" />
      </Styled>
    );
  }
}

HomePage.propTypes = {
  onPageLink: PropTypes.func.isRequired,
  isUserSigningIn: PropTypes.bool,
  isUserSignedIn: PropTypes.bool,
};

HomePage.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  isUserSigningIn: selectIsSigningIn(state),
  isUserSignedIn: selectIsSignedIn(state),
});

function mapDispatchToProps(dispatch) {
  return {
    onPageLink: (path) => {
      dispatch(updatePath(path));
    },
  };
}

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
