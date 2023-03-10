import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import styled, { withTheme } from 'styled-components';
import {
  Box, Text, Heading,
} from 'grommet';
import appMessages from 'containers/App/messages';
import Logo from './Logo';

const Brand = styled.div`
  color: ${({ theme }) => theme.global.colors.text.brand} !important;
  height: ${(props) => props.theme.sizes.header.banner.heightMobile}px;
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    height: ${(props) => props.theme.sizes.header.banner.height}px;
  }
`;
const Styled = styled.div`
  display: block;
  height: ${({ theme }) => theme.sizes.header.banner.heightPrint}px;
  position: relative;
  box-shadow: none;
  background: white;
  top: 0;
  left: 0;
  right: 0;
  margin-bottom: 50px;
  border-bottom: 1px solid #CECED2;
`;
const Claim = styled((p) => <Text {...p} />)`
  font-family: ${(props) => props.theme.fonts.title};
  font-size: ${(props) => props.theme.text.xxsmall.size};
  line-height: ${(props) => props.theme.text.xxsmall.size};
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    font-size: ${(props) => props.theme.text.xsmall.size};
    line-height: ${(props) => props.theme.text.xsmall.size};
  }
`;
const BrandTitle = styled((p) => <Heading level={1} {...p} />)`
  margin: 0;
  font-family: ${(props) => props.theme.fonts.title};
  font-size: ${(props) => props.theme.sizes.header.print.title};
  line-height: ${(props) => props.theme.text.small.size};
  font-weight: 500;
  padding: 0;
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    font-size: ${(props) => props.theme.text.large.size};
    line-height: ${(props) => props.theme.text.large.size};
  }
`;

class HeaderPrint extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { intl } = this.context;
    const appTitle = `${intl.formatMessage(appMessages.app.title)} - ${intl.formatMessage(appMessages.app.claim)}`;
    return (
      <Styled>
        <Box direction="row" fill>
          <Box>
            <Brand>
              <Box direction="row" align="center">
                <Logo src={this.props.theme.media.headerLogoPrint} alt={appTitle} />
                <Box fill="vertical" pad={{ left: 'small' }} justify="center" gap="xxsmall">
                  <Claim>
                    <FormattedMessage {...appMessages.app.claim} />
                  </Claim>
                  <BrandTitle>
                    <FormattedMessage {...appMessages.app.title} />
                  </BrandTitle>
                </Box>
              </Box>
            </Brand>
          </Box>
        </Box>
      </Styled>
    );
  }
}

HeaderPrint.contextTypes = {
  intl: PropTypes.object.isRequired,
};

HeaderPrint.propTypes = {
  theme: PropTypes.object.isRequired,
};

export default withTheme(HeaderPrint);
