import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import styled, { withTheme } from 'styled-components';
import { palette } from 'styled-theme';
import { Box, Button, ResponsiveContext } from 'grommet';
import { SHOW_HEADER_TITLE, ROUTES } from 'themes/config';

import appMessages from 'containers/App/messages';
import Icon from 'components/Icon';
// import ButtonOld from 'components/buttons/Button';
// import ScreenReaderOnly from 'components/styled/ScreenReaderOnly';
// import PrintHide from 'components/styled/PrintHide';

import Brand from './Brand';
import BrandTitle from './BrandTitle';
import BrandClaim from './BrandClaim';
import NavAccount from './NavAccount';

// import Link from './Link';


const Styled = styled.div`
  position: ${(props) => {
    if (props.fixed) {
      return 'fixed';
    }
    return props.sticky ? 'absolute' : 'relative';
  }};
  top: 0;
  left: 0;
  right: 0;
  height:${(props) => {
    if (props.hasBrand) {
      return props.theme.sizes.header.banner.heightMobile;
    }
    return 0;
  }}px;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    height:${(props) => {
    if (props.hasBrand) {
      return props.theme.sizes.header.banner.height;
    }
    return 0;
  }}px;
  }
  background-color: #183863;
  box-shadow: ${(props) => props.hasShadow ? '0px 0px 5px 0px rgba(0,0,0,0.5)' : 'none'};
  z-index: 101;
  @media print {
    display: block;
    height: ${({ theme }) => theme.sizes.header.banner.height}px;
    position: static;
    box-shadow: none;
    background: white;
  }
`;

const LinkPage = styled((p) => <Button plain as="a" {...p} />)`
  color: white;
  background-color:${(props) => props.active ? palette('headerNavPagesItem', 3) : palette('headerNavPagesItem', 2)};
  padding: 8px 0.7em;
  &:hover {
    color: white;
    background-color:${(props) => props.active ? palette('headerNavPagesItemHover', 3) : palette('headerNavPagesItemHover', 3)};
  }
`;
const LinkMain = styled((p) => <Button plain as="a" {...p} />)`
  color: white;
  background-color:${(props) => props.active ? palette('headerNavPagesItem', 3) : palette('headerNavPagesItem', 2)};
  padding: 8px 0.7em;
  &:hover {
    color: white;
    background-color:${(props) => props.active ? palette('headerNavPagesItemHover', 3) : palette('headerNavPagesItemHover', 3)};
  }
  font-weight: 500;
`;


const STATE_INITIAL = {
  showSecondary: false,
};

class Header extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor() {
    super();
    this.state = STATE_INITIAL;
  }

  UNSAFE_componentWillMount() {
    this.setState(STATE_INITIAL);
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize);
    window.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
    window.removeEventListener('mousedown', this.handleClickOutside);
  }

  onShowSecondary = (evt) => {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault();
    // this.setState({ showSecondary: true });
  };

  onHideSecondary = (evt) => {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault();
    // this.setState({ showSecondary: false });
  };

  onClick = (evt, path, currentPath) => {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault();
    if (currentPath) {
      if (currentPath === ROUTES.LOGIN || currentPath === ROUTES.REGISTER) {
        this.props.onPageLink(path, { keepQuery: true });
      } else {
        this.props.onPageLink(path, { query: { arg: 'redirectOnAuthSuccess', value: currentPath } });
      }
    } else {
      this.props.onPageLink(path);
    }
  }

  resize = () => {
    // reset
    this.setState(STATE_INITIAL);
    this.forceUpdate();
  };

  render() {
    const { isAuth, navItems, search } = this.props;
    const { intl } = this.context;
    const appTitle = `${intl.formatMessage(appMessages.app.title)} - ${intl.formatMessage(appMessages.app.claim)}`;
    return (
      <ResponsiveContext.Consumer>
        {() => (
          <Styled
            fixed={isAuth}
            sticky={!isAuth}
            hasBackground={!isAuth}
            hasShadow={!isAuth}
            hasNav={!isAuth}
            hasBrand
          >
            <Box direction="row" fill>
              <Box>
                <Brand
                  href="/"
                  onClick={(evt) => this.onClick(evt, '/')}
                  title={appTitle}
                >
                  {SHOW_HEADER_TITLE && (
                    <Box direction="row" align="center" fill="vertical" pad={{ left: 'small' }}>
                      <BrandClaim>
                        <FormattedMessage {...appMessages.app.claim} />
                      </BrandClaim>
                      <BrandTitle>
                        <FormattedMessage {...appMessages.app.title} />
                      </BrandTitle>
                    </Box>
                  )}
                </Brand>
              </Box>
              <Box flex={{ grow: 1 }} direction="row" align="center" justify="end">
                {search && (
                  <LinkPage
                    href={search.path}
                    active={search.active}
                    onClick={(evt) => this.onClick(evt, search.path)}
                    title={search.title}
                  >
                    {search.title}
                    {search.icon
                      && <Icon title={search.title} name={search.icon} text textRight size="1em" />
                    }
                  </LinkPage>
                )}
                {this.props.pages && this.props.pages.map((page, i) => (
                  <LinkPage
                    key={i}
                    href={page.path}
                    active={page.active || this.props.currentPath === page.path}
                    onClick={(evt) => this.onClick(evt, page.path)}
                  >
                    {page.title}
                  </LinkPage>
                ))}
                {navItems && navItems.map((item, i) => (
                  <LinkMain
                    key={i}
                    href={item.path}
                    active={item.active}
                    onClick={(evt) => {
                      evt.stopPropagation();
                      this.onHideSecondary();
                      this.onClick(evt, item.path);
                    }}
                  >
                    {item.title}
                  </LinkMain>
                ))}
                <NavAccount
                  isSignedIn={this.props.isSignedIn}
                  user={this.props.user}
                  onPageLink={(evt, path, query) => {
                    if (evt !== undefined && evt.stopPropagation) evt.stopPropagation();
                    this.onHideSecondary();
                    this.props.onPageLink(path, query);
                  }}
                  currentPath={this.props.currentPath}
                />
              </Box>
            </Box>
          </Styled>
        )}
      </ResponsiveContext.Consumer>
    );
  }
}

Header.contextTypes = {
  intl: PropTypes.object.isRequired,
};

Header.propTypes = {
  isSignedIn: PropTypes.bool,
  user: PropTypes.object,
  currentPath: PropTypes.string,
  pages: PropTypes.array,
  navItems: PropTypes.array,
  onPageLink: PropTypes.func.isRequired,
  isAuth: PropTypes.bool, // not shown on home page
  theme: PropTypes.object.isRequired,
  search: PropTypes.object,
};

export default withTheme(Header);
