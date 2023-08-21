import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Box, Text } from 'grommet';

import { truncateText } from 'utils/string';

const Styled = styled(Box)``;
const Label = styled((p) => <Text size="xxsmall" {...p} />)`
  color: ${({ theme }) => theme.global.colors.textSecondary};
  line-height: ${({ theme }) => theme.text.xxsmall.size};
  margin-bottom: -3px;
`;

const PlotHintSimpleContent = ({ hint, more }) => {
  let label;
  if (hint.content && hint.content.code) {
    label = hint.content.code;
  } else if (hint.content && hint.content.title) {
    label = truncateText(hint.content.title, 12);
  } else {
    label = 'UNDEFINED';
  }
  if (more) {
    label = `${label} (+${more})`;
  }
  return (
    <Styled>
      <Label>{label}</Label>
    </Styled>
  );
};

PlotHintSimpleContent.propTypes = {
  hint: PropTypes.object.isRequired,
  more: PropTypes.number,
};

export default PlotHintSimpleContent;
