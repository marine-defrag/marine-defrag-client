import { reduce } from 'lodash/collection';
import { sortEntities } from 'utils/sort';
import { startsWith } from 'utils/string';

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
    Object.keys(config.connections).forEach((connectionKey) => {
      const option = config.connections[connectionKey];
      let types;
      if (option.type === 'action-actors') {
        types = actortypes;
      } else if (option.type === 'action-targets') {
        types = targettypes;
      } else if (option.type === 'target-actions') {
        types = actiontypesForTarget;
      } else if (option.type === 'actor-actions') {
        types = actiontypes;
      } else if (option.type === 'action-parents') {
        types = actiontypes;
      } else if (option.type === 'association-members') {
        types = membertypes;
      } else if (option.type === 'member-associations') {
        types = associationtypes;
      } else if (option.type === 'action-resources') {
        types = resourcetypes;
      }
      filterGroups[connectionKey] = {
        id: connectionKey, // filterGroupId
        label: messages.connections(option.type),
        show: true,
        options: types && types
          .filter((type) => {
            if (option.type === 'action-parents') {
              return type.get('id') === typeId && (!option.typeFilter || type.getIn(['attributes', option.typeFilter]));
            }
            if (option.typeFilterPass === 'reverse') {
              return !type.getIn(['attributes', option.typeFilter]);
            }
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
          .reduce((memo, type) => {
            const id = type.get('id');
            return memo.concat({
              id, // filterOptionId
              label: option.label,
              message: (option.message && option.message.indexOf('{typeid}') > -1)
                ? option.message.replace('{typeid}', type.get('id'))
                : option.message,
              color: option.entityType,
              active: !!activeFilterOption
                && activeFilterOption.group === connectionKey
                && activeFilterOption.optionId === id,
            });
          }, []),
      };
    });
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
