/*
 *
 * TagList
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

import Icon from 'components/Icon';
import Button from 'components/buttons/Button';
import ButtonTagFilter from 'components/buttons/ButtonTagFilter';
import ButtonTagFilterInverse from 'components/buttons/ButtonTagFilterInverse';
import PrintOnly from 'components/styled/PrintOnly';

import messages from './messages';

const Styled = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;
  @media print {
    border: none;
    box-shadow: none;
    padding: 0;
    display: ${({ hidePrint }) => hidePrint ? 'none' : 'block'};
  }
`;

const Tags = styled.div`
  margin-top: -2px;
  margin-bottom: -2px;
`;

const Clear = styled(Button)`
  padding: ${(props) => props.small ? '4px 6px' : '8px 6px'};
  background-color: ${palette('background', 4)};
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    padding: ${(props) => props.small ? '4px 6px' : '8px 6px'};
  }
  @media print {
    display: none;
  }
`;

const LabelPrint = styled(PrintOnly)`
  margin-top: 10px;
  font-size: ${(props) => props.theme.sizes.print.smaller};
`;

export class TagList extends React.Component { // eslint-disable-line react/prefer-stateless-function
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
    const { filters } = this.props;
    const hasFilters = filters.length > 0;
    return (
      <Styled hidePrint={!hasFilters}>
        {hasFilters && (
          <LabelPrint>
            <FormattedMessage {...messages.labelPrintFilters} />
          </LabelPrint>
        )}
        { hasFilters && (
          <Tags>
            {
              filters.map((filter, i) => filter.inverse
                ? (
                  <ButtonTagFilterInverse
                    key={i}
                    onClick={filter.onClick}
                    palette={filter.type || 'attributes'}
                    paletteHover={`${filter.type || 'attributes'}Hover`}
                    pIndex={parseInt(filter.id, 10) || 0}
                    disabled={!filter.onClick}
                  >
                    {this.getFilterLabel(filter)}
                    { filter.onClick
                    && <Icon name="removeSmall" text textRight hidePrint />
                    }
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
                  >
                    {this.getFilterLabel(filter)}
                    { filter.onClick
                    && <Icon name="removeSmall" text textRight hidePrint />
                    }
                  </ButtonTagFilter>
                ))
            }
          </Tags>
        )}
        { hasFilters && (
          <Clear
            onClick={this.props.onClear}
          >
            <Icon name="removeSmall" />
          </Clear>
        )}
      </Styled>
    );
  }
}

TagList.propTypes = {
  filters: PropTypes.array,
  placeholder: PropTypes.string,
  onClear: PropTypes.func,
};

TagList.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default TagList;
