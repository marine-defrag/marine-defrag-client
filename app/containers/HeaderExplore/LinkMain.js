import React from 'react';
import styled from 'styled-components';
import { Button } from 'grommet';

export default styled((p) => <Button plain {...p} />)`
  vertical-align: top;
  text-align: center;
  color:${({ theme, active }) => active ? theme.global.colors.brand : theme.global.colors['dark-3']};
  background-color: ${({ active }) => active ? 'transparent' : 'transparent'};
  border-bottom: 4px solid ${({ theme, active }) => active ? theme.global.colors.brand : 'transparent'};
  &:hover {
    color:${({ theme, active }) => active ? theme.global.colors.brand : theme.global.colors.highlight};
    border-bottom: 4px solid ${({ theme, active }) => active ? theme.global.colors.brand : 'transparent'};
  }
  font-size: 0.8em;
  height: ${(props) => props.theme.sizes.headerExplore.nav.heightMobile - 1}px;
  padding: 8px 0.5em;
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    font-size: 0.9em;
    height: ${(props) => props.theme.sizes.headerExplore.nav.height - 1}px;
  }
  @media (min-width: ${(props) => props.theme.breakpoints.large}) {
  }
  @media (min-width: ${(props) => props.theme.breakpoints.xlarge}) {
    font-size: 1em;
  }
  @media print {
    font-size: ${(props) => props.theme.sizes.print.default};
  }
`;
