import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Box } from 'grommet';
import Keyboard from 'containers/Keyboard';
import Hint from './Hint';
import NavOptions from './NavOptions';

import messages from './messages';
const Styled = styled((p) => <Box {...p} />)`
  width: ${({ dropdownWidth }) => dropdownWidth}px;
`;
export function SearchResults({
  options,
  onSelect,
  activeResult,
  setActiveResult,
  maxResult,
  dropdownWidth,
}) {
  const [focus, setFocus] = useState(false);

  useEffect(() => {
    if (activeResult !== -1 && !focus) {
      setFocus(true);
    }
  }, [activeResult, focus]);

  const hasOptions = options && options.size > 0;

  return (
    <Box
      elevation="medium"
      round="xsmall"
      background="white"
    >
      <Styled flex overflow="auto" margin="none" dropdownWidth={dropdownWidth}>
        {!hasOptions && (
          <Box pad="small">
            <Hint italic>
              <FormattedMessage {...messages.noResults} />
            </Hint>
          </Box>
        )}
        {hasOptions
          && (
            <Keyboard
              onUp={() => {
                setActiveResult(Math.max(0, activeResult - 1));
                setFocus(true);
              }}
              onDown={() => {
                setActiveResult(Math.min(activeResult + 1, maxResult - 1));
                setFocus(true);
              }}
            >
              <NavOptions
                options={options.toList().toJS()}
                activeResult={activeResult}
                onClick={(typeId) => onSelect(typeId)}
                focus={focus}
                onFocus={(index) => setActiveResult(index)
                }
              />
            </Keyboard>
          )}
      </Styled>
    </Box>
  );
}

SearchResults.propTypes = {
  onSelect: PropTypes.func,
  setActiveResult: PropTypes.func,
  options: PropTypes.object,
  activeResult: PropTypes.number,
  maxResult: PropTypes.number,
  dropdownWidth: PropTypes.number,
};

export default SearchResults;
