/*
 * Partners
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';
import { Box, ResponsiveContext } from 'grommet';
import { injectIntl, intlShape } from 'react-intl';

import { isMinSize } from 'utils/responsive';

import Container from 'components/styled/Container';
import ContentSimple from 'components/styled/ContentSimple';
import NormalImg from 'components/Img';

import messages from './messages';

const GraphicPartner = styled(NormalImg)`
  width: 100%;
  max-width: 366px;
`;
const SectionPartners = styled.div`
  padding-top: 10px;
  padding-bottom: 50px;
  background: #fff;
`;

const Partner = styled((p) => <Box align="center" justify="center" {...p} />)`
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

const PartnerLink = styled.a`
  &:hover {
    opacity: 0.8;
  }
`;

function Partners({ theme, intl }) {
  const size = React.useContext(ResponsiveContext);
  return (
    <SectionPartners>
      <Container noPaddingBottom>
        <ContentSimple>
          <Box direction={isMinSize(size, 'medium') ? 'row' : 'column'}>
            <Partner basis="1/3">
              <PartnerLink
                href={intl.formatMessage(messages.hrefZUG)}
                target="_blank"
                title={intl.formatMessage(messages.titleZUG)}
              >
                <GraphicPartner
                  src={theme.media.logoZUG}
                  alt={intl.formatMessage(messages.titleZUG)}
                />
              </PartnerLink>
            </Partner>
            <Partner basis="1/3">
              <PartnerLink
                href={intl.formatMessage(messages.hrefGIZ)}
                target="_blank"
                title={intl.formatMessage(messages.titleGIZ)}
              >
                <GraphicPartner
                  src={theme.media.logoGIZ}
                  alt={intl.formatMessage(messages.titleGIZ)}
                />
              </PartnerLink>
            </Partner>
            <Partner basis="1/3">
              <PartnerLink
                href={intl.formatMessage(messages.hrefBMUV)}
                target="_blank"
                title={intl.formatMessage(messages.titleBMUV)}
              >
                <GraphicPartner
                  src={theme.media.logoBMUV}
                  alt={intl.formatMessage(messages.titleBMUV)}
                />
              </PartnerLink>
            </Partner>
          </Box>
        </ContentSimple>
      </Container>
    </SectionPartners>
  );
}

Partners.propTypes = {
  theme: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
};

// Wrap the component to inject dispatch and state into it
export default withTheme(injectIntl(Partners));
