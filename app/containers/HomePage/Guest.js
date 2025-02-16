/*
 * HomePage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import ReactMarkdown from 'react-markdown';
import styled, { withTheme } from 'styled-components';
import { Box, ResponsiveContext } from 'grommet';

import { isMinSize } from 'utils/responsive';

import Container from 'components/styled/Container';
import ContentSimple from 'components/styled/ContentSimple';
import ButtonHero from 'components/buttons/ButtonHero';
// import ButtonFlat from 'components/buttons/ButtonFlat';
import NormalImg from 'components/Img';

import appMessages from 'containers/App/messages';

import { ROUTES, VERSION } from 'themes/config';

import messages from './messages';

const GraphicHome = styled(NormalImg)`
  width: 100px;
`;
const SectionTop = styled.div`
  background: ${({ theme }) => theme.global.colors.backgroundX};
  color: ${({ theme }) => theme.global.colors.brand};
  text-align: center;
  padding-top: 80px;
`;
const SectionAbout = styled.div`
  padding-top: 60px;
  padding-bottom: 80px;
  color: ${({ theme }) => theme.global.colors.brand};
`;
const SectionPartners = styled.div`
  padding-top: 10px;
  padding-bottom: 50px;
`;

const Partner = styled((p) => <Box {...p} />)`
  padding: 20px 50px 0;
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    border-right: 1px solid #b5babe;
    border-left: 1px solid #b5babe;
    &:first-child {
      border-left-color: transparent;
    }
    &:last-child {
      border-right-color: transparent;
    }
  }
`;

const HomeActions = styled.div`
  margin-top: 30px;
  margin-bottom: 50px;
  @media (min-width: ${(props) => props.theme.breakpoints.large}) {
    margin-top: 50px;
  }
`;
const Title = styled.h1`
  margin: 5px 0 20px;
  color: ${({ theme }) => theme.global.colors.brand};
  font-family: ${(props) => props.theme.fonts.title};
  font-size: ${({ theme }) => theme.text.xxlarge.size};
  line-height: ${({ theme }) => theme.text.xxlarge.size.height};
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    font-size: ${({ theme }) => theme.text.xxxlarge.size};
    line-height: ${({ theme }) => theme.text.xxxlarge.size.height};
  }
  @media print {
    font-size: ${(props) => props.theme.sizes.home.print.title};
  }
`;

const Claim = styled.p`
  color: ${({ theme }) => theme.global.colors.text.brand};
  font-family: ${(props) => props.theme.fonts.claim};
  font-size: ${(props) => props.theme.sizes.home.text.claimMobile};
  font-weight: 100;
  margin-left: auto;
  margin-right: auto;
  margin-top: 20px;
  margin-bottom: 0px;
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
  font-size: ${({ hint, theme }) => theme.text[hint ? 'small' : 'medium'].size};
  line-height: ${({ hint, theme }) => theme.text[hint ? 'small' : 'medium'].height};
  color: ${({ hint, theme }) => theme.global.colors.text[hint ? 'secondary' : 'brand']};
  margin-left: auto;
  margin-right: auto;
  @media (min-width: ${(props) => props.theme.breakpoints.large}) {
    font-size: ${({ hint, theme }) => theme.text[hint ? 'medium' : 'large'].size};
    line-height: ${({ hint, theme }) => theme.text[hint ? 'medium' : 'large'].height};
  }
  @media print {
    font-size: ${(props) => props.theme.sizes.print.large};
  }
`;

const MainButton = styled(ButtonHero)`
  max-width: ${({ single }) => single ? 'auto' : '250px'};
  width: 100%;
  display: block;
  margin: 10px auto;
  min-width: auto;
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    display: inline-block;
    margin: 10px 5px 0;
    min-width: auto;
    width: ${({ single }) => single ? 'auto' : '250px'};
  }
  @media print {
    display: none;
  }
`;

function Guest({
  intl,
  theme,
  onPageLink,
}) {
  const appTitle = `${intl.formatMessage(appMessages.app.title)} - ${intl.formatMessage(appMessages.app.claim)}`;
  return (
    <>
      <SectionTop>
        <Container>
          <GraphicHome src={theme.media.graphicHome} alt={appTitle} />
          <Box>
            <Claim>
              <FormattedMessage {...appMessages.app.claim} />
            </Claim>
            <Title>
              <FormattedMessage {...appMessages.app.title} />
            </Title>
          </Box>
          <Box>
            <Intro source={intl.formatMessage(messages.introGuest, { version: VERSION })} />
          </Box>
          <HomeActions>
            <Box>
              <Box>
                <Intro hint source={intl.formatMessage(messages.notSignedIn)} />
              </Box>
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
        </Container>
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
      <SectionPartners>
        <Container noPaddingBottom>
          <ContentSimple>
            <ResponsiveContext.Consumer>
              {(size) => (
                <Box direction={isMinSize(size, 'medium') ? 'row' : 'column'}>
                  <Partner basis="1/3">
                    ZUG LOGO
                  </Partner>
                  <Partner basis="1/3">
                    GIZ LOGO
                  </Partner>
                  <Partner basis="1/3">
                    BMU LOGO
                  </Partner>
                </Box>
              )}
            </ResponsiveContext.Consumer>
          </ContentSimple>
        </Container>
      </SectionPartners>
    </>
  );
}

Guest.propTypes = {
  onPageLink: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
  intl: intlShape,
};

// Wrap the component to inject dispatch and state into it
export default injectIntl(withTheme(Guest));
