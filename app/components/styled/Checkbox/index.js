import React from 'react';
import styled from 'styled-components';

const Checkbox = styled((p) => (
  <input type="checkbox" {...p} />
))`
  accent-color: ${({ theme }) => theme.global.colors.highlight};
  &:focus-visible {
    outline-offset: 1px;
  }
`;

export default Checkbox;
