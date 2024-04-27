import React from 'react';
import PropTypes from 'prop-types';
import { Keyboard as KeyboardListener } from 'grommet';

const Keyboard = ({ children, ...props }) => (
  <KeyboardListener {...props}>
    <span>
      {children}
    </span>
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
