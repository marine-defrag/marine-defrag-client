import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import { Box, Text } from 'grommet';
import DebounceInput from 'react-debounce-input';

import Checkbox from 'components/styled/Checkbox';

const TextInput = styled(DebounceInput)`
  background-color: ${palette('background', 0)};
  padding: 3px;
  flex: 1;
  font-size: 0.85em;
  width: 200px;
  border-radius: 2px;
  border: 1px solid;
  border-color: ${({ active, theme }) => active ? theme.global.colors.highlight : palette('light', 2)};
  &:focus {
    outline: 1px solid ${({ active, theme }) => active ? theme.global.colors.highlight : 'transparent'};
  }
`;

const Select = styled.div`
  width: 20px;
  text-align: center;
  padding-right: 6px;
`;

const OptionLabel = styled((p) => <Text as="label" {...p} />)`
  opacity: ${({ disabled }) => disabled ? 0.5 : 1};
`;

export function ExportOption({
  optionKey,
  groupId,
  options,
  onSetOptions,
  editColumnNames,
}) {
  const [activeTextbox, setActiveTextbox] = useState(+false);
  const option = options[optionKey];
  return (
    <Box direction="row" gap="small" align="center" justify="between">
      <Box direction="row" gap="small" align="center" justify="start">
        <Select>
          <Checkbox
            id={`check-${groupId}-${optionKey}`}
            checked={option.exportRequired || option.active}
            disabled={option.exportRequired}
            onChange={(evt) => {
              onSetOptions({
                ...options,
                [optionKey]: {
                  ...option,
                  active: evt.target.checked,
                },
              });
            }}
          />
        </Select>
        <OptionLabel htmlFor={`check-${groupId}-${optionKey}`}>
          {option.label}
        </OptionLabel>
      </Box>
      {editColumnNames && option.column && (
        <Box>
          <TextInput
            minLength={1}
            debounceTimeout={500}
            value={option.column}
            active={activeTextbox}
            onFocus={() => setActiveTextbox(+true)}
            onBlur={() => setActiveTextbox(+false)}
            onChange={(evt) => {
              onSetOptions({
                ...options,
                [optionKey]: {
                  ...option,
                  column: evt.target.value,
                },
              });
            }}
          />
        </Box>
      )}
    </Box>
  );
}

ExportOption.propTypes = {
  optionKey: PropTypes.string,
  groupId: PropTypes.string,
  options: PropTypes.object,
  onSetOptions: PropTypes.func,
  editColumnNames: PropTypes.bool,
};

export default ExportOption;
