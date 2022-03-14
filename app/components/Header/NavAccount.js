import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import styled from 'styled-components';
import { palette } from 'styled-theme';
import { Button } from 'grommet';

import { ROUTES } from 'themes/config';
import { PARAMS } from 'containers/App/constants';
import appMessages from 'containers/App/messages';

import messages from './messages';


const Styled = styled.div`
  background-color: ${palette('headerNavAccount', 0)};
`;

const LinkAccount = styled((p) => <Button plain as="a" justify="center" fill="vertical" {...p} />)`
  color: white;
  background-color:${({ theme, active }) => active ? theme.global.colors.highlight : 'transparent'};
  padding-right: 12px;
  padding-left: 12px;
  padding-top: 16px;
  font-size: ${({ theme }) => theme.text.small.size};
  line-height: ${({ theme }) => theme.text.small.height};
  &:hover {
    color: white;
    background-color:${({ theme }) => theme.global.colors.highlightHover};
  }
`;

class NavAccount extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  onClick = (evt, path, currentPath) => {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault();
    if (currentPath) {
      if (currentPath === ROUTES.LOGIN || currentPath === ROUTES.REGISTER) {
        this.props.onPageLink(evt, path, { keepQuery: true });
      } else {
        this.props.onPageLink(evt, path, {
          query: {
            arg: PARAMS.REDIRECT_ON_AUTH_SUCCESS,
            value: currentPath,
          },
        });
      }
    } else {
      this.props.onPageLink(evt, path);
    }
  }

  render() {
    const { isSignedIn, currentPath, user } = this.props;

    const userPath = user ? `${ROUTES.USERS}/${user.id}` : '';
    return (
      <Styled>
        {isSignedIn && user
          && (
            <LinkAccount
              href={ROUTES.BOOKMARKS}
              active={currentPath === ROUTES.BOOKMARKS}
              onClick={(evt) => this.onClick(evt, ROUTES.BOOKMARKS)}
            >
              <FormattedMessage {...appMessages.nav.bookmarks} />
            </LinkAccount>
          )
        }
        {isSignedIn && user
          && (
            <LinkAccount
              href={userPath}
              active={currentPath === userPath}
              onClick={(evt) => this.onClick(evt, userPath)}
            >
              Profile
            </LinkAccount>
          )
        }
        {isSignedIn && !user
          && (
            <LinkAccount>
              <FormattedMessage {...messages.userLoading} />
            </LinkAccount>
          )
        }
        {isSignedIn
          && (
            <LinkAccount
              href={ROUTES.LOGOUT}
              active={currentPath === ROUTES.LOGOUT}
              onClick={(evt) => this.onClick(evt, ROUTES.LOGOUT)}
            >
              <FormattedMessage {...appMessages.nav.logout} />
            </LinkAccount>
          )
        }
        {!isSignedIn
          && (
            <LinkAccount
              href={ROUTES.REGISTER}
              active={currentPath === ROUTES.REGISTER}
              onClick={(evt) => this.onClick(evt, ROUTES.REGISTER, currentPath)}
            >
              <FormattedMessage {...appMessages.nav.register} />
            </LinkAccount>
          )
        }
        {!isSignedIn
          && (
            <LinkAccount
              href={ROUTES.LOGIN}
              active={currentPath === ROUTES.LOGIN}
              onClick={(evt) => this.onClick(evt, ROUTES.LOGIN, currentPath)}
            >
              <FormattedMessage {...appMessages.nav.login} />
            </LinkAccount>
          )
        }
      </Styled>
    );
  }
}
NavAccount.propTypes = {
  isSignedIn: PropTypes.bool,
  user: PropTypes.object,
  currentPath: PropTypes.string,
  onPageLink: PropTypes.func.isRequired,
};

export default NavAccount;
