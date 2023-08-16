import React, { useContext } from 'react';
import styled from 'styled-components';
import { Box, Text, ResponsiveContext } from 'grommet';
import { FormattedMessage } from 'react-intl';

import Dot from './Dot';
import messages from './messages';

const Styled = styled((p) => <Box {...p} />)`
  position:relative;
`;

const Label = styled((p) => <Text size="small" {...p} />)`
  color: #787A7D;
`;

const Wrapper = styled.div`
  position: relative;
  width: 64px;
  height: 16px;
  display: block;
`;

const DotLeft = styled.div`
  position: absolute;
  top: 0;
  left: 0;
`;
const DotRight = styled.div`
  position: absolute;
  top: 0;
  right: 0;
`;

const Line = styled.div`
  border-bottom: 1px solid rgb(71, 122, 209);
  position: absolute;
  top: 0px;
  left: 8px;
  right: 8px;
  height: 8px;
  display: block;
`;

export function ChartTimelineLegend() {
  const size = useContext(ResponsiveContext);
  return (
    <Styled direction={size === 'small' ? 'column' : 'row'} gap="medium">
      <Box direction="row" gap="xsmall">
        <Label><FormattedMessage {...messages.individual} /></Label>
        <Dot />
      </Box>
      <Box direction="row" gap="xsmall">
        <Label><FormattedMessage {...messages.multiple} /></Label>
        <Wrapper>
          <DotLeft><Dot /></DotLeft>
          <DotRight><Dot /></DotRight>
          <Line />
        </Wrapper>
      </Box>
    </Styled>
  );
}


export default ChartTimelineLegend;
