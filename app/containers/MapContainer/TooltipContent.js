import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Box, Text } from 'grommet';
import isNumber from 'utils/is-number';
import { formatNumber } from 'utils/fields';

const Styled = styled((p) => <Box {...p} />)``;

const TTSectionTitle = styled.div`
  margin: 15px 0 3px;
  font-size: ${({ theme }) => theme.sizes.text.default};
`;
const TTContent = styled((p) => <Text size="xsmall" {...p} />)``;

const TooltipContent = ({
  stats,
  isCount,
}) => (
  <Styled>
    {stats && stats.map((stat, i) => (
      <Box key={i}>
        {stat.title && (
          <TTSectionTitle>
            {stat.title}
          </TTSectionTitle>
        )}
        {stat.values && stat.values.map((value, j) => {
          let formatted = value.value;
          if (!isCount && isNumber(value.value)) {
            formatted = formatNumber(
              value.value,
              {
                unit: value.unit,
                digits: parseFloat(value.value, 10) > 1 ? 1 : 3,
              },
            );
          }
          return (
            <Box direction="row" wrap key={j} gap="xsmall">
              <TTContent>{`${value.label}: `}</TTContent>
              <TTContent weight={500}>
                {formatted}
                {value.active && (
                  <span>
                    {' *'}
                  </span>
                )}
              </TTContent>
            </Box>
          );
        })}
      </Box>
    ))}
  </Styled>
);

TooltipContent.propTypes = {
  stats: PropTypes.array,
  isCount: PropTypes.bool,
};

export default TooltipContent;
