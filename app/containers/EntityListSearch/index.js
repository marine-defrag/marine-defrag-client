/*
 *
 * EntityListSearch
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, intlShape, injectIntl } from 'react-intl';

import styled from 'styled-components';
import { palette } from 'styled-theme';

import { selectIsPrintView } from 'containers/App/selectors';

import Icon from 'components/Icon';
import Button from 'components/buttons/Button';
import DebounceInput from 'react-debounce-input';
import PrintOnly from 'components/styled/PrintOnly';
import PrintHide from 'components/styled/PrintHide';

import messages from './messages';

const EntityListSearchWrapper = styled.div`
  padding-top: 12px;
  padding-bottom: 12px;
  @media (min-width: ${(props) => props.theme && props.theme.breakpoints ? props.theme.breakpoints.medium : '769px'}) {
    padding-top: 12px;
    padding-bottom: 16px;
  }
`;

const Search = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  background-color: ${palette('background', 0)};
  color: ${palette('dark', 2)};
  padding: 2px 7px;
  min-height: ${({ small }) => small ? 30 : 36}px;
  border-radius: 5px;
  position: relative;
  border: 1px solid;
  border-color: ${({ active, theme }) => active ? theme.global.colors.highlight : palette('light', 2)};
  outline: 1px solid ${({ active, theme }) => active ? theme.global.colors.highlight : 'transparent'};

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
const Clear = styled(Button)`
  padding: ${({ small }) => small ? '4px 6px' : '6px 6px'};
  position: absolute;
  top: 0;
  right: 0;
  background-color: ${palette('background', 4)};
  @media (min-width: ${({ theme }) => theme.breakpoints.medium}) {
    padding: ${({ small }) => small ? '4px 6px' : '6px 6px'};
  }
  @media print {
    display: none;
  }
  &:focus-visible {
    border-radius: 5px;
  }
`;

const LabelPrint = styled.div`
  margin-top: 10px;
  font-size: ${({ theme }) => theme.sizes.print.smaller};
`;
const SearchValuePrint = styled.div`
  font-size: ${({ theme }) => theme.sizes.print.default};
  font-weight: bold;
`;

export class EntityListSearch extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor() {
    super();
    this.state = {
      active: false,
    };
  }

  render() {
    const {
      searchQuery,
      onSearch,
      placeholder,
      intl,
      isPrint,
    } = this.props;
    // TODO set focus to input when clicking wrapper
    //  see https://github.com/nkbt/react-debounce-input/issues/65
    //  https://github.com/yannickcr/eslint-plugin-react/issues/678
    // for now this works all right thanks to flex layout
    // onClick={() => {
    //   this.inputNode.focus()
    // }}
    return (
      <>
        <PrintHide>
          <EntityListSearchWrapper>
            <Search
              active={this.state.active}
              printHide={!searchQuery}
              isPrint={isPrint}
            >
              <SearchInput
                id="search"
                minLength={1}
                debounceTimeout={500}
                value={searchQuery || ''}
                onChange={(e) => onSearch(e.target.value)}
                onFocus={() => this.setState({ active: true })}
                onBlur={() => this.setState({ active: false })}
                placeholder={placeholder || (intl.formatMessage(messages.searchPlaceholderEntities))}
              />
              { searchQuery && (
                <Clear
                  onClick={() => onSearch()}
                >
                  <Icon name="removeSmall" />
                </Clear>
              )}
            </Search>
          </EntityListSearchWrapper>
        </PrintHide>
        {searchQuery && (
          <PrintOnly isPrint={isPrint}>
            <LabelPrint>
              <FormattedMessage {...messages.labelPrintKeywords} />
            </LabelPrint>
            <SearchValuePrint>
              {searchQuery}
            </SearchValuePrint>
          </PrintOnly>
        )}
      </>
    );
  }
}

EntityListSearch.propTypes = {
  searchQuery: PropTypes.string,
  placeholder: PropTypes.string,
  onSearch: PropTypes.func,
  isPrint: PropTypes.bool,
  intl: intlShape.isRequired,
};
const mapStateToProps = (state) => ({
  isPrint: selectIsPrintView(state),
});

export default connect(mapStateToProps, null)(injectIntl(EntityListSearch));
