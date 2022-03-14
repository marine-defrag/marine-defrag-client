import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import styled, { withTheme } from 'styled-components';
import {
  Box, Button, ResponsiveContext, Text,
} from 'grommet';
import { ROUTES } from 'themes/config';
import { isMinSize } from 'utils/responsive';
import appMessages from 'containers/App/messages';
import Icon from 'components/Icon';

import Brand from './Brand';
import BrandTitle from './BrandTitle';
import NavAccount from './NavAccount';
import Logo from './Logo';


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
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
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

const LinkPage = styled((p) => <Button plain as="a" justify="center" fill="vertical" {...p} />)`
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

const Section = styled((p) => <Box {...p} />)`
  border-right: 1px solid black;
`;
const Menu = styled((p) => <Box {...p} />)`
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
    this.setState({ showSecondary: true });
  };

  onHideSecondary = (evt) => {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault();
    this.setState({ showSecondary: false });
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
        {(size) => {
          const wide = isMinSize(size, 'large');
          return (
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
                    <Box direction="row" align="center">
                      <Logo src={this.props.theme.media.headerLogo} alt={appTitle} />
                      <Box fill="vertical" pad={{ left: 'small' }} justify="center">
                        <Text size="xsmall">
                          <FormattedMessage {...appMessages.app.claim} />
                        </Text>
                        <BrandTitle>
                          <FormattedMessage {...appMessages.app.title} />
                        </BrandTitle>
                      </Box>
                    </Box>
                  </Brand>
                </Box>
                {(wide || this.state.showSecondary) && (
                  <Menu
                    flex={{ grow: 1 }}
                    direction={wide ? 'row' : 'column'}
                    align="center"
                    justify="end"
                    wide={wide}
                  >
                    {search && (
                      <Section
                        fill="vertical"
                        justify="center"
                        direction={wide ? 'row' : 'column'}
                      >
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
                      </Section>
                    )}
                    {this.props.pages && (
                      <Section
                        fill="vertical"
                        justify="center"
                        direction={wide ? 'row' : 'column'}
                      >
                        {this.props.pages.map((page, i) => (
                          <LinkPage
                            key={i}
                            href={page.path}
                            active={page.active || this.props.currentPath === page.path}
                            onClick={(evt) => this.onClick(evt, page.path)}
                          >
                            {page.title}
                          </LinkPage>
                        ))}
                      </Section>
                    )}
                    {navItems && (
                      <Section
                        fill="vertical"
                        justify="center"
                        direction={wide ? 'row' : 'column'}
                      >
                        {navItems.map((item, i) => (
                          <LinkPage
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
                          </LinkPage>
                        ))}
                      </Section>
                    )}
                    <Section
                      fill="vertical"
                      justify="center"
                      direction={wide ? 'row' : 'column'}
                    >
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
                    </Section>
                  </Menu>
                )}
              </Box>
            </Styled>
          );
        }}
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
