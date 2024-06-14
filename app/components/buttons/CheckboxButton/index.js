import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Box, Text } from 'grommet';

import Checkbox from 'components/styled/Checkbox';

const Wrapper = styled.div`
  width: 20px;
  text-align: center;
  padding-right: 6px;
`;

const OptionLabel = styled((p) => <Text as="label" {...p} />)`
  opacity: ${({ disabled }) => disabled ? 0.5 : 1};
`;

export function CheckboxButton({
  name,
  group,
  checked,
  disabled,
  label,
  onChange,
  type = 'checkbox',
}) {
  return (
    <Box direction="row" align="center">
      <Wrapper>
        <Checkbox
          id={name}
          name={group}
          type={type}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
        />
      </Wrapper>
      <OptionLabel
        htmlFor={name}
        disabled={disabled}
      >
        {label}
      </OptionLabel>
    </Box>
  );
}

CheckboxButton.propTypes = {
  type: PropTypes.string,
  name: PropTypes.string,
  group: PropTypes.string,
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]),
  onChange: PropTypes.func,
};

export default CheckboxButton;
