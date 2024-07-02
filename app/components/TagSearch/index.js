/*
 *
 * TagSearch
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import styled from 'styled-components';
import { palette } from 'styled-theme';
import { reduce } from 'lodash/collection';
import appMessage from 'utils/app-message';
import { lowerCase } from 'utils/string';
import { Box } from 'grommet';

import Icon from 'components/Icon';
import Button from 'components/buttons/Button';
import ButtonTagFilter from 'components/buttons/ButtonTagFilter';
import ButtonTagFilterInverse from 'components/buttons/ButtonTagFilterInverse';
import DebounceInput from 'react-debounce-input';
import PrintOnly from 'components/styled/PrintOnly';

import messages from './messages';

const Search = styled((p) => <Box direction="row" align="center" {...p} />)`
  width: 100%;
  background-color: ${palette('background', 0)};
  color: ${palette('dark', 2)};
  padding: 2px 7px;
  min-height: ${(props) => props.small ? 30 : 36}px;
  border-radius: 5px;
  position: relative;
  border: 1px solid;
  border-color: ${({ active, theme }) => active ? theme.global.colors.highlight : palette('light', 2)};
  outline: 1px solid ${({ active, theme }) => active ? theme.global.colors.highlight : 'transparent'};
  @media print {
    border: none;
    box-shadow: none;
    padding: 0;
    display: ${({ printHide }) => printHide ? 'none' : 'block'};
  }
`;
const SearchInput = styled(DebounceInput)`
  background-color: ${palette('background', 0)};
  border: none;
  padding: 3px;
  &:focus {
    outline: none;
  }
  flex: 1;
  font-size: 0.85em;
  @media print {
    display: none;
  }
`;
const Tags = styled((p) => <Box direction="row" align="center" {...p} />)``;

const Clear = styled(Button)`
  padding: ${(props) => props.small ? '4px 6px' : '6px 6px'};
  position: absolute;
  top: 0;
  right: 0;
  background-color: ${palette('background', 4)};
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    padding: ${(props) => props.small ? '4px 6px' : '6px 6px'};
  }
  @media print {
    display: none;
  }
  &:focus-visible {
    border-radius: 5px;
  }
`;

const LabelPrint = styled(PrintOnly)`
  margin-top: 10px;
  font-size: ${(props) => props.theme.sizes.print.smaller};
`;
const SearchValuePrint = styled(PrintOnly)`
  font-size: ${(props) => props.theme.sizes.print.default};
  font-weight: bold;
`;

export class TagSearch extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor() {
    super();
    this.state = {
      active: false,
    };
  }

  getFilterLabel = (filter) => {
    const { intl } = this.context;
    // not used I think?
    if (filter.message) {
      return filter.messagePrefix
        ? `${filter.messagePrefix} ${lowerCase(appMessage(intl, filter.message))}`
        : appMessage(intl, filter.message);
    }
    if (filter.labels) {
      return reduce(filter.labels, (memo, label) => {
        if (!label.label) return memo;
        let labelValue = label.appMessage ? appMessage(intl, label.label) : label.label;
        labelValue = label.postfix ? `${labelValue}${label.postfix}` : labelValue;
        return `${memo}${label.lowerCase ? lowerCase(labelValue) : labelValue} `;
      }, '').trim();
    }
    return filter.label;
  }

  render() {
    const {
      filters,
      searchQuery,
      onSearch,
      placeholder,
    } = this.props;
    const { intl } = this.context;
    // TODO set focus to input when clicking wrapper
    //  see https://github.com/nkbt/react-debounce-input/issues/65
    //  https://github.com/yannickcr/eslint-plugin-react/issues/678
    // for now this works all right thanks to flex layout
    // onClick={() => {
    //   this.inputNode.focus()
    // }}
    const hasFilters = (searchQuery || filters.length > 0);
    return (
      <Search
        active={this.state.active}
        small={this.props.multiselect}
        printHide={!hasFilters}
      >
        {filters.length > 0 && (
          <LabelPrint>
            <FormattedMessage {...messages.labelPrintFilters} />
          </LabelPrint>
        )}
        {filters.length > 0 && (
          <Tags flex={{ shrink: 0 }}>
            {filters.map((filter, i) => {
              const label = this.getFilterLabel(filter);
              return filter.inverse
                ? (
                  <ButtonTagFilterInverse
                    key={i}
                    onClick={filter.onClick}
                    palette={filter.type || 'attributes'}
                    paletteHover={`${filter.type || 'attributes'}Hover`}
                    pIndex={parseInt(filter.id, 10) || 0}
                    disabled={!filter.onClick}
                    label={label}
                  >
                    {label}
                    {filter.onClick && <Icon name="removeSmall" text textRight printHide />}
                  </ButtonTagFilterInverse>
                )
                : (
                  <ButtonTagFilter
                    key={i}
                    onClick={filter.onClick}
                    palette={filter.type || 'attributes'}
                    paletteHover={`${filter.type || 'attributes'}Hover`}
                    pIndex={parseInt(filter.id, 10) || 0}
                    disabled={!filter.onClick}
                    label={label}
                  >
                    {label}
                    {filter.onClick && <Icon name="removeSmall" text textRight printHide />}
                  </ButtonTagFilter>
                );
            })}
          </Tags>
        )}
        <Box direction="row" align="center" fill="horizontal">
          <Box fill="horizontal">
            <SearchInput
              id="search"
              minLength={1}
              debounceTimeout={500}
              value={searchQuery || ''}
              onChange={(e) => onSearch(e.target.value)}
              onFocus={() => this.setState({ active: true })}
              onBlur={() => this.setState({ active: false })}
              placeholder={placeholder || (intl.formatMessage(
                this.props.multiselect
                  ? messages.searchPlaceholderMultiSelect
                  : messages.searchPlaceholderEntities
              ))}
            />
          </Box>
          {hasFilters && this.props.onClear && (
            <Box flex={{ shrink: 0 }}>
              <Clear
                onClick={this.props.onClear}
                small={this.props.multiselect}
              >
                <Icon name="removeSmall" />
              </Clear>
            </Box>
          )}
        </Box>
        {searchQuery && (
          <LabelPrint>
            <FormattedMessage {...messages.labelPrintKeywords} />
          </LabelPrint>
        )}
        {searchQuery && (
          <SearchValuePrint>
            {searchQuery}
          </SearchValuePrint>
        )}
      </Search>
    );
  }
}

TagSearch.propTypes = {
  filters: PropTypes.array,
  searchQuery: PropTypes.string,
  placeholder: PropTypes.string,
  onSearch: PropTypes.func,
  onClear: PropTypes.func,
  multiselect: PropTypes.bool,
};

TagSearch.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default TagSearch;
