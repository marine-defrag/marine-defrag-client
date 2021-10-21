import React from 'react';
import Link from 'containers/Link';
import PropTypes from 'prop-types';
import { List } from 'immutable';
import styled from 'styled-components';
import { palette } from 'styled-theme';

import { getSortOption } from 'utils/sort';
import { getCategoryTitle } from 'utils/entities';
import { qe } from 'utils/quasi-equals';

import CategoryListHeader from 'components/categoryList/CategoryListHeader';
import CategoryListItem from 'components/categoryList/CategoryListItem';

import { SORT_ORDER_OPTIONS } from 'containers/App/constants';
import appMessages from 'containers/App/messages';

const Styled = styled.div`
  position: relative;
`;
const CategoryListBody = styled.div`
  padding-top: 5px;
`;
const GroupHeaderLink = styled(Link)`
  color: ${palette('link', 2)};
  &:hover {
    color: ${palette('linkHover', 2)};
  }
`;

const GroupHeader = styled.h6`
  font-weight: normal;
  margin-top: 6px;
  margin-bottom: 3px;
  @media (min-width: ${(props) => props.theme && props.theme.breakpoints ? props.theme.breakpoints.small : '769px'}) {
    margin-top: 20px;
    margin-bottom: 10px;
  }
  @media print {
    margin-top: 30px;
    margin-bottom: 6px;
    padding-bottom: 2px;
    font-weight: bold;
    font-size: ${(props) => props.theme.sizes.print.smaller};
    color: ${palette('text', 1)};
  }
`;

const TITLE_COL_RATIO = 0.4;

