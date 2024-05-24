import React from 'react';
import PropTypes from 'prop-types';
import { Keyboard as KeyboardListener } from 'grommet';

import styled from 'styled-components';

const StyledSpan = styled.span`
  width: inherit;
`;

const Keyboard = ({ children, ...props }) => (
  <KeyboardListener {...props}>
    <StyledSpan>
      {children}
    </StyledSpan>
  </KeyboardListener>
);

Keyboard.propTypes = {
  children: PropTypes.node,
  onTab: PropTypes.func,
  onEnter: PropTypes.func,
  onEsc: PropTypes.func,
  onKeyDown: PropTypes.func,
};

export default Keyboard;
