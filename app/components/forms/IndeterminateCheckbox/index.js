import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

export const STATES = {
  INDETERMINATE: null,
  CHECKED: true,
  UNCHECKED: false,
};

const StyledInput = styled.input`
  accent-color: ${({ theme }) => theme.global.colors.highlight};
  &:focus-visible {
    outline-offset: 1px;
  }
`;

export default class IndeterminateCheckbox extends React.Component {
  static propTypes = {
    checked: PropTypes.oneOf(Object.values(STATES)),
    onChange: PropTypes.func.isRequired,
  }

  render() {
    const { onChange, checked, ...props } = this.props;
    /* eslint-disable no-param-reassign */
    return (
      <StyledInput
        type="checkbox"
        ref={(ref) => {
          if (ref) ref.indeterminate = checked === STATES.INDETERMINATE;
        }}
        checked={!!checked}
        onChange={(evt) => onChange(evt.target.checked)}
        {...props}
      />
    );
    /* eslint-enable no-param-reassign */
  }
}
