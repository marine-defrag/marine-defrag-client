
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {
  Box, Text, Button, ThemeContext,
} from 'grommet';
import { Globe, Calendar, List } from 'grommet-icons';
import Icon from 'components/Icon';
import { FormattedMessage } from 'react-intl';

import messages from './messages';

const ArrowIcon = styled(Icon)`
  font-weight: bold;
`;
const ExploreText = styled((p) => <Text weight="bold" {...p} />)`
  color: ${({ theme }) => theme.global.colors.text.brand};
  &:hover {
    color: ${({ theme }) => theme.global.colors.text.highlight};
  }
`;
const Styled = styled((p) => <Box {...p} />)`
  padding: ${({ isPrimary, theme }) => isPrimary ? `0px ${theme.sizes.navCardSearch.padding}px 0px 0px` : `0px ${theme.sizes.navCardSearch.padding}px`};
  position: absolute;
  right: 0px;
  bottom: 0px;
`;

const BottomButtons = ({ primary, iconConfig, onClick }) => {
  const theme = useContext(ThemeContext);
  const iconColor = theme.global.colors.text.brand;

  return (
    <Styled isPrimary={primary} direction="row" justify="between" fill="horizontal">
      {primary && <Box width="100%" />}
      <Box direction="row" justify="between" fill="horizontal">
        <Button onClick={onClick}>
          <Box pad="none" direction="row" align="center" gap="xsmall">
            <ExploreText>
              <FormattedMessage {...messages.explore} />
            </ExploreText>
            <ArrowIcon name="arrowRight" size="0.5em" />
          </Box>
        </Button>
        {iconConfig
        && (
          <Box direction="row" align="center" gap="xsmall">
            {iconConfig.hasList && <List size="xsmall" color={iconColor} />}
            {iconConfig.hasTimeline && <Calendar size="xsmall" color={iconColor} />}
            {iconConfig.hasMap && <Globe size="xsmall" color={iconColor} />}
          </Box>
        )
        }
      </Box>
    </Styled>
  );
};

BottomButtons.propTypes = {
  primary: PropTypes.bool,
  onClick: PropTypes.func,
  iconConfig: PropTypes.object,
};

export default BottomButtons;
