import styled from 'styled-components';
import { palette } from 'styled-theme';

import ButtonForm from './ButtonForm';

const ButtonCancel = styled(ButtonForm)`
  color: ${palette('buttonCancel', 0)};
  &:hover {
    color: ${palette('buttonCancelHover', 0)};
  }
  &:focus-visible {
    color: ${palette('buttonCancelHover', 0)};
    outline: 2px solid ${palette('buttonCancelHover', 0)};
    outline-offset: -2px;
  }
`;

export default ButtonCancel;
