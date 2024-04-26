import React from 'react';
import PropTypes from 'prop-types';
import { Keyboard } from 'grommet';

const KeyboardListener = ({ children, onTab }) => (
  <Keyboard onTab={onTab}>
    <div>
      {children}
    </div>
  </Keyboard>
);

KeyboardListener.propTypes = {
  children: PropTypes.node,
  onTab: PropTypes.func,
};

export default KeyboardListener;
