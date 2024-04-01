import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, intlShape, injectIntl } from 'react-intl';
import styled from 'styled-components';
import {
  Box, Text, Image, ResponsiveContext,
} from 'grommet';

import { VERSION, FOOTER } from 'themes/config';
import Container from 'components/styled/Container';
import PrintHide from 'components/styled/PrintHide';
import BoxPrint from 'components/styled/BoxPrint';
import { usePrint } from 'containers/App/PrintContext';

import { isMinSize } from 'utils/responsive';

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

const FooterLink = styled.a`
  font-weight: bold;
  color: ${({ isPrint, theme }) => isPrint ? theme.global.colors.text.secondary : 'white'};
  &:hover {
    color: white;
    text-decoration: underline;
  }
  @media print {
    color: ${({ theme }) => theme.global.colors.text.secondary} !important;
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
function Footer({
  intl,
  backgroundImage,
}) {
  const size = React.useContext(ResponsiveContext);
  const appTitle = `${intl.formatMessage(appMessages.app.claim)} - ${intl.formatMessage(appMessages.app.title)}`;
  const isPrint = usePrint();
  return (
    <FooterMain isPrint={isPrint}>
      {backgroundImage && FOOTER.IMAGE_URLS[backgroundImage] && (
        <PrintHide>
          <Box>
            <Image src={FOOTER.IMAGE_URLS[backgroundImage]} />
          </Box>
        </PrintHide>
      )}
      <FooterContent>
        <Container noPaddingBottom>
          <Box direction={isMinSize(size, 'medium') ? 'row' : 'column'} fill="vertical">
            <BoxPrint
              pad="medium"
              padPrintHorizontal="none"
              fill
              basis="1/2"
            >
              <Text size="small">
                {appTitle}
              </Text>
              <Text size="xsmall">
                {`Version: ${VERSION}`}
              </Text>
            </BoxPrint>
            <PrintHide>
              <Between direction={isMinSize(size, 'medium') ? 'row' : 'column'} />
            </PrintHide>
            <BoxPrint
              pad="medium"
              padPrintHorizontal={0}
              fill
              basis="1/2"
              gap="small"
              style={{ minHeight: '150px' }}
            >
              <Text size="small">
                <FormattedMessage {...messages.disclaimer} />
              </Text>
              <Text size="small">
                <FormattedMessage
                  {...messages.disclaimer2}
                  values={{
                    contact1: (
                      <FooterLink
                        isPrint={isPrint}
                        target="_blank"
                        href={`mailto:${intl.formatMessage(messages.contact.email)}`}
                        title={intl.formatMessage(messages.contact.anchor)}
                      >
                        <FormattedMessage {...messages.contact.anchor} />
                      </FooterLink>
                    ),
                    contact2: (
                      <FooterLink
                        isPrint={isPrint}
                        target="_blank"
                        href={`mailto:${intl.formatMessage(messages.contact2.email)}`}
                        title={intl.formatMessage(messages.contact2.anchor)}
                      >
                        <FormattedMessage {...messages.contact2.anchor} />
                      </FooterLink>
                    ),
                  }}
                />
              </Text>
            </BoxPrint>
          </Box>
        </Container>
      </FooterContent>
    </FooterMain>
  );
}

Footer.propTypes = {
  intl: intlShape.isRequired,
  backgroundImage: PropTypes.string,
};

// Wrap the component to inject dispatch and state into it
export default injectIntl(Footer);
