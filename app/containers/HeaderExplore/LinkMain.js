import React from 'react';
import styled from 'styled-components';
import { Button } from 'grommet';

export default styled((p) => <Button plain {...p} />)`
  vertical-align: top;
  text-align: center;
  color:${({ theme, active }) => active ? theme.global.colors.brand : theme.global.colors['dark-3']};
  background-color: ${({ active }) => active ? 'transparent' : 'transparent'};
  border-bottom: 4px solid ${({ theme, active }) => active ? theme.global.colors.brand : 'transparent'};
  height: ${(props) => props.theme.sizes.headerExplore.nav.heightMobile - 1}px;
  padding: 8px 0.5em;
  &:focus {
    box-shadow: none;
  }
  &:hover {
    color:${({ theme, active }) => active ? theme.global.colors.brand : theme.global.colors.highlight};
    border-bottom: 4px solid ${({ theme, active }) => active ? theme.global.colors.brand : 'transparent'};
  }
  &:focus-visible {
    color:${({ theme }) => theme.global.colors.highlight};
    border-bottom: 4px solid ${({ theme, active }) => active ? theme.global.colors.highlight : 'transparent'};
    outline: 2px solid ${({ theme }) => theme.global.colors.highlight};
    outline-offset: 0px;
  }
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    height: ${(props) => props.theme.sizes.headerExplore.nav.height - 1}px;
  }
  @media print {
    font-size: ${(props) => props.theme.sizes.print.default};
  }
`;
