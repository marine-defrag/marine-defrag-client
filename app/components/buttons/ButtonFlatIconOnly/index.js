import styled from 'styled-components';
import { palette } from 'styled-theme';

import Button from '../Button';

const ButtonFlatIconOnly = styled(Button)`
  color: ${({ subtle }) => (subtle ? palette('text', 1) : palette('buttonFlat', 0))};
  &:hover, &:focus-visible {
    color: ${({ subtle }) => (subtle ? palette('buttonFlat', 0) : palette('buttonFlatHover', 0))};
  }
  &:focus-visible {
    svg {
      fill: ${({ subtle }) => (subtle ? palette('buttonFlat', 0) : palette('buttonFlatHover', 0))} !important;
    }
  }
`;

export default ButtonFlatIconOnly;
