import { reduce } from 'lodash/collection';
import { sortEntities } from 'utils/sort';
import { startsWith } from 'utils/string';
import qe from 'utils/quasi-equals';

// figure out filter groups for filter panel
export const makeFilterGroups = ({
  config,
  taxonomies,
  hasUserRole,
  actortypes,
  actiontypes,
  targettypes,
  resourcetypes,
  actiontypesForTarget,
  activeFilterOption,
  membertypes,
  associationtypes,
  messages,
  typeId,
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
          } else if (
            config.connections.type === 'actor-actions'
            || config.connections.type === 'resource-actions'
          ) {
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
  if (config.members && membertypes) {
    // first prepare taxonomy options
    filterGroups.members = {
      id: 'members', // filterGroupId
      label: messages.connections(config.members.type),
      show: true,
      options: reduce(
        config.members.options,
        (optionsMemo, option) => membertypes
          .filter((type) => {
            if (option.typeFilter) {
              if (option.typeFilterPass === 'reverse') {
                return !type.getIn(['attributes', option.typeFilter]);
              }
              return type.getIn(['attributes', option.typeFilter]);
            }
            return true;
          })
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
                  && activeFilterOption.group === 'members'
                  && activeFilterOption.optionId === id,
              });
            },
            optionsMemo,
          ),
        [],
      ),
    };
  }
  if (config.associations && associationtypes) {
    // first prepare taxonomy options
    filterGroups.associations = {
      id: 'associations', // filterGroupId
      label: messages.connections(config.associations.type),
      show: true,
      options: reduce(
        config.associations.options,
        (optionsMemo, option) => associationtypes
          .filter((type) => {
            if (!option.typeFilter) return true;
            let attribute = option.typeFilter;
            const notFilter = startsWith(option.typeFilter, '!');
            if (notFilter) {
              attribute = option.typeFilter.substring(1);
            }
            return notFilter
              ? !type.getIn(['attributes', attribute])
              : type.getIn(['attributes', attribute]);
          })
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
                  && activeFilterOption.group === 'associations'
                  && activeFilterOption.optionId === id,
              });
            },
            optionsMemo,
          ),
        [],
      ),
    };
  }
  // connections option group
  if (config.resources && resourcetypes) {
    // first prepare taxonomy options
    filterGroups.resources = {
      id: 'resources', // filterGroupId
      label: messages.connections(config.resources.type),
      show: true,
      options: reduce(
        config.resources.options,
        (optionsMemo, option) => {
          if (option.groupByType && resourcetypes) {
            return resourcetypes
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
                      && activeFilterOption.group === 'resources'
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
  if (config.parents) {
    filterGroups.parents = {
      id: 'parents', // filterGroupId
      label: messages.connections(config.parents.type),
      show: true,
      options: reduce(
        config.parents.options,
        (optionsMemo, option) => {
          const connectedTypes = actiontypes;
          if (option.groupByType && connectedTypes) {
            return connectedTypes
              .filter(
                (type) => qe(type.get('id'), typeId)
                  && (!option.typeFilter || type.getIn(['attributes', option.typeFilter]))
              )
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
                      && activeFilterOption.group === 'parents'
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
