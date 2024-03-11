/**
 *
 * Search
 *
 */

import React, {
  useState, useRef, useEffect, useContext,
} from 'react';
import PropTypes from 'prop-types';
import { palette } from 'styled-theme';
import styled from 'styled-components';

import { Box, Drop, ThemeContext } from 'grommet';
import { Close, Search as SearchIcon } from 'grommet-icons';

import SearchResults from './SearchResults';
import TextInput from './TextInput';

import { prepOptions } from './utils';

const IconWrapper = styled((p) => <Box {...p} />)`
  cursor: pointer;
  background: ${palette('light', 3)};
  border-top-right-radius: ${({ theme }) => theme.sizes.navCardSearch.borderRadius}px; 
  border-bottom-right-radius: ${({ theme }) => theme.sizes.navCardSearch.borderRadius}px;   
  height: ${({ theme }) => theme.sizes.navCardSearch.height}px;
  width: ${({ theme }) => theme.sizes.navCardSearch.height}px; 
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
  border-top-left-radius: ${({ theme }) => theme.sizes.navCardSearch.borderRadius}px; 
  border-bottom-left-radius: ${({ theme }) => theme.sizes.navCardSearch.borderRadius}px;   
`;

const Styled = styled.span`
  width: 100%;
`;
export function Search({
  options,
  onSelect,
  placeholder,
}) {
  const theme = useContext(ThemeContext);
  const searchRef = useRef(null);
  const textInputRef = useRef(null);
  const dropRef = useRef(null);

  const [hasToggle, onToggle] = useState(false);
  const [search, setSearch] = useState('');
  const activeResetIndex = -1;
  const [activeResult, setActiveResult] = useState(activeResetIndex);

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
    if (hasToggle) {
      document.addEventListener('mousedown', outsideSearchClick);
      return () => {
        document.removeEventListener('mousedown', outsideSearchClick);
      };
    }
    return () => { };
  }, []);

  let sortedOptions = [];
  if (search.length > 0) {
    sortedOptions = options ? prepOptions(options, search) : [];
  }

  return (
    <Styled>
      <Box
        direction="row"
        align="center"
        ref={searchRef}
        height={`${theme.sizes.navCardSearch.height}px`}
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
                setActiveResult(activeResetIndex);
              }
            }}
            placeholder={placeholder}
            ref={textInputRef}
          />
          {search.length === 0 && (
            <IconWrapper justify="center" align="center">
              <StyledSearchIcon size="xsmall" />
            </IconWrapper>
          )}
          {search.length > 0 && (
            <IconWrapper
              onClick={() => {
                setSearch('');
                setActiveResult(activeResetIndex);
              }}
              justify="center"
              align="center"
            >
              <StyledCloseIcon size="xsmall" />
            </IconWrapper>
          )}
        </>
      </Box>
      {!hasToggle && search.length > 1 && (
        <Drop
          align={{ top: 'bottom', left: 'left' }}
          target={textInputRef.current}
          onClickOutside={() => {
            setSearch('');
            setActiveResult(activeResetIndex);
          }}
          ref={dropRef}
        >
          <SearchResults
            onClose={() => {
              setSearch('');
              setActiveResult(activeResetIndex);
            }}
            search={search}
            onSelect={(typeId) => {
              onToggle(false);
              onSelect(typeId);
            }}
            activeResult={activeResult}
            setActiveResult={setActiveResult}
            options={sortedOptions}
            maxResult={sortedOptions.size}
          />
        </Drop>
      )}
    </Styled>
  );
}

Search.propTypes = {
  placeholder: PropTypes.string,
  options: PropTypes.object,
  onSelect: PropTypes.func,
};

export default Search;
