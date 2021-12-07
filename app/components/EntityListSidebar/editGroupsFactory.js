import { reduce } from 'lodash/collection';
// import { sortEntities } from 'utils/sort';
import { qe } from 'utils/quasi-equals';
import { API } from 'themes/config';

export const makeEditGroups = ({
  config,
  taxonomies,
  activeEditOption,
  hasUserRole,
  messages,
  actortypes,
  actiontypes,
  targettypes,
  actiontypesForTarget,
  membertypes,
  associationtypes,
}) => {
  const editGroups = {};
  // const selectedActortypes = actortypes && actortypes.filter(
  //   (actortype) => selectedActortypeIds.find((id) => qe(id, actortype.get('id'))),
  // );
  // taxonomy option group
  if (config.taxonomies && taxonomies) {
    // first prepare taxonomy options
    editGroups.taxonomies = {
      id: 'taxonomies', // filterGroupId
      label: messages.taxonomyGroup,
      show: true,
      icon: 'categories',
      options:
        // all selectedActortypeIds must be included in tax.actortypeIds
        taxonomies
          .filter(
            // exclude parent taxonomies
            (tax) => !taxonomies.some(
              (otherTax) => qe(
                tax.get('id'),
                otherTax.getIn(['attributes', 'parent_id']),
              )
            )
          )
          .reduce(
            (memo, taxonomy) => memo.concat([
              {
                id: taxonomy.get('id'), // filterOptionId
                label: messages.taxonomies(taxonomy.get('id')),
                path: config.taxonomies.connectPath,
                key: config.taxonomies.key,
                ownKey: config.taxonomies.ownKey,
                active: !!activeEditOption && activeEditOption.optionId === taxonomy.get('id'),
                create: {
                  path: API.CATEGORIES,
                  attributes: { taxonomy_id: taxonomy.get('id') },
                },
              },
            ]),
            [],
          ),
    };
  }

  // connections option group
  if (config.connections) {
    // first prepare taxonomy options
    editGroups.connections = {
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
                    path: option.connectPath,
                    connection: option.entityType,
                    key: option.key,
                    ownKey: option.ownKey,
                    active: !!activeEditOption && activeEditOption.optionId === id,
                    create: {
                      path: option.path,
                      attributes: config.connections.type === 'action-actors'
                        ? { actortype_id: type.get('id') }
                        : { measuretype_id: type.get('id') },
                    },
                    color: option.entityType,
                  });
                },
                optionsMemo,
              );
          }

          return typeof option.edit === 'undefined' || option.edit
            ? optionsMemo.concat({
              id: option.entityType, // filterOptionId
              label: option.label,
              message: option.message,
              path: option.connectPath,
              connection: option.entityType,
              key: option.key,
              ownKey: option.ownKey,
              active: !!activeEditOption && activeEditOption.optionId === option.entityType,
              create: { path: option.path },
            })
            : optionsMemo;
        },
        [],
      ),
    };
  }
  // targets option group
  if (config.targets) {
    // first prepare taxonomy options
    editGroups.targets = {
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
          // const connectionPath = option.connectionPath || option.entityType;
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
                    path: option.connectPath,
                    connection: option.entityType,
                    key: option.key,
                    ownKey: option.ownKey,
                    active: !!activeEditOption && activeEditOption.optionId === id,
                    create: {
                      path: option.path,
                      attributes: config.targets.type === 'action-targets'
                        ? { actortype_id: type.get('id') }
                        : { measuretype_id: type.get('id') },
                    },
                    color: option.entityType,
                  });
                },
                optionsMemo,
              );
          }
          return typeof option.edit === 'undefined' || option.edit
            ? optionsMemo.concat({
              id: option.entityType, // filterOptionId
              label: option.label,
              message: option.message,
              path: option.connectPath,
              connection: option.entityType,
              key: option.key,
              ownKey: option.ownKey,
              active: !!activeEditOption && activeEditOption.optionId === option.entityType,
              create: { path: option.path },
            })
            : optionsMemo;
        },
        [],
      ),
    };
  }

  // members option groups
  if (config.members && membertypes) {
    // first prepare taxonomy options
    editGroups.members = {
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
                path: option.connectPath,
                connection: option.entityType,
                key: option.key,
                ownKey: option.ownKey,
                active: !!activeEditOption && activeEditOption.optionId === id,
                create: {
                  path: option.path,
                  attributes: { actortype_id: type.get('id') },
                },
                color: option.entityType,
              });
            },
            optionsMemo,
          ),
        [],
      ),
    };
  }
  // associations option groups
  if (config.associations && associationtypes) {
    // first prepare taxonomy options
    editGroups.associations = {
      id: 'associations', // filterGroupId
      label: messages.connections(config.associations.type),
      show: true,
      options: reduce(
        config.associations.options,
        (optionsMemo, option) => associationtypes
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
                path: option.connectPath,
                connection: option.entityType,
                key: option.key,
                ownKey: option.ownKey,
                active: !!activeEditOption && activeEditOption.optionId === id,
                create: {
                  path: option.path,
                  attributes: { actortype_id: type.get('id') },
                },
                color: option.entityType,
              });
            },
            optionsMemo,
          ),
        [],
      ),
    };
  }
  // attributes
  if (config.attributes) {
    // first prepare taxonomy options
    editGroups.attributes = {
      id: 'attributes', // filterGroupId
      label: messages.attributes,
      show: true,
      options: reduce(
        config.attributes.options,
        (optionsMemo, option) => {
          if (
            (typeof option.edit === 'undefined' || option.edit)
            && (typeof option.role === 'undefined' || hasUserRole[option.role])
          ) {
            return optionsMemo.concat({
              id: option.attribute, // filterOptionId
              label: option.label,
              message: option.message,
              active: !!activeEditOption && activeEditOption.optionId === option.attribute,
            });
          }
          return optionsMemo;
        },
        [],
      ),
    };
  }
  return editGroups;
};
