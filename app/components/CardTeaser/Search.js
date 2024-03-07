/**
 *
 * Search
 *
 */

import React, {
  useState, useRef, useEffect, useContext,
} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { palette } from 'styled-theme';
import styled from 'styled-components';

import { ACTORTYPES, ROUTES } from 'themes/config';

import { updatePath } from 'containers/App/actions';
import { selectActortypeActors } from 'containers/App/selectors';

import { Box, Drop, ThemeContext } from 'grommet';
import { Close, Search as SearchIcon } from 'grommet-icons';
import { prepCountries } from './utils';

import SearchResults from './SearchResults';
import TextInput from './TextInput';

const IconWrapper = styled((p) => <Box {...p} />)`
  cursor: pointer;
  background: ${palette('light', 3)};
  border-top-right-radius: ${({ theme }) => theme.sizes.searchInput.borderRadius}px; 
  border-bottom-right-radius: ${({ theme }) => theme.sizes.searchInput.borderRadius}px;   
  height: ${({ theme }) => theme.sizes.searchInput.height}px;
  width: ${({ theme }) => theme.sizes.searchInput.height}px; 
`;
const StyledSearchIcon = styled(SearchIcon)`
  stroke: ${palette('dark', 3)};
  &:hover {
    stroke: ${palette('dark', 4)};
  }
`;
const StyledCloseIcon = styled(Close)`
  &:hover {
    stroke: ${palette('dark', 4)};
  }
`;
const StyledTextInput = styled(TextInput)`
  border-top-left-radius: ${({ theme }) => theme.sizes.searchInput.borderRadius}px; 
  border-bottom-left-radius: ${({ theme }) => theme.sizes.searchInput.borderRadius}px;   
`;

const Styled = styled.span`
  width: 100%;
`;
export function Search({
  expand,
  onToggle,
  drop = true,
  focus,
  countries,
  onSelectCountry,
}) {
  const theme = useContext(ThemeContext);
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
  }, [focus, expand]);

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
    <Styled>
      <Box
        direction="row"
        align="center"
        ref={searchRef}
        height={`${theme.sizes.searchInput.height}px`}
        pad={{ right: 'ms' }}
        margin={{ left: hasToggle ? 'ms' : '0' }}
      >
        <>
          <StyledTextInput
            plain
            value={search}
            onChange={(evt) => {
              if (evt && evt.target) {
                setSearch(evt.target.value);
                setActiveResult(0);
              }
            }}
            placeholder="Quick select country"
            ref={textInputRef}
          />
          {search.length === 0 && (
            <IconWrapper justify="center" align="center">
              <StyledSearchIcon size="xsmall" />
            </IconWrapper>
          )}
          {search.length > 0 && (
            <IconWrapper justify="center" align="center">
              <StyledCloseIcon size="xsmall" />
            </IconWrapper>
          )}
        </>
      </Box>
      {((hasToggle && expand) || !hasToggle) && drop && search.length > 1 && (
        <Drop
          align={{ top: 'bottom', left: 'left' }}
          target={searchRef.current}
          onClickOutside={() => {
            setSearch('');
            setActiveResult(0);
          }}
          ref={dropRef}
        >
          <SearchResults
            onClose={() => {
              setSearch('');
              setActiveResult(0);
            }}
            search={search}
            onSelect={() => hasToggle && onToggle(false)}
            onSelectCountry={onSelectCountry}
            activeResult={activeResult}
            setActiveResult={setActiveResult}
            countries={sortedCountries}
            maxResult={sortedCountries.length}
          />
        </Drop>
      )}
    </Styled>
  );
}

Search.propTypes = {
  onToggle: PropTypes.func,
  expand: PropTypes.bool,
  focus: PropTypes.bool,
  drop: PropTypes.bool,
  countries: PropTypes.object,
  onSelectCountry: PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    onSelectCountry: (typeId) => dispatch(updatePath(`${ROUTES.ACTOR}/${typeId}`, { replace: true })),
  };
}

const mapStateToProps = (state) => ({
  countries: selectActortypeActors(state, { type: ACTORTYPES.COUNTRY }),
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Search));
