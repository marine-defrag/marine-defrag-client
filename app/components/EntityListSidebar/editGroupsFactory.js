import { reduce } from 'lodash/collection';
// import { sortEntities } from 'utils/sort';
// import { qe } from 'utils/quasi-equals';
import { API } from 'themes/config';

export const makeEditGroups = (
  config,
  taxonomies,
  activeEditOption,
  hasUserRole,
  messages,
  actortypes,
  // selectedActortypeIds,
) => {
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
          // .filter(
          //   // (tax) =>
          //   // (
          //   //   !config.taxonomies.editForActortypes
          //   //   || selectedActortypeIds.isSubset(tax.get('actortypeIds'))
          //   // )
          //   // // not a parent
          //   // &&
          //   (tax) => !taxonomies.some(
          //     (otherTax) => qe(
          //       tax.get('id'),
          //       otherTax.getIn(['attributes', 'parent_id']),
          //     )
          //   )
          // )
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
      label: messages.connections,
      show: true,
      options: reduce(
        config.connections.options,
        (optionsMemo, option) => {
          // exclude connections not applicabel for all actortypes
          // if (
          //   option.actortypeFilter
          //   && option.editForActortypes
          //   && actortypes
          //   && !selectedActortypes.every((actortype) => actortype.getIn(['attributes', option.actortypeFilter]))
          // ) {
          //   return optionsMemo;
          // }
          if (option.groupByActortype && actortypes) {
            return actortypes
              .filter((actortype) => !option.actortypeFilter || actortype.getIn(['attributes', option.actortypeFilter]))
              .reduce(
                (memo, actortype) => {
                  const id = `${option.path}_${actortype.get('id')}`;
                  return memo.concat({
                    id, // filterOptionId
                    label: option.label,
                    message: (option.message && option.message.indexOf('{actortypeid}') > -1)
                      ? option.message.replace('{actortypeid}', actortype.get('id'))
                      : option.message,
                    path: option.connectPath,
                    connection: option.path,
                    key: option.key,
                    ownKey: option.ownKey,
                    icon: id,
                    active: !!activeEditOption && activeEditOption.optionId === id,
                    create: { path: option.path },
                    color: option.path,
                  });
                },
                optionsMemo,
              );
          }
          return typeof option.edit === 'undefined' || option.edit
            ? optionsMemo.concat({
              id: option.path, // filterOptionId
              label: option.label,
              message: option.message,
              path: option.connectPath,
              connection: option.path,
              key: option.key,
              ownKey: option.ownKey,
              icon: option.path,
              active: !!activeEditOption && activeEditOption.optionId === option.path,
              create: { path: option.path },
            })
            : optionsMemo;
        },
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
          // if (
          //   option.actortypeFilter
          //   && option.editForActortypes
          //   && actortypes
          //   && !selectedActortypes.every((actortype) => actortype.getIn(['attributes', option.actortypeFilter]))
          // ) {
          //   return optionsMemo;
          // }
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
