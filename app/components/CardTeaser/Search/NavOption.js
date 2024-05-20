import React from 'react';
import styled from 'styled-components';
import { palette } from 'styled-theme';
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
  width: 100%;
    ${({ theme, active }) => active ? theme.global.colors.dark : 'transparent'};
  &:focus-visible {
    outline-offset: -2px;
    outline: 2px solid ${palette('primary', 0)};
    border-radius: 5px;
  }
  &:last-child {
    border-bottom: 1px solid ${({ theme }) => theme.global.colors.border.light};
  }
  &:hover {
    color: ${({ theme }) => theme.global.colors.highlight};
  }
  @media (min-width: ${({ theme }) => theme.breakpoints.medium}) {
    padding: 10px 16px;
  }
`;
