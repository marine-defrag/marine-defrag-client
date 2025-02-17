/*
 * HomePageOverview
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import ReactMarkdown from 'react-markdown';
import { Map, OrderedMap } from 'immutable';

import styled, { withTheme } from 'styled-components';
import {
  Box,
  Text,
  ResponsiveContext,
  ThemeContext,
} from 'grommet';

import { isMinSize } from 'utils/responsive';
import qe from 'utils/quasi-equals';

import { loadEntitiesIfNeeded, updatePath } from 'containers/App/actions';
import {
  selectReady,
  selectIsUserAnalyst,
  selectActiontypesWithActionCount,
  selectActortypesWithActorCount,
  selectActiontypeActions,
  selectAuthReady,
} from 'containers/App/selectors';

import Container from 'components/styled/Container';
import ButtonHero from 'components/buttons/ButtonHero';
// import ButtonFlat from 'components/buttons/ButtonFlat';
import NormalImg from 'components/Img';
import ContentSimple from 'components/styled/ContentSimple';
import Loading from 'components/Loading';

import appMessages from 'containers/App/messages';

import { ROUTES, FF_ACTIONTYPE, VERSION } from 'themes/config';

import TeaserSection from './TeaserSection';
import { DEPENDENCIES } from './constants';

import messages from './messages';

const GraphicHome = styled(NormalImg)`
  width: 100px;
`;
const SectionTop = styled.div`
  background-color: #183863;
  color: #fff;
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
  margin-left: auto;
  margin-right: auto;
  @media (min-width: ${(props) => props.theme.breakpoints.large}) {
    font-size: ${({ hint, theme }) => theme.text[hint ? 'medium' : 'large'].size};
    line-height: ${({ hint, theme }) => theme.text[hint ? 'medium' : 'large'].height};
    max-width: 666px;
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

function HomePageOverview({
  intl,
  onPageLink,
  dataReady,
  authReady,
  onLoadEntitiesIfNeeded,
  isUserAnalyst,
  actionTypes,
  actorTypes,
  facts, // actions for fact actiontype
}) {
  React.useEffect(() => {
    if (!dataReady) onLoadEntitiesIfNeeded();
  }, [dataReady]);
  const size = React.useContext(ResponsiveContext);
  const theme = React.useContext(ThemeContext);

  const appTitle = `${intl.formatMessage(appMessages.app.title)} - ${intl.formatMessage(appMessages.app.claim)}`;
  return (
    <div>
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
            <Intro source={intl.formatMessage(messages.intro, { version: VERSION })} />
          </Box>
          {!authReady && (
            <Loading />
          )}
          {authReady && !isUserAnalyst && (
            <div>
              <Text as="div" size="small">
                <FormattedMessage {...messages.noRoleAssigned} />
              </Text>
            </div>
          )}
          {authReady && isUserAnalyst && (
            <HomeActions>
              <Box>
                <Box>
                  <Intro hint source={intl.formatMessage(messages.goTo)} />
                </Box>
                <Box direction="row" justify="center">
                  <MainButton
                    space
                    onClick={() => onPageLink(ROUTES.ACTIONS)}
                    count={3}
                  >
                    <FormattedMessage {...appMessages.nav.actions} />
                  </MainButton>
                  <MainButton
                    space
                    onClick={() => onPageLink(ROUTES.ACTORS)}
                    count={3}
                  >
                    <FormattedMessage {...appMessages.nav.actors} />
                  </MainButton>
                  <MainButton
                    space
                    onClick={() => onPageLink(`${ROUTES.ACTIONS}/${FF_ACTIONTYPE}`)}
                    count={3}
                  >
                    <FormattedMessage {...appMessages.actiontypes[FF_ACTIONTYPE]} />
                  </MainButton>
                </Box>
              </Box>
            </HomeActions>
          )}
        </Container>
      </SectionTop>
      <TeaserSection
        title={intl.formatMessage(appMessages.nav.actions)}
        teaser={intl.formatMessage(messages.teaserActions)}
        type="actions"
        cards={actionTypes && actionTypes.filter((t) => !qe(t.id, FF_ACTIONTYPE))}
      />
      <TeaserSection
        title={intl.formatMessage(appMessages.nav.actors)}
        teaser={intl.formatMessage(messages.teaserActors)}
        type="actors"
        cards={actorTypes}
      />
      <TeaserSection
        title={intl.formatMessage(appMessages.actiontypes[FF_ACTIONTYPE])}
        teaser={intl.formatMessage(messages.teaserFacts)}
        type="facts"
        cards={facts}
      />
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
          </ContentSimple>
        </Container>
      </SectionPartners>
    </div>
  );
}

HomePageOverview.propTypes = {
  onPageLink: PropTypes.func.isRequired,
  actionTypes: PropTypes.instanceOf(Map),
  actorTypes: PropTypes.instanceOf(Map),
  facts: PropTypes.instanceOf(OrderedMap),
  theme: PropTypes.object.isRequired,
  authReady: PropTypes.bool,
  dataReady: PropTypes.bool,
  onLoadEntitiesIfNeeded: PropTypes.func,
  isUserAnalyst: PropTypes.bool,
  intl: intlShape,
};

const mapStateToProps = (state) => ({
  authReady: selectAuthReady(state),
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  isUserAnalyst: selectIsUserAnalyst(state),
  actionTypes: selectActiontypesWithActionCount(state),
  actorTypes: selectActortypesWithActorCount(state),
  facts: selectActiontypeActions(state, { type: FF_ACTIONTYPE }),
});

function mapDispatchToProps(dispatch) {
  return {
    onLoadEntitiesIfNeeded: () => {
      DEPENDENCIES.forEach((path) => dispatch(loadEntitiesIfNeeded(path)));
    },
    onPageLink: (path) => {
      dispatch(updatePath(path));
    },
  };
}

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(withTheme(HomePageOverview)));
