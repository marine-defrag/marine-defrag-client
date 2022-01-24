import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import { kebabCase } from 'lodash/string';
import { FormattedMessage } from 'react-intl';
import {
  Box, Button, Drop, Text,
} from 'grommet';
import { CircleQuestion } from 'grommet-icons';

import A from 'components/styled/A';
import IndeterminateCheckbox from 'components/forms/IndeterminateCheckbox';

import Option from './Option';

import messages from './messages';

const Styled = styled.div`
  width: 100%;
`;
const ListWrapper = styled.div`
  width: 100%;
  border-top: 1px solid ${palette('light', 1)};
`;

const OptionsWrapper = styled((p) => <Box {...p} />)`
  width: 100%;
`;

const OptionWrapper = styled((p) => (
  <Box fill="horizontal" direction="row" align="center" {...p} />
))`
  width: 100%;
  line-height: 1.3;
  font-size: 0.8em;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    border-bottom: 1px solid ${palette('light', 1)};
    font-size: 1em;
  }
  @media print {
    font-size: ${(props) => props.theme.sizes.print.default};
  }
`;
const CheckboxWrapper = styled((p) => (
  <Box
    fill="vertical"
    flex={{ shrink: 0 }}
    align="center"
    {...p}
  />
))`
  width: 40px;
`;

const OptionLabel = styled((p) => <Box pad={{ vertical: 'small' }} fill as="label" {...p} />)`
  vertical-align: middle;
  cursor: pointer;
  border-right: ${(props) => (props.changedToChecked || props.changedToUnchecked)
    ? '0.5em solid'
    : 'none'
};
  border-right-color: ${palette('buttonDefault', 1)};
`;

const GroupWrapper = styled.div`
  width: 100%;
`;
const GroupTitle = styled.div`
  border-bottom: 1px solid ${palette('light', 1)};
  width: 100%;
  line-height: 1.3;
  font-size: 0.6em;
  font-weight: 500;
  padding: 0.8em 8px 0.4em 16px;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    font-size: 0.7em;
  }
  @media print {
    font-size: ${(props) => props.theme.sizes.print.smallest};
  }
`;

const Empty = styled.div`
  padding: 1em;
  color: ${palette('text', 1)};
`;

const More = styled.div`
  display: block;
  width: 100%;
  padding: 0.5em 1em;
  text-align: center;
  font-size: 0.85em;
  @media print {
    font-size: ${(props) => props.theme.sizes.print.smaller};
  }
`;
const MoreLink = styled(A)`
  font-weight: bold;
`;

const DropContent = styled((p) => (
  <Box
    pad="small"
    background="light-1"
    {...p}
  />
))`
  max-width: 280px;
`;

const SHOW_INCREMENT = 20;

function OptionList(props) {
  const [noItems, setNoItems] = useState(SHOW_INCREMENT);
  const [info, showInfo] = useState(false);

  const infoRef = useRef(null);

  // do groups not slice
  const options = props.groups
    ? props.options
    : (props.options && props.options.slice(0, noItems));
  const groups = options && options
    .groupBy((option) => option.get('group') || 1)
    .map((group, key) => props.groups
      ? Map()
        .set('options', group)
        .set('title', props.groups.get(key))
      : Map().set('options', group));

  const hasMore = options.size < props.options.size;
  return (
    <Styled>
      <ListWrapper>
        { groups && groups.toList().map((group, gid) => (
          <GroupWrapper key={gid}>
            { group.get('title') && (
              <GroupTitle>
                { group.get('title') }
              </GroupTitle>
            )}
            <OptionsWrapper>
              { group.get('options') && group.get('options').map((option, i) => {
                const checked = option.get('checked');
                const isIndeterminate = option.get('isIndeterminate');
                const id = `${i}-${kebabCase(option.get('value'))}`;
                return (
                  <OptionWrapper
                    key={id}
                    changedToChecked={option.get('changedToChecked')}
                    changedToUnchecked={option.get('changedToUnchecked')}
                    secondary={props.secondary}
                  >
                    <CheckboxWrapper>
                      { isIndeterminate
                        && (
                          <IndeterminateCheckbox
                            id={id}
                            checked={checked}
                            onChange={(checkedState) => {
                              props.onCheckboxChange(checkedState, option);
                            }}
                          />
                        )
                      }
                      { !isIndeterminate
                        && (
                          <input
                            id={id}
                            type="checkbox"
                            checked={checked}
                            onChange={(evt) => {
                              evt.stopPropagation();
                              props.onCheckboxChange(evt.target.checked, option);
                            }}
                          />
                        )
                      }
                    </CheckboxWrapper>
                    <OptionLabel
                      htmlFor={id}
                      changedToChecked={option.get('changedToChecked')}
                      changedToUnchecked={option.get('changedToUnchecked')}
                      secondary={props.secondary}
                    >
                      <Option
                        emphasis={option.get('labelEmphasis')}
                        reference={typeof option.get('reference') !== 'undefined' && option.get('reference') !== null ? option.get('reference').toString() : ''}
                        label={option.get('label')}
                        info={option.get('info')}
                        messagePrefix={option.get('messagePrefix')}
                        message={option.get('message')}
                        isNew={option.get('isNew')}
                        draft={option.get('draft')}
                      />
                    </OptionLabel>
                    {option.get('info') && (
                      <Box
                        fill={false}
                        pad={{ horizontal: 'small' }}
                        ref={infoRef}
                        flex={{ shrink: 0 }}
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
                  </OptionWrapper>
                );
              })}
            </OptionsWrapper>
          </GroupWrapper>
        ))}
        { (!props.options || props.options.size === 0)
          && (
            <Empty>
              <FormattedMessage {...messages.empty} />
            </Empty>
          )
        }
      </ListWrapper>
      { hasMore
        && (
          <More>
            <FormattedMessage
              {...messages.showingOptions}
              values={{
                no: options.size,
                total: props.options.size,
              }}
            />
            <MoreLink
              href="/"
              onClick={(evt) => {
                if (evt && evt.preventDefault) evt.preventDefault();
                setNoItems(noItems + SHOW_INCREMENT);
              }}
            >
              <FormattedMessage {...messages.showMore} />
            </MoreLink>
          </More>
        )
      }
    </Styled>
  );
}


OptionList.propTypes = {
  options: PropTypes.object,
  groups: PropTypes.object,
  onCheckboxChange: PropTypes.func,
  secondary: PropTypes.bool,
};

export default OptionList;
