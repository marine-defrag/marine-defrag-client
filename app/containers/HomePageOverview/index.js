/*
 * HomePageOverview
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import ReactMarkdown from 'react-markdown';
import { Map, List } from 'immutable';

import styled, { withTheme } from 'styled-components';
import {
  Box,
  Text,
  Image,
  ResponsiveContext,
  ThemeContext,
} from 'grommet';

import { isMinSize } from 'utils/responsive';

import { loadEntitiesIfNeeded, updatePath } from 'containers/App/actions';
import {
  selectReady,
  selectIsUserAnalyst,
  selectActiontypesWithActionCount,
  selectActortypesWithActorCount,
  selectFactsOrdered,
  selectAuthReady,
} from 'containers/App/selectors';

import Container from 'components/styled/Container';
import ButtonHero from 'components/buttons/ButtonHero';
// import ButtonFlat from 'components/buttons/ButtonFlat';
import Icon from 'components/Icon';
import ContentSimple from 'components/styled/ContentSimple';
import Loading from 'components/Loading';

import appMessages from 'containers/App/messages';

import {
  ROUTES,
  FF_ACTIONTYPE,
  VERSION,
  ACTIONTYPE_GROUPS,
  ACTORTYPE_GROUPS,
  FOOTER,
} from 'themes/config';
import Partners from 'containers/HomePage/Partners';

import TeaserSection from './TeaserSection';
import QuoteSection from './QuoteSection';
import GapSection from './GapSection';
import { DEPENDENCIES } from './constants';

import messages from './messages';

const SectionTop = styled.div`
  position: relative;
  background-color: rgb(24 56 99 / 70%);
  background-color: #183863;
  color: #fff;
  text-align: center;
  min-height: 500px;
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    height: calc(100vH - ${({ theme }) => theme.sizes.header.banner.height}px)};
  }
`;
const SectionTopInner = styled((p) => <Box {...p} />)`
  min-height: 500px;
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    height: calc(100vH - ${({ theme }) => theme.sizes.header.banner.height}px)};
  }
`;
const Section = styled.div`
  padding-top: 60px;
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

const ButtonPage = styled(ButtonHero)`
  display: inline-flex;
  flex-grow: 0;
  padding: 0.2em 0;
  min-width: auto;
  background: transparent;
  color: #0077d8;
  border: 0;
  border-radius: 2px;
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    min-width: auto;
    padding: 0.3em 0;
  }
  &:hover, &:focus-visible {
    background: transparent;
    color: #183863;
    border: 0;
  }
`;

const BackgroundImage = styled(Box)`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  overflow: hidden;
`;

function HomePageOverview({
  intl,
  onUpdatePath,
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

  const actionTypesReady = dataReady
    && actionTypes
    && Object.values(ACTIONTYPE_GROUPS).reduce(
      (memo, group) => ([
        ...memo,
        ...group.types.map(
          (id) => actionTypes.get(id) ? actionTypes.get(id).toJS() : { id }
        ),
      ]),
      [],
    );
  const actorTypesReady = dataReady
    && actorTypes
    && Object.values(ACTORTYPE_GROUPS).filter(
      (group) => !group.managerOnly
    ).reduce(
      (memo, group) => ([
        ...memo,
        ...group.types.map(
          (id) => actorTypes.get(id) ? actorTypes.get(id).toJS() : { id }
        ),
      ]),
      [],
    );
  return (
    <div>
      <SectionTop>
        <BackgroundImage>
          <Image
            src={FOOTER.IMAGE_URLS.home_top}
            style={{ opacity: 0.33 }}
            fit="cover"
          />
        </BackgroundImage>
        <svg
          viewBox="0 0 1920 377"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            width: '100%',
            paddingTop: '20%',
            transform: 'translateY(25%)',
            pointerEvents: 'none',
          }}
        >
          <path
            fill="#183863"
            d="M1920,88.05S1575.51-29.36,1205.3,6.98c-370.21,36.34-635.98,99.54-833.78,94C173.73,95.44,0,33.7,0,33.7v217.87h1920V88.05Z"
          />
          <path
            fill="#00214d"
            d="M1920,162.71s-171.87,67.66-369.96,73.73c-198.09,6.07-464.23-63.19-834.99-103.01C344.29,93.61,0,222.27,0,222.27v87.1s173.73,61.74,371.51,67.28c197.8,5.54,463.57-57.66,833.78-94,370.21-36.34,714.7,81.07,714.7,81.07"
          />
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
            <Intro source={intl.formatMessage(messages.intro, { version: VERSION })} />
          </Box>
          <HomeActions>
            {!authReady && (
              <Box style={{ width: '66%' }}>
                <Loading />
              </Box>
            )}
            {authReady && !isUserAnalyst && (
              <Box align="center" margin={{ bottom: 'xsmall' }}>
                <Text as="div" size="xlarge" color="white" style={{ maxWidth: '600px' }}>
                  <FormattedMessage {...messages.noRoleAssigned} />
                </Text>
                <MainButton
                  space
                  onClick={() => {
                    onUpdatePath(
                      ROUTES.CONTACT,
                      {
                        query: {
                          arg: 'subject',
                          value: 'access',
                        },
                      },
                    );
                  }}
                  count={1}
                >
                  Request Access
                </MainButton>
              </Box>
            )}
            {authReady && isUserAnalyst && (
              <Box>
                <Text size="small">
                  <FormattedMessage {...messages.goTo} />
                </Text>
                <Box
                  direction={isMinSize(size, 'ms') ? 'row' : 'column'}
                  justify="center"
                >
                  <MainButton
                    space
                    onClick={() => onUpdatePath(ROUTES.ACTIONS)}
                    count={3}
                  >
                    <FormattedMessage {...appMessages.nav.actions} />
                  </MainButton>
                  <MainButton
                    space
                    onClick={() => onUpdatePath(ROUTES.ACTORS)}
                    count={3}
                  >
                    <FormattedMessage {...appMessages.nav.actors} />
                  </MainButton>
                  <MainButton
                    space
                    onClick={() => onUpdatePath(`${ROUTES.ACTIONS}/${FF_ACTIONTYPE}`)}
                    count={3}
                  >
                    <FormattedMessage {...appMessages.actiontypes[FF_ACTIONTYPE]} />
                  </MainButton>
                </Box>
              </Box>
            )}
          </HomeActions>
          <Box margin={{ bottom: 'small' }} style={{ minHeight: '58px' }}>
            <Icon name="arrowCircle" rotate={90} />
          </Box>
        </SectionTopInner>
      </SectionTop>
      {(!authReady || !dataReady) && isUserAnalyst && (
        <Section
          style={{
            background: theme.global.colors.backgroundX,
            minHeight: '0.5vH',
          }}
        />
      )}
      {authReady && isUserAnalyst && (
        <>
          <Section
            style={{
              background: theme.global.colors.backgroundX,
              paddingTop: '10%',
            }}
          />
          <TeaserSection
            title={intl.formatMessage(appMessages.nav.actions)}
            teaser={intl.formatMessage(messages.teaserActions)}
            overviewPath={ROUTES.ACTIONS}
            getCardPath={(typeId) => `${ROUTES.ACTIONS}/${typeId}`}
            onUpdatePath={onUpdatePath}
            getCardTitle={
              (type) => intl.formatMessage(appMessages.actiontypes_long[type.id])
            }
            getCardGraphic={
              (typeId) => theme.media.navCard.activities[typeId]
            }
            cards={actionTypesReady || null}
          />
          <QuoteSection
            quote={intl.formatMessage(messages.quote)}
            source={intl.formatMessage(messages.quoteSource)}
          />
          <TeaserSection
            title={intl.formatMessage(appMessages.nav.actors)}
            teaser={intl.formatMessage(messages.teaserActors)}
            overviewPath={ROUTES.ACTORS}
            getCardPath={(typeId) => `${ROUTES.ACTORS}/${typeId}`}
            getCardTitle={
              (type) => intl.formatMessage(appMessages.actortypes_long[type.id])
            }
            getCardGraphic={
              (typeId) => theme.media.navCard.actors[typeId]
            }
            onUpdatePath={onUpdatePath}
            cards={actorTypesReady || null}
          />
          <GapSection />
          <TeaserSection
            title={intl.formatMessage(appMessages.actiontypes[FF_ACTIONTYPE])}
            teaser={intl.formatMessage(messages.teaserFacts)}
            overviewPath={`${ROUTES.ACTIONS}/${FF_ACTIONTYPE}`}
            getCardPath={(factId) => `${ROUTES.ACTION}/${factId}`}
            getCardTitle={(fact) => fact.attributes.title}
            getCardGraphic={
              (factId) => theme.media.navCard.indicators[factId]
            }
            onUpdatePath={onUpdatePath}
            cards={facts ? facts.toJS() : null}
          />
        </>
      )}
      <Section style={{ background: '#f1f0f1', position: 'relative' }}>
        <svg
          viewBox="0 0 1920 190"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            width: '100%',
          }}
        >
          <path
            fill="#fff"
            d="M1920,88.05S1575.51-29.36,1205.3,6.98c-370.21,36.34-635.98,99.54-833.78,94C173.73,95.44,0,33.7,0,33.7v217.87h1920V88.05Z"
          />
        </svg>
      </Section>
      <Section style={{ background: '#fff' }}>
        <Container noPaddingBottom>
          <ContentSimple>
            <Box>
              <h3><FormattedMessage {...appMessages.app.aboutSectionTitle} /></h3>
              <p><FormattedMessage {...appMessages.app.about1} /></p>
              <p><FormattedMessage {...appMessages.app.about2} /></p>
            </Box>
            <Box direction="row" gap="medium">
              <ButtonPage
                onClick={() => {
                  onUpdatePath(`${ROUTES.PAGES}/${FOOTER.LINK_TARGET_ABOUT_ID}`);
                }}
              >
                <Box direction="row" gap="xsmall" justify="center" align="center">
                  <Text size="large">Read more</Text>
                  <Icon name="arrow" />
                </Box>
              </ButtonPage>
              <ButtonPage
                onClick={() => {
                  onUpdatePath(`${ROUTES.PAGES}/${FOOTER.LINK_TARGET_NEW_ID}`);
                }}
              >
                <Box direction="row" gap="xsmall" justify="center" align="center">
                  <Text size="large">What&apos;s new</Text>
                  <Icon name="arrow" />
                </Box>
              </ButtonPage>
            </Box>
          </ContentSimple>
        </Container>
      </Section>
      <Partners />
    </div>
  );
}

HomePageOverview.propTypes = {
  onUpdatePath: PropTypes.func.isRequired,
  actionTypes: PropTypes.instanceOf(Map),
  actorTypes: PropTypes.instanceOf(Map),
  facts: PropTypes.instanceOf(List),
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
  facts: selectFactsOrdered(state),
});

function mapDispatchToProps(dispatch) {
  return {
    onLoadEntitiesIfNeeded: () => {
      DEPENDENCIES.forEach((path) => dispatch(loadEntitiesIfNeeded(path)));
    },
    onUpdatePath: (path, args) => {
      dispatch(updatePath(path, args));
    },
  };
}

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(withTheme(HomePageOverview)));
