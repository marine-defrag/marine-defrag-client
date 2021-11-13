import { ROUTES } from 'themes/config';
import { qe } from 'utils/quasi-equals';
import { fromJS } from 'immutable';

export const getTaxonomyTagList = (taxonomy) => {
  const tags = [];
  if (taxonomy.getIn(['attributes', 'tags_actions'])) {
    tags.push({
      type: 'actions',
      icon: 'actions',
    });
  }
  if (taxonomy.getIn(['attributes', 'tags_actors'])) {
    tags.push({
      type: 'actors',
      icon: 'actors',
    });
  }
  return tags;
};

const mapTaxonomy = (tax, childTaxonomies, activeId, onLink) => {
  const children = childTaxonomies
    .filter((t) => qe(t.getIn(['attributes', 'parent_id']), tax.get('id')))
    .toList()
    .toJS();
  return fromJS({
    id: tax.get('id'),
    count: tax.count,
    onLink: (isActive = false) => onLink(isActive ? ROUTES.TAXONOMIES : `${ROUTES.TAXONOMIES}/${tax.get('id')}`),
    active: parseInt(activeId, 10) === parseInt(tax.get('id'), 10),
    children: children && children.map((child) => ({
      id: child.id,
      child: true,
      count: child.count,
      onLink: (isActive = false) => onLink(isActive ? ROUTES.TAXONOMIES : `${ROUTES.TAXONOMIES}/${child.id}`),
      active: parseInt(activeId, 10) === parseInt(child.id, 10),
    })),
  });
};

export const prepareTaxonomyGroups = (
  taxonomies, // OrderedMap
  activeId,
  onLink,
  // actortypes,
) => {
  const parentTaxonomies = taxonomies.filter((tax) => tax.getIn(['attributes', 'parent_id']) === ''
    || tax.getIn(['attributes', 'parent_id']) === null);
  const childTaxonomies = taxonomies.filter((tax) => !!tax.getIn(['attributes', 'parent_id']));
  const groups = [];
  //
  // actortypes.forEach((actortype) => {
  //   const actortypeTaxonomies = parentTaxonomies
  //     .filter((tax) => {
  //       const taxActortypeIds = tax.get('actortypeIds');
  //       return tax.getIn(['attributes', 'tags_actors'])
  //         && taxActortypeIds.size === 1
  //         && taxActortypeIds.find((actortypeid) => qe(actortypeid, actortype.get('id')));
  //     })
  //     .map((tax) => mapTaxonomy(tax, childTaxonomies, activeId, onLink))
  //     .toList()
  //     .toJS();
  //
  //   if (actortypeTaxonomies && actortypeTaxonomies.length > 0) {
  //     groups.push({
  //       id: actortype.get('id'),
  //       actortypeId: actortype.get('id'),
  //       taxonomies: actortypeTaxonomies,
  //     });
  //   }
  // });
  // common actortypes
  groups.push({
    id: 'common',
    taxonomies: parentTaxonomies
      // .filter((tax) => tax.getIn(['attributes', 'tags_actors'])
      //   && tax.get('actortypeIds').size > 1)
      .map((tax) => mapTaxonomy(tax, childTaxonomies, activeId, onLink))
      .toList()
      .toJS(),
  });

  // const actionOnlyTaxonomies = parentTaxonomies
  //   .filter((tax) => tax.getIn(['attributes', 'tags_actions'])
  //     && !tax.getIn(['attributes', 'tags_actors']));
  // if (actionOnlyTaxonomies && actionOnlyTaxonomies.size > 0) {
  //   groups.push({
  //     id: 'actions',
  //     taxonomies: actionOnlyTaxonomies
  //       .map((tax) => mapTaxonomy(tax, taxonomies, activeId, onLink))
  //       .toList()
  //       .toJS(),
  //   });
  // }
  return groups;
};

export const getDefaultTaxonomy = (taxonomies, actortypeId) => taxonomies
  .filter((tax) => qe(tax.getIn(['attributes', 'actortype_id']), actortypeId))
  .reduce((memo, tax) => {
    if (memo) {
      const priority = tax.getIn(['attributes', 'priority']);
      if (priority && priority < memo.getIn(['attributes', 'priority'])) {
        return tax;
      }
      return memo;
    }
    return tax;
  }, null);
