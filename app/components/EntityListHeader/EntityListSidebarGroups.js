/*
 *
 * EntityListSidebarGroups
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import { Box } from 'grommet';

import { getFilterLabel } from 'components/TagList';
import Icon from 'components/Icon';
import ButtonTagFilter from 'components/buttons/ButtonTagFilter';

import EntityListSidebarGroupLabel from './EntityListSidebarGroupLabel';
import EntityListSidebarOption from './EntityListSidebarOption';

const Group = styled((p) => (
  <Box
    pad={{ vertical: 'small' }}
    {...p}
  />
))`
  border-top: 1px solid ${palette('light', 2)};
  &:last-child {
    border-bottom: 1px solid ${palette('light', 2)};
  }
`;

class EntityListSidebarGroups extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { groups, onHideOptions } = this.props;
    const { intl } = this.context;
    return (
      <div>
        {groups && groups.entrySeq().map(([groupId, group]) => {
          const groupOptions = group.get('options') && group.get('options').filter(
            (option) => option.get('id')
          );
          if (groupOptions && groupOptions.size > 0) {
            return (
              <Group key={groupId} expanded={this.props.expanded[groupId]}>
                <EntityListSidebarGroupLabel
                  label={group.get('label')}
                  icon={group.get('icon') || group.get('id')}
                  expanded={this.props.expanded[groupId]}
                  onToggle={(evt) => {
                    if (evt !== undefined && evt.preventDefault) evt.preventDefault();
                    this.props.onToggleGroup(groupId, !this.props.expanded[groupId]);
                  }}
                />
                {this.props.expanded[groupId] && (
                  <Box margin={{ top: 'ms', bottom: 'medium' }}>
                    {groupOptions.map(
                      (option, i) => (
                        <Box key={i}>
                          <EntityListSidebarOption
                            option={option}
                            groupId={group.get('id')}
                            groupType={group.get('type')}
                            onShowForm={this.props.onShowForm}
                          />
                          {option.get('currentFilters') && option.get('currentFilters').size > 0 && (
                            <Box
                              pad={{
                                top: 'xxsmall',
                                bottom: 'xsmall',
                                left: 'medium',
                              }}
                              align="start"
                              gap="hair"
                            >
                              {option.get('currentFilters').map(
                                (f, j) => {
                                  const filter = f.toJS();
                                  return (
                                    <Box key={j} align="start">
                                      <ButtonTagFilter
                                        onClick={(arg) => {
                                          onHideOptions();
                                          filter.onClick(arg);
                                        }}
                                        palette={filter.type || 'attributes'}
                                        paletteHover={`${filter.type || 'attributes'}Hover`}
                                        pIndex={parseInt(filter.id, 10) || 0}
                                        disabled={!filter.onClick}
                                      >
                                        {getFilterLabel(filter, intl, true)}
                                        {filter.onClick && <Icon name="removeSmall" text textRight hidePrint />}
                                      </ButtonTagFilter>
                                    </Box>
                                  );
                                }
                              )}
                            </Box>
                          )}
                        </Box>
                      )
                    )}
                  </Box>
                )}
              </Group>
            );
          }
          return null;
        })}
      </div>
    );
  }
}
EntityListSidebarGroups.propTypes = {
  groups: PropTypes.object,
  expanded: PropTypes.object,
  onShowForm: PropTypes.func.isRequired,
  onHideOptions: PropTypes.func.isRequired,
  onToggleGroup: PropTypes.func.isRequired,
};

EntityListSidebarGroups.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default EntityListSidebarGroups;
