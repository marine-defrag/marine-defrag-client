import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, intlShape, injectIntl } from 'react-intl';
import styled from 'styled-components';
import {
  Box, Text, Image, ResponsiveContext, Button,
} from 'grommet';

import {
  updatePath,
  loadEntitiesIfNeeded,
} from 'containers/App/actions';
import {
  selectEntitiesWhere,
  selectIsSignedIn,
  selectReady,
} from 'containers/App/selectors';

import {
  API,
  VERSION,
  FOOTER,
  ROUTES,
} from 'themes/config';

import Container from 'components/styled/Container';
import ContentSimple from 'components/styled/ContentSimple';

import PrintHide from 'components/styled/PrintHide';
import BoxPrint from 'components/styled/BoxPrint';
import { usePrint } from 'containers/App/PrintContext';

import { isMinSize, isMaxSize } from 'utils/responsive';
import { sortEntities } from 'utils/sort';

import appMessages from 'containers/App/messages';
import messages from './messages';

const FooterMain = styled.div``;
const FooterContent = styled.div`
  background-color: ${({ isPrint }) => isPrint ? 'transparent' : '#183863'};
  color: ${({ isPrint, theme }) => isPrint ? theme.global.colors.text.secondary : 'white'};
  border-top: 1px solid;
  border-color: ${({ isPrint, theme }) => isPrint ? theme.global.colors.text.secondary : 'transparent'};
  padding: 0;
  @media print {
    color: ${({ theme }) => theme.global.colors.text.secondary} !important;
    border-color: ${({ theme }) => theme.global.colors.text.secondary};
    background: transparent;
  }
`;

const ImageCredit = styled(Box)`
  position: absolute;
  right: 0;
  bottom: 0;
  padding: 2px 6px;
  margin: 6px;
  background-color: rgba(255, 255, 255, 0.66);
`;

const FooterLinkPage = styled((p) => <Button plain as="a" justify="center" fill="vertical" {...p} />)`
  color: ${({ isPrint, theme }) => isPrint ? theme.global.colors.text.secondary : 'white'};
  background-color: rgba(255,255,255,0.1);
  padding-right: 12px;
  padding-left: 12px;
  padding-top: 16px;
  padding-bottom: 16px;
  text-align: center;
  font-size: ${({ theme }) => theme.text.small.size};
  line-height: ${({ theme }) => theme.text.small.height};
  font-weight: 300;
  &:hover {
    color: ${({ isPrint, theme }) => isPrint ? theme.global.colors.text.secondary : 'white'};
    background-color:${({ theme }) => theme.global.colors.highlightHover};
  }
  &:focus-visible {
    outline-color: transparent;
    border-color: none;
    box-shadow: none;
    outline-offset: 0;
    background-color:${({ theme }) => theme.global.colors.highlightHover};
  }
`;

const Between = styled((p) => <Box plain {...p} />)`
  flex: 0 0 auto;
  align-self: stretch;
  width: ${({ direction }) => direction === 'row' ? '1px' : '100%'};
  position: relative;
  &:after {
    content: "";
    position: absolute;
    height: 100%;
    width: 100%;
    left: 0;
    top: 0;
    border-left: ${({ direction }) => direction === 'row' ? 1 : 0}px solid rgba(0, 0, 0, 1);
    border-top: ${({ direction }) => direction === 'column' ? 1 : 0}px solid rgba(0, 0, 0, 1);
  }
`;

export const DEPENDENCIES = [API.PAGES];

