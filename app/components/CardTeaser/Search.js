/**
 *
 * Search
 *
 */

import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';

import {
  Box, Button, Drop, Text,
} from 'grommet';
import { Close, Search as SearchIcon } from 'grommet-icons';

import { selectActortypeActors } from 'containers/App/selectors';

import { ACTORTYPES } from 'themes/config';
import messages from './messages';
import SearchResults from './SearchResults';
import TextInput from './TextInput';
import { prepCountries } from './utils';

export function Search({
  intl,
  searched,
  margin,
  stretch,
  expand,
  size = 'medium',
  onToggle,
  drop = true,
  onSearch,
  focus,
  countries,
  bordersize,
  bordercolor,
}) {
  const hasToggle = typeof onToggle !== 'undefined';
  const [search, setSearch] = useState('');
  const [activeResult, setActiveResult] = useState(0);
  const searchRef = useRef(null);
  const textInputRef = useRef(null);
  const dropRef = useRef(null);

  const outsideSearchClick = (e) => {
    // inside search click
    if (searchRef.current && searchRef.current.contains(e.target)) {
      return;
    }
    // inside drop click
    if (dropRef.current && dropRef.current.contains(e.target)) {
      return;
    }
    // outside click
    if (hasToggle) {
      onToggle(false);
    }
  };

  useEffect(() => {
    if ((focus || expand) && textInputRef) {
      textInputRef.current.focus();
    }
  }, [searched, focus, expand]);

  useEffect(() => {
    if (hasToggle) {
      document.addEventListener('mousedown', outsideSearchClick);
      return () => {
        document.removeEventListener('mousedown', outsideSearchClick);
      };
    }
    return () => { };
  }, [expand]);

  let sortedCountries = [];
  if (drop && search.length > 0) {
    sortedCountries = countries ? prepCountries(countries, search) : [];
  }

  return (
    <Box
      margin={margin ? { horizontal: 'medium' } : null}
      style={{ minWidth: expand ? '500px' : 0 }}
    >
      <Box
        border={{
          color: expand ? 'dark' : bordercolor,
          size: expand ? 'small' : bordersize,
        }}
        direction="row"
        align="center"
        round="xlarge"
        ref={searchRef}
        style={stretch ? null : { maxWidth: '500px' }}
        height="45px"
        pad={{ horizontal: 'ms' }}
        margin={{ left: hasToggle ? 'ms' : '0' }}
      >
        {hasToggle && !expand && (
          <Button
            plain
            onClick={() => {
              onToggle(true);
              setActiveResult(0);
            }}
            label={
              <Text weight={600}>{intl.formatMessage(messages.search)}</Text>
            }
            reverse
            icon={<SearchIcon size={size} color="dark" />}
            style={{ textAlign: 'center' }}
            gap="xsmall"
          />
        )}
        {((hasToggle && expand) || !hasToggle) && (
          <>
            <TextInput
              plain
              value={search}
              onChange={(evt) => {
                if (evt && evt.target) {
                  searched(evt.target.value);
                  setSearch(evt.target.value);
                  if (onSearch) onSearch(evt.target.value);
                  setActiveResult(0);
                }
              }}
              placeholder="Quick select country"
              ref={textInputRef}
            />
            {!hasToggle && search.length === 0 && (
              <Box pad={{ right: 'xsmall' }}>
                <SearchIcon size={size} color="dark" />
              </Box>
            )}
            {(hasToggle || search.length > 0) && (
              <Button
                plain
                fill="vertical"
                onClick={() => {
                  setSearch('');
                  if (onSearch) onSearch('');
                  if (hasToggle) onToggle(false);
                  setActiveResult(0);
                }}
                icon={<Close size={size} color="dark" />}
                style={{
                  textAlign: 'center',
                  height: '45px',
                }}
              />
            )}
          </>
        )}
      </Box>
      {((hasToggle && expand) || !hasToggle) && drop && search.length > 1 && (
        <Drop
          align={{ top: 'bottom', left: 'left' }}
          target={searchRef.current}
          onClickOutside={() => {
            setSearch('');
            if (onSearch) onSearch('');
            setActiveResult(0);
          }}
          ref={dropRef}
        >
          <SearchResults
            onClose={() => {
              setSearch('');
              if (onSearch) onSearch('');
              setActiveResult(0);
            }}
            search={search}
            onSelect={() => hasToggle && onToggle(false)}
            activeResult={activeResult}
            setActiveResult={setActiveResult}
            countries={sortedCountries}
            maxResult={sortedCountries.length}
          />
        </Drop>
      )}
    </Box>
  );
}

Search.propTypes = {
  searched: PropTypes.func.isRequired,
  onSearch: PropTypes.func,
  onToggle: PropTypes.func,
  intl: intlShape.isRequired,
  margin: PropTypes.bool,
  stretch: PropTypes.bool,
  expand: PropTypes.bool,
  focus: PropTypes.bool,
  drop: PropTypes.bool,
  size: PropTypes.string,
  countries: PropTypes.array,
  bordersize: PropTypes.string,
  bordercolor: PropTypes.string,
};

const mapDispatchToProps = () => ({
  searched: () => {
    /* dispatch(
       trackEvent({
         category: 'Search',
         action: value,
       }),
     ); */
  },
  // navigate to location
  nav: () => {
    /* dispatch(
       updatePath();
   }, */ },
});
const mapStateToProps = (state) => ({
  countries: selectActortypeActors(state, { type: ACTORTYPES.COUNTRY }),
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Search));
