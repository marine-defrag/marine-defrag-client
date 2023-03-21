import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Box, Text } from 'grommet';

import { usePrint } from 'containers/App/PrintContext';

const Styled = styled((p) => <Box direction="row" align="center" gap="small" {...p} />)`
  padding: 5px 0;
  display: ${({ isPrint, active }) => (isPrint && !active) ? 'none' : 'flex'};
  pointer-events: ${({ isPrint }) => isPrint ? 'none' : 'all'};
  @media print {
    display: ${({ active }) => active ? 'flex' : 'none'};
  }
`;

const StyledText = styled((p) => <Text as="label" size="xsmall" {...p} />)`
  @media print {
    font-size: 9pt;
  }
`;

export function MapOption({ option, type = 'option' }) {
  const {
    active,
    onClick,
    label,
    key = 0,
  } = option;
  const isPrint = usePrint();
  return (
    <>
      <Styled isPrint={isPrint} active={active}>
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