function Footer({
  intl,
  backgroundImage,
  pages,
  hasContactLink,
  onPageLink,
  backgroundColor,
  dataReady,
  onLoadData,
}) {
  React.useEffect(() => {
    // kick off loading of data
    onLoadData();
  }, []);
  const size = React.useContext(ResponsiveContext);
  const isMobile = isMaxSize(size, 'small');
  const appTitle = `${intl.formatMessage(appMessages.app.claim)} - ${intl.formatMessage(appMessages.app.title)}`;
  const isPrint = usePrint();
  const footerPages = dataReady && pages && sortEntities(
    pages.filter((page) => page.getIn(['attributes', 'order']) < 0),
    'desc',
    'order',
    'number'
  );
  const hasFooterPages = (footerPages && footerPages.size > 0) || hasContactLink;

  return (
    <FooterMain isPrint={isPrint}>
      {backgroundImage && FOOTER.IMAGE_URLS[backgroundImage] && (
        <PrintHide>
          <Box
            style={{
              position: 'relative',
              background: backgroundColor ? '#f1f0f1' : 'transparent',
            }}
          >
            <Image src={FOOTER.IMAGE_URLS[backgroundImage]} />
            <ImageCredit>
              <Text size="xxxsmall">
                <FormattedMessage {...messages.imageCredit[backgroundImage]} />
              </Text>
            </ImageCredit>
          </Box>
        </PrintHide>
      )}
      <FooterContent isPrint={isPrint}>
        <Container noPaddingBottom>
          <Box
            direction={isMinSize(size, 'medium') ? 'row' : 'column'}
            fill="vertical"
            style={{ minHeight: '150px' }}
          >
            <BoxPrint
              pad={{ top: 'medium' }}
              fill
              basis="1/2"
            >
              <ContentSimple>
                <Box gap="xsmall">
                  <Text size="small" as="div">
                    <FormattedMessage {...messages.disclaimer} />
                  </Text>
                  {hasContactLink && !isPrint && (
                    <Text size="small" as="div">
                      <FormattedMessage {...messages.contactHint} />
                    </Text>
                  )}
                </Box>
              </ContentSimple>
            </BoxPrint>
            <PrintHide>
              <Between direction={isMinSize(size, 'medium') ? 'row' : 'column'} />
            </PrintHide>
            <BoxPrint
              pad={{ top: 'medium' }}
              fill
              basis="1/2"
            >
              <ContentSimple>
                <Text size="small" as="div">
                  {appTitle}
                </Text>
                <Text size="small" as="div">
                  {`Version: ${VERSION}`}
                </Text>
              </ContentSimple>
            </BoxPrint>
          </Box>
          <PrintHide>
            {hasFooterPages && (
              <Box gap={isMobile ? 'medium' : 'xsmall'}>
                <Box
                  direction={isMobile ? 'column' : 'row'}
                  justify={isMobile ? 'start' : 'between'}
                  align="start"
                  gap={isMobile ? 'small' : 'none'}
                >
                  <ContentSimple>
                    <Box
                      direction={isMobile ? 'column' : 'row'}
                      gap="hair"
                      align={isMobile ? 'start' : 'end'}
                    >
                      {hasContactLink && (
                        <FooterLinkPage
                          href={ROUTES.CONTACT}
                          onClick={(evt) => {
                            if (evt !== undefined && evt.preventDefault) evt.preventDefault();
                            onPageLink(ROUTES.CONTACT);
                          }}
                        >
                          <FormattedMessage {...messages.contactUs} />
                        </FooterLinkPage>
                      )}
                      {footerPages && footerPages.size > 0 && footerPages.toList().map((page) => (
                        <FooterLinkPage
                          key={page.get('id')}
                          onClick={(evt) => {
                            if (evt !== undefined && evt.preventDefault) evt.preventDefault();
                            onPageLink(`${ROUTES.PAGES}/${page.get('id')}`);
                          }}
                          href={`${ROUTES.PAGES}/${page.get('id')}`}
                        >
                          {page.getIn(['attributes', 'menu_title']) || page.getIn(['attributes', 'title'])}
                        </FooterLinkPage>
                      ))}
                    </Box>
                  </ContentSimple>
                </Box>
              </Box>
            )}
          </PrintHide>
        </Container>
      </FooterContent>
    </FooterMain>
  );
}

Footer.propTypes = {
  intl: intlShape.isRequired,
  onLoadData: PropTypes.func,
  backgroundImage: PropTypes.string,
  onPageLink: PropTypes.func.isRequired,
  hasContactLink: PropTypes.bool,
  backgroundColor: PropTypes.bool,
  dataReady: PropTypes.bool,
  pages: PropTypes.object,
};

const mapStateToProps = (state) => ({
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  pages: selectEntitiesWhere(state, {
    path: 'pages',
    where: { draft: false },
  }),
  hasContactLink: selectIsSignedIn(state),
});

function mapDispatchToProps(dispatch) {
  return {
    onLoadData: () => {
      DEPENDENCIES.forEach((path) => dispatch(loadEntitiesIfNeeded(path)));
    },
    onPageLink: (path) => {
      dispatch(updatePath(path));
    },
  };
}


// Wrap the component to inject dispatch and state into it
export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Footer));
