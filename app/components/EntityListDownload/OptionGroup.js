/*
 *
 * OptionGroup
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { palette } from 'styled-theme';

import styled from 'styled-components';
import { Box, Text } from 'grommet';

import CheckboxButton from 'components/buttons/CheckboxButton';

import OptionGroupToggle from './OptionGroupToggle';
import OptionListHeader from './OptionListHeader';
import ExportOption from './ExportOption';

const Group = styled(Box)`
  margin-bottom: 2px;
  border-top: 1px solid ${palette('light', 2)};
  &:last-child {
    border-bottom: 1px solid ${palette('light', 2)};
  }
`;

export function OptionGroup({
  label,
  onExpandGroup,
  expandedId,
  groupId,
  activeOptionCount,
  optionCount,
  intro,
  introNode,
  options,
  optionListLabels,
  onSetOptions,
  onSetAsRows,
  asRows,
  asRowsDisabled,
  asRowsLabels,
  editColumnNames,
  active,
  onSetActive,
  onActiveLabel,
}) {
  const expandGroup = expandedId === groupId;
  if (!optionCount || optionCount === 0) {
    return null;
  }
  return (
    <Group>
      <OptionGroupToggle
        label={label}
        onToggle={() => onExpandGroup(!expandGroup ? groupId : null)}
        expanded={expandGroup}
        activeCount={activeOptionCount}
        optionCount={optionCount}
      />
      {expandGroup && (
        <Box gap="small" margin={{ vertical: 'medium' }}>
          {intro && (
            <Box>
              <Text size="small">{intro}</Text>
            </Box>
          )}
          {!intro && introNode}
          {onSetActive && (
            <CheckboxButton
              name={`check-${groupId}`}
              checked={active}
              onChange={(evt) => onSetActive(evt.target.checked)}
              label={onActiveLabel}
            />
          )}
          {options && (
            <Box margin={{ top: 'medium' }}>
              <OptionListHeader
                labels={optionListLabels}
                listGroupId={groupId}
                activeCount={activeOptionCount}
                optionCount={optionCount}
                onSelect={(selected) => {
                  const updated = Object.keys(options).reduce((memo, key) => ({
                    ...memo,
                    [key]: {
                      ...options[key],
                      active: selected,
                    },
                  }), {});
                  onSetOptions(updated);
                }}
              />
              <Box gap="xsmall">
                {Object.keys(options).map((key) => (
                  <ExportOption
                    key={key}
                    options={options}
                    optionKey={key}
                    groupId={groupId}
                    editColumnNames={editColumnNames}
                    onSetOptions={onSetOptions}
                  />
                ))}
              </Box>
            </Box>
          )}
          {onSetAsRows && (
            <Box gap="edge">
              <CheckboxButton
                type="radio"
                group={`check-${groupId}`}
                name={`check-${groupId}-as-columns`}
                checked={!asRows}
                onChange={(evt) => onSetAsRows(!evt.target.checked)}
                disabled={asRowsDisabled}
                label={asRowsLabels.columns}
              />
              <CheckboxButton
                type="radio"
                group={`check-${groupId}`}
                name={`check-${groupId}-as-rows`}
                checked={!asRows}
                onChange={(evt) => onSetAsRows(evt.target.checked)}
                disabled={asRowsDisabled}
                label={asRowsLabels.rows}
              />
            </Box>
          )}
        </Box>
      )}
    </Group>
  );
}

OptionGroup.propTypes = {
  label: PropTypes.string,
  onExpandGroup: PropTypes.func,
  expandedId: PropTypes.string,
  groupId: PropTypes.string,
  activeOptionCount: PropTypes.number,
  optionCount: PropTypes.number,
  intro: PropTypes.string,
  introNode: PropTypes.node,
  options: PropTypes.object,
  optionListLabels: PropTypes.object,
  onSetOptions: PropTypes.func,
  onSetAsRows: PropTypes.func,
  asRows: PropTypes.bool,
  asRowsDisabled: PropTypes.bool,
  asRowsLabels: PropTypes.object,
  editColumnNames: PropTypes.bool,
  active: PropTypes.bool,
  onSetActive: PropTypes.func,
  onActiveLabel: PropTypes.string,
};

export default OptionGroup;
