import React from 'react';
import PropTypes from 'prop-types';
import { Keyboard as KeyboardListener } from 'grommet';

const Keyboard = ({ children, spanStyle, ...props }) => (
  <KeyboardListener {...props}>
    <span style={spanStyle}>
      {children}
    </span>
  </KeyboardListener>
);

Keyboard.propTypes = {
  children: PropTypes.node,
  onBackspace: PropTypes.func,
  onComma: PropTypes.func,
  onDown: PropTypes.func,
  onTab: PropTypes.func,
  onEnter: PropTypes.func,
  onEsc: PropTypes.func,
  onKeyDown: PropTypes.func,
  onLeft: PropTypes.func,
  onRight: PropTypes.func,
  onShift: PropTypes.func,
  onSpace: PropTypes.func,
  onUp: PropTypes.func,
  spanStyle: PropTypes.object,
};

export default Keyboard;
