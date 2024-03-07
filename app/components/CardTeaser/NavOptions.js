import React, { useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Box, Text } from 'grommet';

import NavOption from './NavOption';

const NavOptionWrap = styled(Box)`
  padding-top: 10px;
  padding-bottom: 30px;
`;
const StyledText = styled(Text)`
  padding: 0 10px 0 16px;
  margin-bottom: 2px;
  font-weight: bold;
`;

export function NavOptions({
  options,
  onClick,
  activeResult,
  focus,
  onFocus,
}) {
  const myRefs = useRef([]);
  const onEnter = useCallback(
    (event) => {
      // on enter
      if (event.keyCode === 13) {
        if (options[activeResult]) onClick(options[activeResult].code);
      }
    },
    [options, activeResult],
  );

  useEffect(() => {
    document.addEventListener('keydown', onEnter, false);

    return () => {
      document.removeEventListener('keydown', onEnter, false);
    };
  }, [options, activeResult]);

  useEffect(() => {
    if (focus && myRefs && myRefs.current && myRefs.current[activeResult]) {
      myRefs.current[activeResult].focus();
    }
  }, [options, activeResult, focus]);

  return (
    <NavOptionWrap>
      <StyledText size="small">
        Countries
      </StyledText>
      {options.map((country, index) => (
        <NavOption
          key={country.code}
          onClick={() => onClick(country.typeId)}
          ref={(el) => {
            myRefs.current[index] = el;
          }}
          onFocus={() => onFocus && onFocus(index)}
          active={index === activeResult}
          disabled={country.disabled}
        >
          <Box direction="row" align="end" fill="horizontal" width="100%">
            <Text size="medium">
              {country.label}
            </Text>
          </Box>
        </NavOption>
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
