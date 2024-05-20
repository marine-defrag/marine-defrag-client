import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Box, Text } from 'grommet';

import Keyboard from 'containers/Keyboard';
import NavOption from './NavOption';


const NavOptionWrap = styled(Box)``;

export function NavOptions({
  options,
  onClick,
  activeResult,
  focus,
  onFocus,
}) {
  const myRefs = useRef([]);

  useEffect(() => {
    if (focus && myRefs && myRefs.current && myRefs.current[activeResult]) {
      myRefs.current[activeResult].focus();
    }
  }, [options, activeResult, focus]);

  return (
    <NavOptionWrap>
      {options.map((option, index) => (
        <Keyboard
          key={option.code}
          onEnter={() => {
            if (options[activeResult]) onClick(options[activeResult].typeId);
          }}
        >
          <NavOption
            onClick={() => {
              onClick(option.typeId);
            }}
            ref={(el) => {
              myRefs.current[index] = el;
            }}
            onFocus={() => onFocus && onFocus(index)}
            active={index === activeResult}
            last={index === options.length - 1}
          >
            <Box direction="row" align="end" fill="horizontal" width="100%">
              <Text size="medium">
                {option.label}
              </Text>
            </Box>
          </NavOption>
        </Keyboard>
      ))}
    </NavOptionWrap>
  );
}

NavOptions.propTypes = {
  options: PropTypes.array,
  onClick: PropTypes.func,
  onFocus: PropTypes.func,
  activeResult: PropTypes.number,
  focus: PropTypes.bool,
};

export default NavOptions;
