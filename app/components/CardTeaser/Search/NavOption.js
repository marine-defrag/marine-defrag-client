import React from 'react';
import styled from 'styled-components';
import { Button } from 'grommet';

const OptionButton = React.forwardRef((props, ref) => (
  <Button plain {...props} ref={ref} />
));
// prettier-ignore
export default styled(OptionButton)`
  border-bottom: 1px solid;
  border-top: 1px solid transparent;
  border-bottom-color:  ${({ last, theme }) => last ? 'transparent' : theme.global.colors.border.light};
  padding: 8px 12px;
  position: relative;
  background: transparent;
  border-left: 4px solid
    ${({ theme, active }) => active ? theme.global.colors.dark : 'transparent'};
  &:last-child {
    border-bottom: 1px solid ${({ theme }) => theme.global.colors.border.light};
  }
  &:hover {
    border-left: 4px solid ${({ theme }) => theme.global.colors.dark};
  }
  @media (min-width: ${({ theme }) => theme.breakpoints.medium}) {
    padding: 10px 16px 10px 12px;
  }
`;
