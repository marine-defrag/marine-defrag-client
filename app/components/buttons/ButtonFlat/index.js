import styled from 'styled-components';
import { palette } from 'styled-theme';

import Button from '../Button';

const ButtonFlat = styled(Button)`
  background: transparent;
  letter-spacing: 0.5px;
  font-weight: bold;
  text-transform: uppercase;
  padding: ${(props) => props.inForm ? '1em 0.6em' : '10px 5px'};
  color: ${(props) => {
    if (props.disabled) {
      return palette('buttonFlat', 2);
    }
    return props.primary ? palette('buttonFlat', 0) : palette('buttonFlat', 1);
  }};
  &:hover, &:focus-visible {
    color: ${(props) => {
    if (props.disabled) {
      return palette('buttonFlat', 2);
    }
    return props.primary ? palette('buttonFlatHover', 0) : palette('buttonFlatHover', 1);
  }};
  }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.global.colors.highlight};
    border-radius: 2px;
  }
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    letter-spacing: 1px;
    padding: ${(props) => props.inForm ? '1em 1.2em' : '10px 12px'};
  }
`;

export default ButtonFlat;
