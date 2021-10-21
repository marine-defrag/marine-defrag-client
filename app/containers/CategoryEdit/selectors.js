import { createSelector } from 'reselect';
import { List } from 'immutable';

import {
  selectEntity,
  selectEntities,
  selectActionsCategorised,
  selectActorsCategorised,
  selectActortypeTaxonomiesSorted,
  selectTaxonomies,
} from 'containers/App/selectors';

import { USER_ROLES, DB } from 'themes/config';

import {
  prepareCategory,
  usersByRole,
  entitiesSetAssociatedCategory,
  prepareTaxonomiesMultiple,
} from 'utils/entities';
import { qe } from 'utils/quasi-equals';
export const selectDomain = createSelector(
  (state) => state.get('categoryEdit'),
  (substate) => substate
);

export const selectViewEntity = createSelector(
  (state, id) => selectEntity(state, { path: DB.CATEGORIES, id }),
  (state) => selectEntities(state, DB.USERS),
  (state) => selectActortypeTaxonomiesSorted(state),
  (entity, users, taxonomies) => prepareCategory(entity, users, taxonomies)
);

export const selectParentOptions = createSelector(
  (state, id) => selectEntity(state, { path: DB.CATEGORIES, id }),
  (state) => selectEntities(state, DB.CATEGORIES),
  selectTaxonomies,
  (entity, categories, taxonomies) => {
    if (entity && taxonomies && categories) {
      const taxonomy = taxonomies.find(
        (tax) => qe(
          entity.getIn(['attributes', 'taxonomy_id']),
          tax.get('id')
        )
      );
      const taxonomyParentId = taxonomy
        && taxonomy.getIn(['attributes', 'parent_id']);
      return taxonomyParentId
        ? categories.filter(
          (otherCategory) => {
            const otherTaxonomy = taxonomies.find(
              (tax) => qe(
                otherCategory.getIn(['attributes', 'taxonomy_id']),
                tax.get('id'),
              ),
            );
            return otherTaxonomy
              ? qe(taxonomyParentId, otherTaxonomy.get('id'))
              : null;
          }
        )
        : null;
    }
    return null;
  }
);

export const selectParentTaxonomy = createSelector(
  (state, id) => selectEntity(state, { path: DB.CATEGORIES, id }),
  selectTaxonomies,
  (entity, taxonomies) => {
    if (entity && taxonomies) {
      // the category taxonomy
      const taxonomy = taxonomies.find(
        (tax) => qe(
          entity.getIn(['attributes', 'taxonomy_id']),
          tax.get('id'),
        ),
      );
      // any parent taxonomies
      return taxonomies.find(
        (tax) => qe(
          taxonomy.getIn(['attributes', 'parent_id']),
          tax.get('id'),
        ),
      );
    }
    return null;
  }
);
const selectIsParentTaxonomy = createSelector(
  (state, id) => selectEntity(state, { path: DB.CATEGORIES, id }),
  selectTaxonomies,
  (entity, taxonomies) => {
    if (entity && taxonomies) {
      // the category taxonomy
      const taxonomy = taxonomies.find(
        (tax) => qe(
          entity.getIn(['attributes', 'taxonomy_id']),
          tax.get('id'),
        ),
      );
      // has any child taxonomies?
      return taxonomies.some(
        (tax) => qe(
          tax.getIn(['attributes', 'parent_id']),
          taxonomy.get('id'),
        ),
      );
    }
    return false;
  }
);


export const selectUsers = createSelector(
  (state) => selectEntities(state, DB.USERS),
  (state) => selectEntities(state, DB.USER_ROLES),
  (entities, associations) => usersByRole(
    entities,
    associations,
    USER_ROLES.MANAGER.value,
  )
);

export const selectActions = createSelector(
  (state, id) => id,
  selectActionsCategorised,
  selectIsParentTaxonomy,
  (id, entities, isParent) => {
    if (isParent) return null;
    return entitiesSetAssociatedCategory(
      entities,
      id,
    );
  }
);

export const selectActorsByActortype = createSelector(
  (state, id) => id,
  (state, id) => selectEntity(state, { path: DB.CATEGORIES, id }),
  (state) => selectEntities(state, DB.ACTORTYPE_TAXONOMIES),
  selectActorsCategorised,
  selectIsParentTaxonomy,
  (id, category, actortypeTaxonomies, entities, isParent) => {
    if (isParent || !category || !actortypeTaxonomies || !entities) {
      return null;
    }
    // actortype id for category
    const actortypeIds = actortypeTaxonomies.reduce(
      (memo, actortypet) => qe(
        actortypet.getIn(['attributes', 'taxonomy_id']),
        category.getIn(['attributes', 'taxonomy_id']),
      )
        ? memo.push(actortypet.getIn(['attributes', 'actortype_id']))
        : memo,
      List(),
    );
    const filtered = entities.filter(
      (r) => actortypeIds.find(
        (actortypeid) => qe(actortypeid, r.getIn(['attributes', 'actortype_id']))
      )
    );
    return entitiesSetAssociatedCategory(
      filtered,
      id,
    ).groupBy(
      (r) => r.getIn(['attributes', 'actortype_id']).toString()
    );
  }
);

export const selectConnectedTaxonomies = createSelector(
  (state) => selectActortypeTaxonomiesSorted(state),
  (state) => selectEntities(state, DB.CATEGORIES),
  (taxonomies, categories) => prepareTaxonomiesMultiple(
    taxonomies,
    categories,
    ['tags_actions', 'tags_actors']
  )
);
