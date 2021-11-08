import { reduce } from 'lodash/collection';
import { sortEntities } from 'utils/sort';
import { qe } from 'utils/quasi-equals';

// figure out filter groups for filter panel
export const makeFilterGroups = (
  config,
  taxonomies,
  connectedTaxonomies,
  activeFilterOption,
  hasUserRole,
  messages,
  actortypes,
) => {
  const filterGroups = {};

  // taxonomy option group
  if (config.taxonomies && taxonomies) {
    // multi actortype mode
    if (config.actortypes && actortypes && actortypes.size > 1) {
      // single actortype taxonomy
      actortypes.forEach((actortype) => {
        const actortypeTaxonomies = taxonomies.filter((tax) => {
          const taxActortypeIds = tax.get('actortypeIds');
          return taxActortypeIds.size === 1
              && taxActortypeIds.find((actortypeid) => qe(actortypeid, actortype.get('id')));
        });
        filterGroups[`taxonomies_${actortype.get('id')}`] = {
          id: `taxonomies_${actortype.get('id')}`, // filterGroupId
          type: 'taxonomies',
          label: messages.taxonomyGroupByActortype(actortype.get('id')),
          show: true,
          icon: 'categories',
          options:
            sortEntities(actortypeTaxonomies, 'asc', 'priority')
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
      });
      const commonTaxonomies = taxonomies.filter((tax) => tax.get('actortypeIds')
          && tax.get('actortypeIds').size > 1);
      filterGroups.taxonomies = {
        id: 'taxonomies', // filterGroupId
        label: messages.taxonomyGroupByActortype('common'),
        show: true,
        icon: 'categories',
        options:
          sortEntities(commonTaxonomies, 'asc', 'priority')
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
    } else {
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
  }

  // connectedTaxonomies option group
  if (config.connectedTaxonomies) {
    // first prepare taxonomy options
    filterGroups.connectedTaxonomies = {
      id: 'connectedTaxonomies', // filterGroupId
      label: messages.connectedTaxonomies,
      show: true,
      icon: 'connectedCategories',
      options:
        sortEntities(connectedTaxonomies, 'asc', 'priority')
          .reduce(
            (taxOptionsMemo, taxonomy) => (config.connectedTaxonomies.exclude
            && taxonomy.getIn(['attributes', config.connectedTaxonomies.exclude]))
              ? taxOptionsMemo
              : taxOptionsMemo.concat([
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
      label: messages.connections,
      show: true,
      options: reduce(
        config.connections.options,
        (optionsMemo, option) => {
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
                    icon: id,
                    color: option.path,
                    active: !!activeFilterOption && activeFilterOption.optionId === id,
                  });
                },
                optionsMemo,
              );
          }
          return optionsMemo.concat({
            id: option.path, // filterOptionId
            label: option.label,
            message: option.message,
            icon: option.path,
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
