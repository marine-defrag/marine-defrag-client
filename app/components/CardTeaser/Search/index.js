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

import {
  Box, Button, ThemeContext,
} from 'grommet';
import { Close, Search as SearchIcon } from 'grommet-icons';

import PrintHide from 'components/styled/PrintHide';
import Keyboard from 'containers/Keyboard';
import { setFocusByRef } from 'utils/accessibility';
import SearchResults from './SearchResults';
import TextInput from './TextInput';

import { prepOptions } from './utils';

const SearchButton = styled((p) => <Button {...p} />)`
  cursor: ${({ onClick }) => onClick ? 'pointer' : 'auto'};
  background: ${palette('light', 3)};
  border-top-right-radius: ${({ theme }) => theme.sizes.navCardSearch.borderRadius}px;
  border-bottom-right-radius: ${({ theme }) => theme.sizes.navCardSearch.borderRadius}px;
  height: ${({ theme }) => theme.sizes.navCardSearch.height}px;
  width: ${({ theme }) => theme.sizes.navCardSearch.height}px;
  &:focus {
    outline: 5px auto rgb(77, 144, 254);
    z-index: 1;
  }
`;
const ClearButton = styled((p) => <Button {...p} />)`
  cursor: ${({ onClick }) => onClick ? 'pointer' : 'auto'};
  height: ${({ theme }) => theme.sizes.navCardSearch.height}px;
  width: ${({ theme }) => theme.sizes.navCardSearch.height}px;
  background-color: ${palette('light', 1)};
  &:focus {
    outline: 5px auto rgb(77, 144, 254);
    z-index: 1;
  }
`;
const StyledSearchIcon = styled(SearchIcon)`
  &:hover {
    stroke: ${palette('dark', 4)};
  }
`;
const StyledCloseIcon = styled(Close)`
  &:hover {
    stroke: ${palette('dark', 4)};
  }
`;

const Styled = styled((p) => <Box {...p} />)`
  width: 100%;
`;

const SearchBox = styled(
  React.forwardRef((p, ref) => <Box {...p} ref={ref} />)
)``;

const DropDown = styled.div`
  display: none;
  background: white;
  box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.2);
  z-index: 999;
  margin-top: 6px;
  border-radius: 6px;
  @media (min-width: ${({ theme }) => theme.breakpoints.medium}) {
    position: absolute;
    top: 100%;
    display: block;
  }
`;

export function Search({
  options,
  onSelect,
  placeholder,
}) {
  const theme = useContext(ThemeContext);
  const searchRef = useRef(null);
  const textInputRef = useRef(null);
  const textInputWrapperRef = useRef(null);
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
    <Styled
      pad={{ right: 'ms' }}
    >
      <SearchBox
        direction="row"
        align="center"
        ref={searchRef}
        height={`${theme.sizes.navCardSearch.height}px`}
      >
        <>
          <Box
            width="large"
            fill="horizontal"
            direction="row"
            align="center"
            ref={textInputWrapperRef}
            style={{ display: 'flex' }}
          >
            <Keyboard
              onEnter={() => {
                if (sortedOptions.size > 0) setActiveResult(0);
              }}
            >
              <TextInput
                plain
                value={search}
                ref={textInputRef}
                onChange={(evt) => {
                  if (evt && evt.target) {
                    setSearch(evt.target.value);
                    setActiveResult(activeResetIndex);
                  }
                }}
                placeholder={placeholder}
              />
            </Keyboard>
            {search.length > 0 && (
              <ClearButton
                onClick={() => {
                  setSearch('');
                  setActiveResult(activeResetIndex);
                  setFocusByRef(textInputRef);
                }}
                justify="center"
                align="center"
                icon={<StyledCloseIcon size="xsmall" />}
              />
            )}
          </Box>
          <Keyboard
            onEnter={() => {
              if (sortedOptions.size > 0) setActiveResult(0);
            }}
          >
            <SearchButton
              justify="center"
              align="center"
              onClick={() => {
                setActiveResult(0);
              }}
              icon={<StyledSearchIcon size="xsmall" />}
            />
          </Keyboard>
        </>
      </SearchBox>
      {!hasToggle && search.length > 1 && (
        <PrintHide>
          <DropDown ref={dropRef}>
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
              dropdownWidth={textInputWrapperRef.current.clientWidth}
            />
          </DropDown>
        </PrintHide>
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
