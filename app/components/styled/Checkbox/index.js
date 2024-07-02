import React, { forwardRef } from 'react';
import styled from 'styled-components';

const Checkbox = styled(
  forwardRef((p, ref) => (<input type="checkbox" ref={ref} {...p} />))
)`
  accent-color: ${({ theme }) => theme.global.colors.highlight};
  &:focus-visible {
    outline-offset: 1px;
  }
`;

export default Checkbox;
