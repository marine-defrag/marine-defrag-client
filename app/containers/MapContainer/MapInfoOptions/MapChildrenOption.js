import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Box, Text } from 'grommet';

const Styled = styled((p) => <Box direction="row" align="center" gap="small" {...p} />)`
  padding: 5px 0;
`;

export function MapChildrenOption({ option }) {
  const {
    active, onClick, label, key = 0,
  } = option;
  return (
    <Styled>
      <input
        id={`map-child-${key}`}
        type="checkbox"
        checked={active}
        onChange={onClick}
      />
      <Text as="label" htmlFor={`map-child-${key}`} size="xsmall">{label}</Text>
    </Styled>
  );
}

MapChildrenOption.propTypes = {
  option: PropTypes.object,
};

export default MapChildrenOption;
