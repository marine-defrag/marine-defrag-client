import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Box } from 'grommet';
import TextPrint from 'components/styled/TextPrint';
import Checkbox from 'components/styled/Checkbox';

import { usePrint } from 'containers/App/PrintContext';

const Styled = styled((p) => <Box direction="row" align="center" gap="small" {...p} />)`
  padding: 5px 0;
  display: ${({ isPrint, active, printHide }) => (isPrint && (!active || printHide)) ? 'none' : 'flex'};
  pointer-events: ${({ isPrint }) => isPrint ? 'none' : 'all'};
  @media print {
    display: ${({ active, printHide }) => (active && !printHide) ? 'flex' : 'none'};
  }
`;

const StyledText = styled((p) => <TextPrint as="label" size="xsmall" {...p} />)``;

export function MapOption({ option, type = 'option', align = 'start' }) {
  const {
    active,
    onClick,
    label,
    key = 0,
    printHide,
  } = option;
  const isPrint = usePrint();
  return (
    <Styled
      justify={align}
      isPrint={isPrint}
      active={active}
      printHide={printHide}
    >
      <Checkbox
        id={`map-${type}-${key}`}
        checked={active}
        onChange={onClick}
      />
      <StyledText htmlFor={`map-${type}-${key}`}>
        {label}
      </StyledText>
    </Styled>
  );
}

MapOption.propTypes = {
  option: PropTypes.object,
  type: PropTypes.string,
  align: PropTypes.string,
};

export default MapOption;
