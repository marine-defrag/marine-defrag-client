import { createSelector } from 'reselect';
import { Map } from 'immutable';
import { API } from 'themes/config';

import {
  selectEntities,
  selectSortByQuery,
  selectSortOrderQuery,
  selectActortypeTaxonomies,
  selectActortypeActors,
  selectActions,
  selectActiveActortypes,
  selectActorActionsGroupedByAction,
  selectActionCategoriesGroupedByAction,
  selectActorCategoriesGroupedByActor,
} from 'containers/App/selectors';

import { qe } from 'utils/quasi-equals';
import { getSortOption, sortEntities } from 'utils/sort';

import { TAXONOMY_DEFAULT, SORT_OPTIONS } from './constants';

export const selectTaxonomy = createSelector(
  (state, { id }) => id,
  selectActortypeTaxonomies,
  (taxonomyId, taxonomies) => {
    if (!taxonomies || taxonomies.size === 0) return null;
    const id = typeof taxonomyId !== 'undefined' ? taxonomyId : TAXONOMY_DEFAULT;
    const taxonomy = taxonomies.get(id);
    return taxonomy && taxonomy.set(
      'children',
      taxonomies.filter(
        (tax) => qe(
          id,
          tax.getIn(['attributes', 'parent_id'])
        )
      )
    ).set(
      'parent',
      taxonomies.find(
        (tax) => qe(
          taxonomy.getIn(['attributes', 'parent_id']),
          tax.get('id')
        )
      )
    );
  }
);

const selectActionsAssociated = createSelector(
  selectActions,
  selectActionCategoriesGroupedByAction,
  selectActorActionsGroupedByAction,
  (entities, actionCategories, actionActors) => entities
    && actionCategories
    && actionActors
    && entities.map(
      (entity, id) => entity.set(
        'category_ids',
        actionCategories.get(parseInt(id, 10)) || Map(),
      ).set(
        'actor_ids',
        actionActors.get(parseInt(id, 10)) || Map(),
      )
    )
);

const selectActorsAssociated = createSelector(
  selectActortypeActors,
  selectActorCategoriesGroupedByActor,
  (entities, actorCategories) => entities && actorCategories && entities.map(
    (entity, id) => entity.set(
      'category_ids',
      actorCategories.get(parseInt(id, 10)) || Map(),
    )
  )
);

const filterAssociatedEntities = (
  entities,
  key,
  associations,
) => entities.filter(
  (entity) => associations.find(
    (association, id) => entity.get(key).includes(parseInt(id, 10))
  )
);

// all entities that are tagged with a child category of current category
const filterChildConnections = (
  entities,
  categories,
  categoryId,
) => entities.filter(
  (entity) => categories.filter(
    (cat) => qe(
      categoryId,
      cat.getIn(['attributes', 'parent_id'])
    )
  ).some(
    (cat) => entity.get('category_ids').includes(parseInt(cat.get('id'), 10))
  )
);

