/*
 * Partners
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';
import { Box, ResponsiveContext } from 'grommet';

import { isMinSize } from 'utils/responsive';

import Container from 'components/styled/Container';
import ContentSimple from 'components/styled/ContentSimple';
import NormalImg from 'components/Img';

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

function Partners({ theme }) {
  return (
    <SectionPartners>
      <Container noPaddingBottom>
        <ContentSimple>
          <ResponsiveContext.Consumer>
            {(size) => (
              <Box direction={isMinSize(size, 'medium') ? 'row' : 'column'}>
                <Partner basis="1/3">
                  <GraphicPartner src={theme.media.logoZUG} alt="A project by ZUG - Zukunft Umwelt Gesellschaft" />
                </Partner>
                <Partner basis="1/3">
                  <GraphicPartner src={theme.media.logoGIZ} alt="Implemented by GIZ - Deut7sche Gesellschft für Internationale Zusammenarbeit (GIZ) GmbH" />
                </Partner>
                <Partner basis="1/3">
                  <GraphicPartner src={theme.media.logoBMUV} alt="On behalf of the Federal Ministry for the Environment, Nature Conservation, Nuclear Safety and Consumer Protection" />
                </Partner>
              </Box>
            )}
          </ResponsiveContext.Consumer>
        </ContentSimple>
      </Container>
    </SectionPartners>
  );
}

Partners.propTypes = {
  theme: PropTypes.object.isRequired,
};

// Wrap the component to inject dispatch and state into it
export default withTheme(Partners);
