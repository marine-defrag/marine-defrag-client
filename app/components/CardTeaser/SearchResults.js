import React, { useEffect, useCallback, useState } from 'react';
import PropTypes from 'prop-types';

import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import { Box } from 'grommet';

import {
  selectCountry,
} from 'containers/App/actions';
import Hint from './Hint';

import messages from './messages';

import NavOptionGroup from './NavOptionGroup';

export function SearchResults({
  countries,
  onSelectCountry,
  onSelect,
  onClose,
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
  const hasCountries = countries && countries.size > 0;

  return (
    <Box flex overflow="auto" pad={{ top: 'medium' }}>
      {!hasCountries && (
        <Box pad="small">
          <Hint italic>
            <FormattedMessage {...messages.noResults} />
          </Hint>
        </Box>
      )}
      {hasCountries
        && (
          <NavOptionGroup
            label="Countries"
            options={countries}
            activeResult={activeResult}
            onClick={(key) => {
              onClose();
              onSelect();
              onSelectCountry(key);
            }}
            focus={focus}
            onFocus={(index) => setActiveResult(index)
            }
          />
        )}
    </Box>
  );
}

SearchResults.propTypes = {
  onSelectCountry: PropTypes.func,
  setActiveResult: PropTypes.func,
  countries: PropTypes.object,
  onClose: PropTypes.func,
  onSelect: PropTypes.func,
  search: PropTypes.string,
  intl: intlShape.isRequired,
  activeResult: PropTypes.number,
  maxResult: PropTypes.number,
};

export function mapDispatchToProps(dispatch) {
  return {
    onSelectCountry: (code) => dispatch(selectCountry(code)),
    intl: intlShape.isRequired,
  };
}

export default injectIntl(SearchResults);
