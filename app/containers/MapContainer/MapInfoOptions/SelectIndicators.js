import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import {
  Text,
  Box,
  Button,
  Drop,
} from 'grommet';

import { TEXT_TRUNCATE } from 'themes/config';
import Icon from 'components/Icon';
import qe from 'utils/quasi-equals';

import { truncateText } from 'utils/string';

const SelectButton = styled(
  React.forwardRef((p, ref) => (
    <Button
      plain
      ref={ref}
      fill="horizontal"
      {...p}
    />
  ))
)`
  padding: 0px 2px;
  border-bottom: 1px solid;
  height: 30px;
`;

const OptionButton = styled((p) => <Button plain {...p} />)`
  display: block;
  width: 100%;
  padding: 4px 8px;
  text-align: left;
  background: white;
  &:hover {
    color:${palette('headerNavMainItemHover', 0)};
  }
  opacity: ${({ noneOption }) => noneOption ? 0.6 : 1};
  color: ${({ active }) => active ? palette('headerNavMainItem', 1) : 'inherit'};
`;

export function SelectIndicators({ config }) {
  const {
    onUpdateFFIndicator,
    ffActiveOptionId,
    ffOptions,
  } = config;
  const [showOptions, setShowOptions] = useState(false);
  const buttonRef = useRef();
  const activeOption = ffOptions.find(
    (o) => qe(o.value, ffActiveOptionId || '0')
  );
  if (!activeOption) return null;
  return (
    <Box fill="horizontal">
      <SelectButton
        ref={buttonRef}
        plain
        fill="horizontal"
        onClick={() => setShowOptions(!showOptions)}
      >
        <Box direction="row" justify="between" align="center">
          <Text size="large">
            {truncateText(
              activeOption.label,
              TEXT_TRUNCATE.FF_SELECT,
              false
            )}
          </Text>
          <Box>
            {!showOptions && (
              <Icon name="dropdownOpen" text textRight size="1em" />
            )}
            {showOptions && (
              <Icon name="dropdownClose" text textRight size="1em" />
            )}
          </Box>
        </Box>
      </SelectButton>
      {showOptions && (
        <Drop
          target={buttonRef.current}
          stretch
          align={{ top: 'bottom', left: 'left' }}
          onClickOutside={() => setShowOptions(false)}
        >
          <Box>
            {ffOptions && ffOptions.map(
              (o) => (
                <Box key={o.value}>
                  <OptionButton
                    active={qe(o.value, ffActiveOptionId)}
                    noneOption={qe(o.value, '0')}
                    onClick={() => {
                      setShowOptions(false);
                      onUpdateFFIndicator(o.value);
                    }}
                  >
                    <Text>
                      {truncateText(
                        o.label,
                        TEXT_TRUNCATE.FF_SELECT_OPTION,
                        false
                      )}
                    </Text>
                  </OptionButton>
                </Box>
              )
            )}
          </Box>
        </Drop>
      )}
    </Box>
  );
}


SelectIndicators.propTypes = {
  config: PropTypes.object,
};

export default SelectIndicators;
