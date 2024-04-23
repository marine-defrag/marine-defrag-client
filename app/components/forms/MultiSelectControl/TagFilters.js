import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import { fromJS } from 'immutable';

import Icon from 'components/Icon';
import Button from 'components/buttons/Button';
import OptionList from './OptionList';

import { sortOptions } from './utils';

const Styled = styled.div`
  background-color: ${palette('light', 0)};
  padding: 0 0.25em 0.5em;
  position: relative;
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    padding: 0 0.5em 0.5em;
  }
`;

// padding: 0.75em 2em;
const Group = styled(Button)`
  min-height: 25px;
  padding: 0 0.5em;
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    padding: 0 0.5em;
  }
`;

const GroupWrapper = styled.span`
  display: inline-block;
`;
const Dropdown = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 100%;
  margin-top: -5px;
  width: 100%;
  z-index: 2;
  background-color: ${palette('background', 0)};
  box-shadow: 0 0 8px 0 rgba(0,0,0,0.2);
  overflow-y: auto;
  max-height: 200px;
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    max-height: 320px;
  }
`;
// box-shadow: 0px 0px 8px 0px rgba(0,0,0,0.2);

const Label = styled.div`
  display: inline-block;
  vertical-align: middle;
  position: relative;
  top: 1px;
  font-size: 0.9em;
  font-weight: bold;
  @media print {
    font-size: ${(props) => props.theme.sizes.print.small};
  }
`;

class TagFilters extends React.PureComponent {
  prepareOptions = (options, queryTags) => sortOptions(
    fromJS(options).map((option) => option.withMutations((o) => o.set('checked', queryTags.includes(option.get('value')))))
  );

  render() {
    const {
      openId,
      setOpen,
      tagFilterGroups,
      onTagSelected,
      queryTags,
      handleKeyDown,
    } = this.props;
    if (tagFilterGroups.length === 0) return null;
    return (
      <Styled>
        {tagFilterGroups.map(
          (group, key) => {
            if (!group.options || group.options.length === 0) {
              return null;
            }
            return (
              <GroupWrapper key={key}>
                <Group
                  onClick={(evt) => {
                    if (evt !== undefined && evt.preventDefault) evt.preventDefault();
                    setOpen(key === openId ? null : key);
                  }}
                  active={key === openId}
                  id={`tag-filter-group-${key}`}
                >
                  <Label>
                    {group.title}
                  </Label>
                  <Icon name={openId === key ? 'dropdownClose' : 'dropdownOpen'} text textRight />
                </Group>
                {key === openId && (
                  <Dropdown>
                    <OptionList
                      secondary
                      options={this.prepareOptions(group.options, queryTags)}
                      onCheckboxChange={(active, tagOption) => {
                        setOpen(null);
                        onTagSelected(active, tagOption);
                      }}
                      keyboardAutoCloseEnabled
                      handleKeyDown={(event) => handleKeyDown(event)}
                    />
                  </Dropdown>
                )
                }
              </GroupWrapper>
            );
          }
        )}
      </Styled>
    );
  }
}

TagFilters.propTypes = {
  tagFilterGroups: PropTypes.array,
  queryTags: PropTypes.array,
  onTagSelected: PropTypes.func,
  openId: PropTypes.number,
  setOpen: PropTypes.func,
  handleKeyDown: PropTypes.func,
};

export default TagFilters;