const getCategoryCounts = (
  taxonomyCategories,
  taxonomy,
  actions,
  actors,
  categories,
  actortypes,
) => taxonomyCategories.map(
  (cat, categoryId) => {
    let category = cat;
    // actions
    const tagsActions = taxonomy.getIn(['attributes', 'tags_actions']);
    const childCatsTagActions = taxonomy.get('children')
      && taxonomy.get('children').some(
        (childTax) => childTax.getIn(['attributes', 'tags_actions'])
      );
    if (tagsActions || childCatsTagActions) {
      let associatedActions;
      // actors tagged by child categories
      if (childCatsTagActions) {
        associatedActions = filterChildConnections(
          actions,
          categories,
          categoryId
        );
      } else if (tagsActions) {
        associatedActions = actions.filter(
          (entity) => entity.get('category_ids').includes(parseInt(categoryId, 10))
        );
      }
      category = category.set('actionsCount', associatedActions.size);
      // get all public associated actions
      const associatedActionsPublic = associatedActions.filter(
        (action) => !action.getIn(['attributes', 'draft'])
      );
      category = category.set(
        'actionsPublicCount',
        associatedActionsPublic ? associatedActionsPublic.size : 0,
      );
      // for sorting
      category = category.set(
        'actions',
        associatedActionsPublic ? associatedActionsPublic.size : 0,
      );
    }

    // actors
    const tagsActors = taxonomy.getIn(['attributes', 'tags_actors']);
    const childCatsTagActors = taxonomy.get('children')
      && taxonomy.get('children').some(
        (childTax) => childTax.getIn(['attributes', 'tags_actors'])
      );
    if (tagsActors || childCatsTagActors) {
      let associatedActors;
      // actors tagged by child categories
      if (childCatsTagActors) {
        associatedActors = filterChildConnections(
          actors,
          categories,
          categoryId,
        );
        // directly tagged actors
      } else if (tagsActors) {
        associatedActors = actors.filter(
          (entity) => entity.get('category_ids').includes(parseInt(categoryId, 10))
        );
      }
      const associatedActorsPublic = associatedActors.filter(
        (actor) => !actor.getIn(['attributes', 'draft'])
      );
      // get all public accepted associated actors
      const publicAccepted = associatedActorsPublic.filter(
        (actor) => !!actor.getIn(['attributes', 'accepted'])
      );

      // all actortypes
      category = category.set('actorsCount', associatedActors.size);
      category = category.set(
        'actorsPublicCount',
        associatedActorsPublic ? associatedActorsPublic.size : 0
      );
      // const actortype = actortypes.find((actortype) => qe(actortype.get('id'), taxonomy.get('actortypeIds').first()));
      category = category.set(
        'actorsAcceptedCount',
        publicAccepted ? publicAccepted.size : 0
      );
      // by actortype
      category = category.set(
        'actorsCountByActortype',
        associatedActors.groupBy(
          (actor) => actor.getIn(['attributes', 'actortype_id'])
        ).map((group) => group.size),
      );
      category = category.set(
        'actorsPublicCountByActortype',
        associatedActorsPublic
          ? associatedActorsPublic.groupBy(
            (actor) => actor.getIn(['attributes', 'actortype_id'])
          ).map((group) => group.size)
          : 0,
      );
      category = category.set(
        'actorsAcceptedCountByActortype',
        publicAccepted
          ? publicAccepted.groupBy(
            (actor) => actor.getIn(['attributes', 'actortype_id'])
          ).map((group, key) => {
            const actortype = actortypes.find(
              (at) => qe(at.get('id'), key)
            );
            return (actortype && actortype.getIn(['attributes', 'has_response']))
              ? group.size
              : -1;
          })
          : 0
      );
      // for sorting
      category = category.set(
        'actors',
        associatedActorsPublic ? associatedActorsPublic.size : 0
      );

      // actions connected via actor
      if (!tagsActions && !childCatsTagActions) {
        const connectedActions = filterAssociatedEntities(
          actions,
          'actor_ids',
          associatedActorsPublic,
        );
        category = category.set(
          'actionsCount',
          connectedActions ? connectedActions.size : 0
        );
        const connectedActionsPublic = connectedActions.filter(
          (action) => !action.getIn(['attributes', 'draft'])
        );
        category = category.set(
          'actionsPublicCount',
          connectedActionsPublic ? connectedActionsPublic.size : 0
        );
        // for sorting
        category = category.set(
          'actions',
          connectedActionsPublic ? connectedActionsPublic.size : 0
        );
        // by actortype
        category = category.set(
          'actionsPublicCountByActortype',
          associatedActorsPublic
            ? associatedActorsPublic.groupBy(
              (actor) => actor.getIn(['attributes', 'actortype_id'])
            ).map((group) => {
              const connectedActionsForGroup = filterAssociatedEntities(
                actions,
                'actor_ids',
                group,
              );
              const connectedActionsPublicForGroup = connectedActionsForGroup.filter(
                (action) => !action.getIn(['attributes', 'draft'])
              );
              return connectedActionsPublicForGroup
                ? connectedActionsPublicForGroup.size
                : 0;
            })
            : 0,
        );
      }
    }
    return category;
  }
);

