/*
 * HomePage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';
import { Text, Box, ResponsiveContext } from 'grommet';

import { isMinSize } from 'utils/responsive';

import Container from 'components/styled/Container';
import ContentSimple from 'components/styled/ContentSimple';
import ButtonHero from 'components/buttons/ButtonHero';
import Icon from 'components/Icon';

import appMessages from 'containers/App/messages';

import { ROUTES, VERSION } from 'themes/config';

import Partners from './Partners';
import messages from './messages';

const SectionTop = styled.div`
  position: relative;
  background: ${({ theme }) => theme.global.colors.backgroundX};
  color: ${({ theme }) => theme.global.colors.brand};
  text-align: center;
  min-height: 500px;
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    min-height: calc(100vH - ${({ theme }) => theme.sizes.header.banner.height}px)};
  }
`;
const SectionTopInner = styled((p) => <Box {...p} />)`
  min-height: 500px;
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    height: calc(100vH - ${({ theme }) => theme.sizes.header.banner.height}px)};
  }
`;

const SectionAbout = styled.div`
  padding-top: 120px;
  padding-bottom: 80px;
  color: ${({ theme }) => theme.global.colors.brand};
`;

const HomeActions = styled(
  (p) => <Box fill="horizontal" align="center" justify="center" {...p} />
)`
  min-height: 120px;
`;

const Title = styled.h1`
  font-family: ${(props) => props.theme.fonts.title};
  font-size: ${({ theme }) => theme.text.xxlarge.size};
  line-height: ${({ theme }) => theme.text.xxlarge.size.height};
  margin: 0;
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    font-size: ${({ theme }) => theme.text.xxxlarge.size};
    line-height: ${({ theme }) => theme.text.xxxlarge.size.height};
  }
  @media print {
    font-size: ${(props) => props.theme.sizes.home.print.title};
  }
`;

const Claim = styled.div`
  font-family: ${(props) => props.theme.fonts.claim};
  font-size: ${(props) => props.theme.sizes.home.text.claimMobile};
  font-weight: 100;
  line-height: 1.3;
  font-size: ${({ theme }) => theme.text.large.size};
  line-height: ${({ theme }) => theme.text.large.size.height};
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    font-size: ${({ theme }) => theme.text.xlarge.size};
    line-height: ${({ theme }) => theme.text.xlarge.size.height};
  }
  @media print {
    font-size: ${(props) => props.theme.sizes.home.print.claim};
  }
`;

const Intro = styled(ReactMarkdown)`
  font-size: ${({ theme }) => theme.text.large.size};
  line-height: ${({ theme }) => theme.text.large.height};
  margin: 0 auto;
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    font-size: ${({ theme }) => theme.text.xlarge.size};
    line-height: ${({ theme }) => theme.text.xlarge.height};
    max-width: 666px;
  }
  @media print {
    font-size: ${(props) => props.theme.sizes.print.large};
  }
`;

const MainButton = styled(ButtonHero)`
  max-width: ${({ single }) => single ? 'auto' : '200px'};
  width: 100%;
  display: block;
  margin: 10px auto;
  min-width: auto;
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    display: inline-block;
    margin: 10px 5px 0;
    padding: 0.5em;
    min-width: auto;
    width: ${({ single }) => single ? 'auto' : '200px'};
  }
  @media print {
    display: none;
  }
`;

function Guest({
  intl,
  onPageLink,
}) {
  const size = React.useContext(ResponsiveContext);
  const appTitle = `${intl.formatMessage(appMessages.app.title)} - ${intl.formatMessage(appMessages.app.claim)}`;
  return (
    <>
      <SectionTop>
        <svg
          viewBox="0 0 1920 237"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            width: '100%',
            paddingTop: '20%',
            transform: 'translateY(20%)',
            pointerEvents: 'none',
          }}
        >
          <path
            fill="#e8e8e8"
            d="M715.31,133.53c370.89,39.85,637.13,109.17,835.29,103.09,183.57-5.63,346.41-64.15,369.4-72.73v-75.77S1576.08-29.38,1205.73,6.98c-370.35,36.37-636.21,99.62-834.09,94.07C173.8,95.51,0,33.72,0,33.72v188.72s344.42-128.77,715.31-88.91Z"
          >
          </path>
        </svg>
        <SectionTopInner
          style={{ position: 'relative' }}
          align="center"
          justify="evenly"
          fill="vertical"
          flex={{ grow: 1 }}
        >
          <Box pad={{ top: 'ms' }} align="center" style={{ minHeight: '80px' }}>
            <Icon
              name="brand"
              title={appTitle}
              size={isMinSize(size, 'medium') ? '200px' : '120px'}
            />
          </Box>
          <Box gap="xsmall" align="center">
            <Claim>
              <FormattedMessage {...appMessages.app.claim} />
            </Claim>
            <Title>
              <FormattedMessage {...appMessages.app.title} />
            </Title>
            <Intro source={intl.formatMessage(messages.introGuest, { version: VERSION })} />
          </Box>
          <HomeActions>
            <Box>
              <Text size="small" color="#777b7e">
                <FormattedMessage {...messages.notSignedIn} />
              </Text>
              <Box direction="row" justify="center">
                <MainButton
                  space
                  onClick={() => onPageLink(ROUTES.LOGIN)}
                  count={2}
                >
                  <FormattedMessage {...appMessages.nav.login} />
                </MainButton>
                <MainButton
                  space
                  onClick={() => onPageLink(ROUTES.REGISTER)}
                  count={2}
                >
                  <FormattedMessage {...appMessages.nav.register} />
                </MainButton>
              </Box>
            </Box>
          </HomeActions>
          <Box margin={{ bottom: 'small' }} style={{ minHeight: '58px' }} />
        </SectionTopInner>
      </SectionTop>
      <SectionAbout>
        <Container noPaddingBottom>
          <ContentSimple>
            <h3><FormattedMessage {...appMessages.app.aboutSectionTitle} /></h3>
            <p><FormattedMessage {...appMessages.app.about1} /></p>
            <p><FormattedMessage {...appMessages.app.about2} /></p>
          </ContentSimple>
        </Container>
      </SectionAbout>
      <Partners />
    </>
  );
}

Guest.propTypes = {
  onPageLink: PropTypes.func.isRequired,
  intl: intlShape,
};

// Wrap the component to inject dispatch and state into it
export default injectIntl(Guest);