class CategoryListItems extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  getTagsTax = (taxonomy, tagsAttribute) => taxonomy.getIn(['attributes', tagsAttribute])
    || (
      taxonomy.get('children')
      && taxonomy.get('children').some(
        (childTax) => childTax.getIn(['attributes', tagsAttribute]),
      )
    );

  getColumnKeys = (taxonomy, actortypes) => {
    const { intl } = this.context;
    // figure out if tagged directly or via child category
    const tagsActors = this.getTagsTax(taxonomy, 'tags_actors');
    return tagsActors && actortypes && taxonomy.get('actortypeIds').toArray().reduce(
      (memo, actortypeid) => {
        const actortype = actortypes.find((actortype) => qe(actortype.get('id'), actortypeid));
        // TODO figure out multiple actortype with responses
        if (actortype && actortype.getIn(['attributes', 'has_response'])) {
          return [{
            items: [
              {
                label: intl.formatMessage(appMessages.ui.acceptedStatuses.accepted),
                palette: 'actors',
                pIndex: 0,
              },
              {
                label: intl.formatMessage(appMessages.ui.acceptedStatuses.noted),
                palette: 'actors',
                pIndex: 1,
              },
            ],
          }];
        }
        return memo;
      },
      [],
    );
  };

  getHeaderAttributes = (taxonomy, actortypeId, actortypes) => {
    const { intl } = this.context;
    // figure out if tagged directly or via child category
    const tagsActors = this.getTagsTax(taxonomy, 'tags_actors');
    const tagsActions = this.getTagsTax(taxonomy, 'tags_actions');
    const isList = taxonomy.get('actortypeIds')
      && taxonomy.get('actortypeIds').size > 1;
    const actortypeSet = actortypeId && actortypeId !== 'all';
    const attributes = [];
    // directly associated objectives/actors
    if (tagsActors) {
      let actorLabel;
      if (isList && !actortypeSet) {
        actorLabel = `${intl.formatMessage(
          appMessages.entities.actors.plural
        )} (${intl.formatMessage(
          appMessages.actortypes.all
        )})`;
      } else if (actortypeSet) {
        actorLabel = intl.formatMessage(appMessages.entities[`actors_${actortypeId}`].plural);
      } else {
        const actortypeId = taxonomy.get('actortypeIds').first();
        actorLabel = intl.formatMessage(appMessages.entities[`actors_${actortypeId}`].plural);
      }
      attributes.push({
        query: 'actors',
        label: actorLabel,
        keys: this.getColumnKeys(taxonomy, actortypes),
      });
      // indirectly associated/inferred actions
      if (!tagsActions) {
        attributes.push({
          via: intl.formatMessage(appMessages.entities.connected),
          query: 'actions',
          label: intl.formatMessage(appMessages.entities.actions.plural),
        });
      }
    }
    // directly associated actions
    if (tagsActions) {
      attributes.push({
        query: 'actions',
        label: intl.formatMessage(appMessages.entities.actions.plural),
      });
    }
    return attributes;
  }

  getListHeaderColumns = ({
    taxonomy,
    actortypeId,
    sortOptions,
    sortBy,
    sortOrder,
    onSort,
    userOnly,
    isGrouped,
    actortypes,
  }) => {
    const { intl } = this.context;
    const sortOptionActive = getSortOption(sortOptions, sortBy, 'query');
    const titleColumnSortOption = sortOptions.find((option) => option.query === 'title');
    const titleColumnActive = titleColumnSortOption.query === sortOptionActive.query;
    const titleColumnSortOrderOption = SORT_ORDER_OPTIONS.find((option) => (sortOrder || titleColumnSortOption.order) === option.value);
    const headerAttributes = this.getHeaderAttributes(taxonomy, actortypeId, actortypes);
    // category title column
    const columns = [
      {
        type: 'title',
        header: intl.formatMessage(appMessages.entities.taxonomies[taxonomy.get('id')].single),
        by: isGrouped && intl.formatMessage(
          appMessages.labels.groupedByTaxonomy,
          {
            tax: intl.formatMessage(
              appMessages.entities.taxonomies[taxonomy.getIn(['parent', 'id'])].single
            ),
          }
        ),
        width: (userOnly || headerAttributes.length === 0) ? 100 : TITLE_COL_RATIO * 100,
        active: titleColumnActive,
        sortIcon: titleColumnActive && titleColumnSortOrderOption
          ? titleColumnSortOrderOption.icon
          : 'sorting',
        onClick: () => {
          if (titleColumnActive) {
            const nextSortOrderOption = SORT_ORDER_OPTIONS.find((option) => titleColumnSortOrderOption.nextValue === option.value);
            onSort(titleColumnSortOption.query, nextSortOrderOption.value);
          } else {
            onSort(titleColumnSortOption.query, titleColumnSortOption.order);
          }
        },
      },
    ];
    // add columns for associated actors and actions
    return userOnly
      ? columns
      : columns.concat(headerAttributes.map((attribute) => {
        const columnSortOption = sortOptions.find((option) => option.query === attribute.query);
        const columnActive = columnSortOption.query === sortOptionActive.query;
        const columnSortOrderOption = SORT_ORDER_OPTIONS.find((option) => (sortOrder || columnSortOption.order) === option.value);
        return {
          header: attribute.label,
          via: attribute.via,
          active: columnActive,
          width: ((1 - TITLE_COL_RATIO) / headerAttributes.length) * 100,
          keys: attribute.keys,
          sortIcon: columnActive && columnSortOrderOption
            ? columnSortOrderOption.icon
            : 'sorting',
          onClick: () => {
            if (columnActive) {
              const nextSortOrderOption = SORT_ORDER_OPTIONS.find((option) => columnSortOrderOption.nextValue === option.value);
              onSort(columnSortOption.query, nextSortOrderOption.value);
            } else {
              onSort(columnSortOption.query, columnSortOption.order);
            }
          },
        };
      }));
  };

  getCategoryMaxCount = (categoryGroups, attribute) => {
    const isList = !!attribute.actortypeIds;
    const allCategories = categoryGroups.reduce((memo, group) => memo.concat(group.get('categories')),
      List(),);
    return allCategories.reduce(
      (countsMemo, cat) => {
        if (isList) {
          const maxAttribute = cat.get(attribute.totalByActortype)
            && cat.get(attribute.totalByActortype).reduce(
              (memo, attr) => Math.max(attr, memo),
              0,
            );
          return maxAttribute ? Math.max(maxAttribute, countsMemo) : countsMemo;
        }
        return cat.get(attribute.total) ? Math.max(cat.get(attribute.total), countsMemo) : countsMemo;
      },
      0,
    );
  };

  getCountAttributes = (taxonomy) => {
    // figure out if tagged directly or via child category
    const tagsActors = this.getTagsTax(taxonomy, 'tags_actors');
    const tagsActions = this.getTagsTax(taxonomy, 'tags_actions');

    const attributes = [];
    if (tagsActors) {
      attributes.push({
        total: 'actorsPublicCount',
        totalByActortype: 'actorsPublicCountByActortype',
        accepted: 'actorsAcceptedCount',
        acceptedByActortype: 'actorsAcceptedCountByActortype',
        entity: 'actors',
        actortypeIds:
          taxonomy.get('actortypeIds')
          && taxonomy.get('actortypeIds').toArray(),
      });
      if (!tagsActions) {
        attributes.push({
          total: 'actionsPublicCount',
          totalByActortype: 'actionsPublicCountByActortype',
          entity: 'actions',
          actortypeIds:
            taxonomy.get('actortypeIds')
            && taxonomy.get('actortypeIds').toArray(),
        });
      }
    }
    if (tagsActions) {
      attributes.push({
        total: 'actionsPublicCount',
        totalByActortype: 'actionsPublicCountByActortype',
        entity: 'actions',
      });
    }
    return attributes;
  }

  getListColumns = ({
    taxonomy,
    categoryGroups,
    userOnly,
  }) => {
    const countAttributes = this.getCountAttributes(taxonomy);
    // category title column
    const columns = [
      {
        type: 'title',
        width: (userOnly || !taxonomy || countAttributes.length === 0) ? 100 : TITLE_COL_RATIO * 100,
      },
    ];
    // add columns for associated actors and actions
    return (userOnly || !taxonomy)
      ? columns
      : columns.concat(
        countAttributes.map((attribute) => ({
          type: 'count',
          width: ((1 - TITLE_COL_RATIO) / countAttributes.length) * 100,
          maxCount: this.getCategoryMaxCount(categoryGroups, attribute),
          attribute,
        }))
      );
  };

  render() {
    const {
      taxonomy,
      categoryGroups,
      onPageLink,
      sortOptions,
      sortBy,
      sortOrder,
      onSort,
      userOnly,
      actortypes,
      actortypeId,
    } = this.props;

    const headerColumns = this.getListHeaderColumns({
      taxonomy,
      actortypeId,
      sortOptions,
      sortBy,
      sortOrder,
      onSort,
      userOnly,
      isGrouped: categoryGroups.size > 0 && !!taxonomy.get('parent'),
      actortypes,
    });

    const columns = this.getListColumns({
      taxonomy,
      categoryGroups,
      userOnly,
    });

    return (
      <Styled>
        <CategoryListHeader columns={headerColumns} />
        <CategoryListBody>
          {categoryGroups.valueSeq().toArray().map((group) => {
            if (group.get('categories')) {
              return (
                <span key={group.get('id')}>
                  {group.get('type') === 'categories' && group.get('categories').size > 0
                    && (
                      <GroupHeaderLink to={`/category/${group.get('id')}`}>
                        <GroupHeader>
                          {getCategoryTitle(group)}
                        </GroupHeader>
                      </GroupHeaderLink>
                    )
                  }
                  {group.get('categories').map((cat) => (
                    <CategoryListItem
                      key={cat.get('id')}
                      category={cat}
                      columns={columns}
                      onPageLink={onPageLink}
                      actortypes={actortypes}
                      actortypeId={actortypeId}
                    />
                  ))}
                </span>
              );
            }
            return null;
          })}
        </CategoryListBody>
      </Styled>
    );
  }
}

CategoryListItems.propTypes = {
  categoryGroups: PropTypes.object,
  taxonomy: PropTypes.object,
  actortypes: PropTypes.object,
  onPageLink: PropTypes.func,
  onSort: PropTypes.func,
  sortOptions: PropTypes.array,
  sortBy: PropTypes.string,
  sortOrder: PropTypes.string,
  userOnly: PropTypes.bool,
  actortypeId: PropTypes.string,
};

CategoryListItems.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default CategoryListItems;