const selectCategoryCountGroups = createSelector(
  selectTaxonomy,
  selectActorsAssociated,
  selectActionsAssociated,
  (state) => selectEntities(state, API.CATEGORIES),
  selectActiveActortypes,
  (taxonomy, actors, actions, categories, actortypes) => {
    if (taxonomy && actors && actions && categories && actortypes) {
      const taxonomyCategories = taxonomy && categories && categories.filter(
        (cat) => qe(
          cat.getIn(['attributes', 'taxonomy_id']),
          taxonomy.get('id')
        )
      );
      if (taxonomyCategories) {
        if (!taxonomy.get('parent')) {
          const catCounts = getCategoryCounts(
            taxonomyCategories,
            taxonomy,
            actions,
            actors,
            categories,
            actortypes,
          );
          return catCounts
            ? Map().set(
              taxonomy.get('id'),
              taxonomy.set('categories', catCounts)
            )
            : Map();
        }
        if (taxonomy.get('parent')) {
          const taxParentCategories = categories.filter(
            (cat) => qe(
              cat.getIn(['attributes', 'taxonomy_id']),
              taxonomy.get('parent').get('id')
            )
          );
          return taxParentCategories.map(
            (parentCat) => {
              const taxChildCategories = taxonomyCategories.filter(
                (cat) => qe(
                  cat.getIn(['attributes', 'parent_id']),
                  parentCat.get('id')
                )
              );
              const catCounts = getCategoryCounts(
                taxChildCategories,
                taxonomy,
                actions,
                actors,
                categories,
                actortypes,
              );
              return parentCat.set('categories', catCounts);
            }
          );
        }
      }
      return Map();
    }
    return null;
  }
);

const mapCategoryGroups = (
  categoryGroups,
  sort,
  order,
  userOnly = false,
) => {
  const sortOption = getSortOption(SORT_OPTIONS, sort, 'query');
  const groups = categoryGroups && categoryGroups.map(
    (group) => {
      const filtered = group.get('categories').filter(
        (cat) => userOnly
          ? cat.getIn(['attributes', 'user_only'])
          : !cat.getIn(['attributes', 'user_only'])
      );
      return group.set(
        'actions',
        filtered.reduce(
          (sum, cat) => sum + cat.get('actionsPublicCount'),
          0,
        ),
      ).set(
        'actors',
        filtered.reduce(
          (sum, cat) => sum + cat.get('actorsPublicCount'),
          0,
        ),
      ).set(
        'categories',
        sortEntities(
          sortEntities(
            filtered,
            order || (sortOption ? sortOption.order : 'asc'),
            sortOption ? sortOption.field : 'title',
            sortOption ? sortOption.type : 'string',
          ),
          'asc',
          'draft',
          'bool',
        ),
      );
    }
  );

  return sortEntities(
    groups,
    order || (sortOption ? sortOption.order : 'asc'),
    sortOption ? sortOption.field : 'title',
    sortOption ? sortOption.type : 'string',
  );
};

export const selectCategoryGroups = createSelector(
  selectCategoryCountGroups,
  (state, { query }) => selectSortByQuery(state, query),
  (state, { query }) => selectSortOrderQuery(state, query),
  (categoryGroups, sort, order) => categoryGroups
    ? mapCategoryGroups(
      categoryGroups,
      sort,
      order
    )
    : Map()
);

export const selectUserOnlyCategoryGroups = createSelector(
  selectCategoryCountGroups,
  (state, { query }) => selectSortByQuery(state, query),
  (state, { query }) => selectSortOrderQuery(state, query),
  (categoryGroups, sort, order) => categoryGroups
    ? mapCategoryGroups(
      categoryGroups,
      sort,
      order,
      true, // userOnly
    )
    : Map()
);
