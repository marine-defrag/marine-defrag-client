/*
 *
 * EntityListSidebarOption
 *
 */

import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';
import { palette } from 'styled-theme';
import { injectIntl, intlShape } from 'react-intl';
import {
  Box, Button, Drop, Text,
} from 'grommet';
import { CircleQuestion } from 'grommet-icons';

import appMessage from 'utils/app-message';

import messages from './messages';

// TODO compare TaxonomySidebarItem
const Styled = styled((p) => (
  <Box
    direction="row"
    fill="horizontal"
    align="center"
    {...p}
  />
))`
  border-bottom: 1px solid ${palette('asideListItem', 4)};
  background-color: ${(props) => props.active ? palette('asideListItem', 3) : palette('asideListItem', 2)};
  color:  ${(props) => props.active ? palette('asideListItem', 1) : palette('asideListItem', 0)};
`;

const StyledButton = styled((p) => <Button plain fill="horizontal" focusIndicator={false} {...p} />)`
  padding: ${(props) => props.small ? '0.5em 8px 0.5em 36px' : '0.75em 8px 0.75em 16px'};
  font-weight: bold;
  text-align: left;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    padding: ${(props) => props.small ? '0.5em 8px 0.5em 36px' : '0.75em 8px 0.75em 16px'};
  }
`;

const Label = styled.div``;

const DropContent = styled((p) => (
  <Box
    pad="small"
    background="light-1"
    {...p}
  />
))`
  max-width: 280px;
`;


function EntityListSidebarOption({
  option, onShowForm, groupId, groupType, intl,
}) {
  const infoRef = useRef(null);
  const [info, showInfo] = useState(false);
  return (
    <Styled active={option.get('active')}>
      <StyledButton
        plain
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
          {option.get('message')
            ? appMessage(intl, option.get('message'))
            : option.get('label')
          }
        </Label>
      </StyledButton>
      {option.get('info') && (
        <Box
          fill={false}
          pad={{ horizontal: 'small' }}
          ref={infoRef}
        >
          <Button
            plain
            icon={<CircleQuestion color={option.get('active') ? 'white' : 'dark-2'} />}
            fill={false}
            onMouseOver={() => showInfo(true)}
            onMouseLeave={() => showInfo(false)}
            onFocus={() => showInfo(true)}
            onBlur={() => null}
            onClick={() => showInfo(!info)}
          />
        </Box>
      )}
      {option.get('info') && info && infoRef && (
        <Drop
          align={{ top: 'top', right: 'left' }}
          target={infoRef.current}
        >
          <DropContent>
            <Text size="small">{option.get('info')}</Text>
          </DropContent>
        </Drop>
      )}
    </Styled>
  );
}

EntityListSidebarOption.propTypes = {
  option: PropTypes.object.isRequired,
  groupId: PropTypes.string.isRequired,
  groupType: PropTypes.string,
  onShowForm: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
};

export default injectIntl(EntityListSidebarOption);
