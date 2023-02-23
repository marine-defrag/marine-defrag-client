import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Box, Text } from 'grommet';

const Styled = styled((p) => <Box direction="row" align="center" gap="small" {...p} />)`
  padding: 5px 0;
`;

const StyledText = styled((p) => <Text as="label" size="xsmall" {...p} />)`
  @media print {
    font-size: 9pt;
  }
`;

export function MapOption({ option, type = 'option' }) {
  const {
    active, onClick, label, key = 0,
  } = option;
  return (
    <>
      <Styled>
        <input
          id={`map-${type}-${key}`}
          type="checkbox"
          checked={active}
          onChange={onClick}
        />
        <StyledText htmlFor={`map-${type}-${key}`}>
          {label}
        </StyledText>
      </Styled>
    </>
  );
}

MapOption.propTypes = {
  option: PropTypes.object,
  type: PropTypes.string,
};

export default MapOption;
