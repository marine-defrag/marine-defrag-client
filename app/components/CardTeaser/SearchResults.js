import React, { useEffect, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';

import { Box } from 'grommet';
import Hint from './Hint';
import NavOptions from './NavOptions';

import messages from './messages';
export function SearchResults({
  options,
  onSelect,
  activeResult,
  setActiveResult,
  maxResult,
}) {
  const [focus, setFocus] = useState(false);
  const onKey = useCallback(
    (event) => {
      // UP
      if (event.keyCode === 38) {
        setActiveResult(Math.max(0, activeResult - 1));
        setFocus(true);
        event.preventDefault();
      }
      // DOWN
      if (event.keyCode === 40) {
        setActiveResult(Math.min(activeResult + 1, maxResult - 1));
        setFocus(true);
        event.preventDefault();
      }
    },
    [activeResult, maxResult],
  );
  useEffect(() => {
    document.addEventListener('keydown', onKey, false);

    return () => {
      document.removeEventListener('keydown', onKey, false);
    };
  }, [activeResult, maxResult]);
  const hasOptions = options && options.size > 0;

  return (
    <Box flex overflow="auto" margin={{ top: 'small' }} pad={{ top: 'medium' }}>
      {!hasOptions && (
        <Box pad="small">
          <Hint italic>
            <FormattedMessage {...messages.noResults} />
          </Hint>
        </Box>
      )}
      {hasOptions
        && (
          <NavOptions
            options={options.toList().toJS()}
            activeResult={activeResult}
            onClick={(typeId) => onSelect(typeId)}
            focus={focus}
            onFocus={(index) => setActiveResult(index)
            }
          />
        )}
    </Box>
  );
}

SearchResults.propTypes = {
  onSelect: PropTypes.func,
  setActiveResult: PropTypes.func,
  options: PropTypes.object,
  intl: intlShape.isRequired,
  activeResult: PropTypes.number,
  maxResult: PropTypes.number,
};

export default injectIntl(SearchResults);
