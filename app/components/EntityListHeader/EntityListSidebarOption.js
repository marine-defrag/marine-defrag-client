/*
 *
 * EntityListSidebarOption
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';
import { palette } from 'styled-theme';

import appMessage from 'utils/app-message';

import Button from 'components/buttons/Button';
import Icon from 'components/Icon';

import messages from './messages';

// TODO compare TaxonomySidebarItem
const Styled = styled(Button)`
  display: table;
  width: 100%;
  font-weight: bold;
  padding: ${(props) => props.small ? '0.5em 8px 0.5em 36px' : '0.75em 8px 0.75em 16px'};
  text-align: left;
  color:  ${(props) => props.active ? palette('asideListItem', 1) : palette('asideListItem', 0)};
  background-color: ${(props) => props.active ? palette('asideListItem', 3) : palette('asideListItem', 2)};
  border-bottom: 1px solid ${palette('asideListItem', 4)};
  &:hover {
    color: ${(props) => props.active ? palette('asideListItemHover', 1) : palette('asideListItemHover', 0)};
    background-color: ${(props) => props.active ? palette('asideListItemHover', 3) : palette('asideListItemHover', 2)};
    border-bottom-color: ${palette('asideListItemHover', 4)}
  }
  &:last-child {
    border-bottom: 0;
  }
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    padding: ${(props) => props.small ? '0.5em 8px 0.5em 36px' : '0.75em 8px 0.75em 16px'};
  }
`;
const Label = styled.div`
  vertical-align: middle;
  display: table-cell;
  width: 99%;
`;
const IconWrapper = styled.div`
  color: ${palette('light', 3)};
  vertical-align: middle;
  padding: 0 5px;
  display: table-cell;
  width: 35px;
`;

class EntityListSidebarOption extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const {
      option, onShowForm, groupId, groupType,
    } = this.props;
    const { intl } = this.context;
    return (
      <Styled
        active={option.get('active')}
        small={option.get('nested')}
        onClick={() => onShowForm({
          group: groupType || groupId,
          optionId: option.get('id'),
          path: option.get('path'),
          connection: option.get('connection'),
          key: option.get('key'),
          ownKey: option.get('ownKey'),
          active: option.get('active'),
          create: option.get('create') && option.get('create').toJS(),
        })}
        title={intl.formatMessage(
          option.get('active') ? messages.groupOptionSelect.hide : messages.groupOptionSelect.show
        )}
      >
        <Label>
          { option.get('message')
            ? appMessage(intl, option.get('message'))
            : option.get('label')
          }
        </Label>
        { option.get('icon')
          && (
            <IconWrapper>
              <Icon name={option.get('icon')} />
            </IconWrapper>
          )
        }
      </Styled>
    );
  }
}

EntityListSidebarOption.propTypes = {
  option: PropTypes.object.isRequired,
  groupId: PropTypes.string.isRequired,
  groupType: PropTypes.string,
  onShowForm: PropTypes.func.isRequired,
};


EntityListSidebarOption.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default EntityListSidebarOption;
