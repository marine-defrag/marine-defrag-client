import styled from 'styled-components';
import { palette } from 'styled-theme';

import Button from '../Button';

const getInactiveHoverBackground = (disabled) => disabled
  ? palette('buttonToggleInactive', 1)
  : palette('buttonToggleInactiveHover', 1);

const getActiveHoverBackground = (disabled) => disabled
  ? palette('buttonDefault', 1)
  : palette('buttonDefaultHover', 1);

// eslint-disable no-nested-ternary
const ButtonPill = styled(Button)`
  color: ${(props) => props.active
    ? palette('buttonDefault', 0)
    : palette('buttonToggleInactive', 0)
};
  background-color: ${(props) => props.active
    ? palette('buttonDefault', 1)
    : palette('buttonToggleInactive', 1)
};
  border-radius: 999px;
  padding: 0.5em 1.75em;
  cursor: ${(props) => props.active ? 'default' : 'pointer'};
  &:hover {
    color: ${(props) => props.active
    ? palette('buttonDefaultHover', 0)
    : palette('buttonToggleInactiveHover', 0)
};
    background-color: ${(props) => props.active
    ? getActiveHoverBackground(props.active)
    : getInactiveHoverBackground(props.active)
};
  }
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    padding: 0.2em 1em;
  }
`;

export default ButtonPill;
