import { reduce } from 'lodash/collection';
import { sortEntities } from 'utils/sort';

// figure out filter groups for filter panel
export const makeFilterGroups = ({
  config,
  taxonomies,
  hasUserRole,
  actortypes,
  actiontypes,
  targettypes,
  actiontypesForTarget,
  activeFilterOption,
  messages,
}) => {
  const filterGroups = {};

  // taxonomy option group
  if (config.taxonomies && taxonomies) {
    // first prepare taxonomy options
    filterGroups.taxonomies = {
      id: 'taxonomies', // filterGroupId
      label: messages.taxonomyGroup,
      show: true,
      icon: 'categories',
      options:
        sortEntities(taxonomies, 'asc', 'priority')
          .reduce(
            (memo, taxonomy) => memo.concat([
              {
                id: taxonomy.get('id'), // filterOptionId
                label: messages.taxonomies(taxonomy.get('id')),
                active: !!activeFilterOption && activeFilterOption.optionId === taxonomy.get('id'),
                nested: taxonomy.getIn(['attributes', 'parent_id']),
              },
            ]),
            [],
          ),
    };
  }

  // connections option group
  if (config.connections) {
    // first prepare taxonomy options
    filterGroups.connections = {
      id: 'connections', // filterGroupId
      label: messages.connections(config.connections.type),
      show: true,
      options: reduce(
        config.connections.options,
        (optionsMemo, option) => {
          let connectedTypes;
          if (config.connections.type === 'action-actors') {
            connectedTypes = actortypes;
          } else if (config.connections.type === 'actor-actions') {
            connectedTypes = actiontypes;
          }

          if (option.groupByType && connectedTypes) {
            return connectedTypes
              .filter((type) => !option.typeFilter || type.getIn(['attributes', option.typeFilter]))
              .reduce(
                (memo, type) => {
                  const id = `${option.entityType}_${type.get('id')}`;
                  return memo.concat({
                    id, // filterOptionId
                    label: option.label,
                    message: (option.message && option.message.indexOf('{typeid}') > -1)
                      ? option.message.replace('{typeid}', type.get('id'))
                      : option.message,
                    color: option.entityType,
                    active: !!activeFilterOption
                      && activeFilterOption.group === 'connections'
                      && activeFilterOption.optionId === id,
                  });
                },
                optionsMemo,
              );
          }
          return optionsMemo.concat({
            id: option.entityType, // filterOptionId
            label: option.label,
            message: option.message,
            active: !!activeFilterOption && activeFilterOption.optionId === option.entityType,
          });
        },
        [],
      ),
    };
  }
  // targets option group
  if (config.targets) {
    // first prepare taxonomy options
    filterGroups.targets = {
      id: 'targets', // filterGroupId
      label: messages.connections(config.targets.type),
      show: true,
      options: reduce(
        config.targets.options,
        (optionsMemo, option) => {
          let connectedTypes;
          if (config.targets.type === 'action-targets') {
            connectedTypes = targettypes;
          } else if (config.targets.type === 'target-actions') {
            connectedTypes = actiontypesForTarget;
          }
          if (option.groupByType && connectedTypes) {
            return connectedTypes
              .filter((type) => !option.typeFilter || type.getIn(['attributes', option.typeFilter]))
              .reduce(
                (memo, type) => {
                  const id = `${option.entityType}_${type.get('id')}`;
                  return memo.concat({
                    id, // filterOptionId
                    label: option.label,
                    message: (option.message && option.message.indexOf('{typeid}') > -1)
                      ? option.message.replace('{typeid}', type.get('id'))
                      : option.message,
                    color: option.entityType,
                    active: !!activeFilterOption
                      && activeFilterOption.group === 'targets'
                      && activeFilterOption.optionId === id,
                  });
                },
                optionsMemo,
              );
          }
          return optionsMemo.concat({
            id: option.path, // filterOptionId
            label: option.label,
            message: option.message,
            active: !!activeFilterOption && activeFilterOption.optionId === option.path,
          });
        },
        [],
      ),
    };
  }

  // attributes
  if (config.attributes) {
    // first prepare taxonomy options
    filterGroups.attributes = {
      id: 'attributes', // filterGroupId
      label: messages.attributes,
      show: true,
      options: reduce(
        config.attributes.options,
        (memo, option) => (
          typeof option.role === 'undefined'
          || (hasUserRole && hasUserRole[option.role])
        )
          ? memo.concat([{
            id: option.attribute, // filterOptionId
            label: option.label,
            message: option.message,
            active: !!activeFilterOption && activeFilterOption.optionId === option.attribute,
          }])
          : memo,
        [],
      ),
    };
  }

  return filterGroups;
};
