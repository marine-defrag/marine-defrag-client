import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Box, Text } from 'grommet';

const Styled = styled((p) => <Box {...p} />)``;

const TTSectionTitle = styled.div`
  margin: 15px 0 3px;
  font-size: ${({ theme }) => theme.sizes.text.default};
`;
const TTContent = styled((p) => <Text size="xsmall" {...p} />)``;

const TooltipContent = ({
  stats,
}) => (
  <Styled>
    {stats && stats.map((stat, i) => (
      <Box key={i}>
        <TTSectionTitle>
          {stat.title}
        </TTSectionTitle>
        {stat.values && stat.values.map((value, j) => (
          <TTContent key={j}>
            {`${value.label}: ${value.value}`}
            {value.active && (
              <span>
                {' *'}
              </span>
            )}
          </TTContent>
        ))}
      </Box>
    ))}
  </Styled>
);

TooltipContent.propTypes = {
  stats: PropTypes.array,
};

export default TooltipContent;
