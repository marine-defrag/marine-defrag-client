import { createSelector } from 'reselect';
import { Map } from 'immutable';
import { DB } from 'themes/config';

import {
  selectReady,
  selectEntity,
  selectEntities,
  selectActorConnections,
  selectActionConnections,
  selectTaxonomiesSorted,
  selectTaxonomies,
  selectActortypeActors,
  selectActortypeActions,
  selectActorCategoriesByCategory,
  selectActionCategoriesByCategory,
  selectActorActionsByAction,
  selectActionCategoriesByAction,
  selectActorActionsByActor,
  selectActorCategoriesByActor,
  selectActortypes,
} from 'containers/App/selectors';

import {
  entitySetSingles,
  getEntityCategories,
} from 'utils/entities';
import { qe } from 'utils/quasi-equals';

import { sortEntities, sortCategories } from 'utils/sort';

import { DEPENDENCIES } from './constants';

export const selectCategory = createSelector(
  (state, id) => selectEntity(state, { path: DB.CATEGORIES, id }),
  (category) => category
);
export const selectTaxonomy = createSelector(
  selectCategory,
  selectTaxonomiesSorted,
  (category, taxonomies) => category
    && taxonomies
    && taxonomies.get(category.getIn(['attributes', 'taxonomy_id']).toString())
);

export const selectViewEntity = createSelector(
  selectCategory,
  (state) => selectEntities(state, DB.USERS),
  selectTaxonomiesSorted,
  (state) => selectEntities(state, DB.CATEGORIES),
  (entity, users, taxonomies, categories) => entity
    && entitySetSingles(
      entity, [
        {
          related: users,
          key: 'user',
          relatedKey: 'last_modified_user_id',
        },
        {
          related: users,
          key: 'manager',
          relatedKey: 'manager_id',
        },
        {
          related: taxonomies,
          key: 'taxonomy',
          relatedKey: 'taxonomy_id',
        },
        {
          related: categories,
          key: 'category',
          relatedKey: 'parent_id',
        },
      ],
    )
);

export const selectParentTaxonomy = createSelector(
  selectCategory,
  selectTaxonomies,
  (entity, taxonomies) => {
    if (entity && taxonomies) {
      const taxonomy = taxonomies.find(
        (tax) => qe(
          entity.getIn(['attributes', 'taxonomy_id']),
          tax.get('id'),
        )
      );
      return taxonomies.find(
        (tax) => qe(
          taxonomy.getIn(['attributes', 'parent_id']),
          tax.get('id')
        )
      );
    }
    return null;
  }
);
export const selectChildTaxonomies = createSelector(
  selectCategory,
  selectTaxonomiesSorted,
  (state) => selectEntities(state, DB.CATEGORIES),
  (entity, taxonomies, categories) => {
    if (entity && taxonomies) {
      const taxonomy = taxonomies.find(
        (tax) => qe(
          entity.getIn(['attributes', 'taxonomy_id']),
          tax.get('id')
        ),
      );
      return taxonomies.filter(
        (tax) => qe(
          tax.getIn(['attributes', 'parent_id']),
          taxonomy.get('id')
        )
      ).map(
        (tax) => tax.set(
          'categories',
          sortCategories(
            categories.filter(
              (cat) => qe(
                cat.getIn(['attributes', 'parent_id']),
                entity.get('id')
              ) && qe(
                cat.getIn(['attributes', 'taxonomy_id']),
                tax.get('id')
              )
            ),
            tax.get('id'),
          )
        )
      );
    }
    return null;
  }
);

const selectTagsActors = createSelector(
  selectTaxonomy,
  (taxonomy) => taxonomy && taxonomy.getIn(['attributes', 'tags_actors'])
);

const selectActorAssociations = createSelector(
  (state, id) => id,
  selectActorCategoriesByCategory,
  (catId, associations) => associations.get(
    parseInt(catId, 10)
  )
);
const selectActorsAssociated = createSelector(
  selectTagsActors,
  selectActorAssociations,
  selectActortypeActors,
  (tags, associations, actors) => tags
    ? associations && associations.reduce(
      (memo, id) => {
        const entity = actors.get(id.toString());
        return entity
          ? memo.set(id, entity)
          : memo;
      },
      Map(),
    )
    : null,
);

export const selectActors = createSelector(
  (state) => selectReady(state, { path: DEPENDENCIES }),
  selectActorsAssociated,
  selectActorConnections,
  selectActorActionsByActor,
  selectActorCategoriesByActor,
  (state) => selectEntities(state, DB.CATEGORIES),
  (state) => selectActortypes(state),
  (
    ready,
    actors,
    connections,
    actorActions,
    actorCategories,
    categories,
    actortypes,
  ) => {
    if (!ready) return Map();
    return actors
      && actortypes
      && actors.filter(
        (actor) => {
          const currentActortype = actortypes.find(
            (actortype) => qe(actortype.get('id'), actor && actor.getIn(['attributes', 'actortype_id']))
          );
          return currentActortype && currentActortype.getIn(['attributes', 'has_actions']);
        }
      ).map(
        (actor) => actor && actor.set(
          'categories',
          getEntityCategories(
            actor.get('id'),
            actorCategories,
            categories,
          )
        ).set(
          'actions',
          actorActions.get(parseInt(actor.get('id'), 10))
        )
      ).groupBy(
        (r) => r.getIn(['attributes', 'actortype_id'])
      );
  }
);

const selectChildrenTagActors = createSelector(
  selectChildTaxonomies,
  (taxonomies) => taxonomies
    && taxonomies.some(
      (tax) => tax.getIn(['attributes', 'tags_actors']),
    )
);

const selectChildActorsAssociated = createSelector(
  selectChildrenTagActors,
  selectChildTaxonomies,
  selectActortypeActors,
  selectActorCategoriesByCategory,
  (tag, childTaxonomies, actors, associations) => tag && childTaxonomies
    ? childTaxonomies.map(
      (tax) => tax.set(
        'categories',
        tax.get('categories').map(
          (cat) => {
            const actorIds = associations.get(
              parseInt(cat.get('id'), 10)
            );
            return cat.set(
              'actors',
              actorIds
                ? sortEntities(
                  actorIds.map(
                    (id) => actors.get(id.toString())
                  ),
                  'asc',
                  'reference',
                )
                : Map(),
            );
          }
        )
      )
    )
    : null
);

// all connected actors
export const selectChildActors = createSelector(
  selectChildActorsAssociated,
  selectActorConnections,
  selectActorActionsByActor,
  selectActorCategoriesByActor,
  (state) => selectEntities(state, DB.CATEGORIES),
  (
    actorsByTaxCat,
    connections,
    actorActions,
    actorCategories,
    categories,
  ) => actorsByTaxCat && actorsByTaxCat.map(
    (tax) => tax.set(
      'categories',
      tax.get('categories').map(
        (cat) => cat.set(
          'actors',
          cat.get('actors').map(
            (actor) => actor.set(
              'categories',
              getEntityCategories(
                actor.get('id'),
                actorCategories,
                categories,
              )
            ).set(
              'actions',
              actorActions.get(parseInt(actor.get('id'), 10))
            )
          )
        )
      )
    )
  ).groupBy(
    (r) => r.getIn(['attributes', 'actortype_id'])
  )
);

const selectTagsActions = createSelector(
  selectTaxonomy,
  (taxonomy) => taxonomy && taxonomy.getIn(['attributes', 'tags_actions'])
);

const selectActionAssociations = createSelector(
  (state, id) => id,
  selectActionCategoriesByCategory,
  (catId, associations) => associations.get(
    parseInt(catId, 10)
  )
);
const selectActionsAssociated = createSelector(
  selectTagsActions,
  selectActionAssociations,
  selectActortypeActions,
  (tags, associations, actions) => tags
    ? associations && associations.map(
      (id) => actions.get(id.toString())
    )
    : null
);

// all connected actions
export const selectActions = createSelector(
  (state) => selectReady(state, { path: DEPENDENCIES }),
  selectActionsAssociated,
  selectActionConnections,
  selectActorActionsByAction,
  selectActionCategoriesByAction,
  (state) => selectEntities(state, DB.CATEGORIES),
  (
    ready,
    actions,
    connections,
    actionActors,
    actionCategories,
    categories,
  ) => {
    if (!ready) return Map();
    return actions && actions.map(
      (action) => {
        const entityActors = actionActors.get(parseInt(action.get('id'), 10));
        const entityActorsByActortype = entityActors
          && connections.get('actors')
          && entityActors.filter(
            (actorId) => connections.getIn([
              'actors',
              actorId.toString(),
            ])
          ).groupBy(
            (actorId) => connections.getIn([
              'actors',
              actorId.toString(),
              'attributes',
              'actortype_id',
            ]).toString()
          );
        return action.set(
          'categories',
          getEntityCategories(
            action.get('id'),
            actionCategories,
            categories,
          )
        // currently needs both
        ).set(
          'actors',
          entityActors
        // nest connected actor ids byactortype
        ).set(
          'actorsByActortype',
          entityActorsByActortype,
        );
      }
    );
  }
);

const selectChildrenTagActions = createSelector(
  selectChildTaxonomies,
  (taxonomies) => taxonomies && taxonomies.some(
    (tax) => tax.getIn(['attributes', 'tags_actions'])
  )
);

const selectChildActionsAssociated = createSelector(
  selectChildrenTagActions,
  selectChildTaxonomies,
  selectActortypeActions,
  selectActionCategoriesByCategory,
  (tag, childTaxonomies, actions, associations) => tag
    ? childTaxonomies.map(
      (tax) => tax.set(
        'categories',
        tax.get('categories').map(
          (cat) => {
            const actionIds = associations.get(
              parseInt(cat.get('id'), 10)
            );
            return cat.set(
              'actions',
              actionIds
                ? sortEntities(
                  actionIds.map(
                    (id) => actions.get(id.toString())
                  ),
                  'asc',
                  'reference',
                )
                : Map(),
            );
          }
        )
      )
    )
    : null
);

// all connected actors
export const selectChildActions = createSelector(
  selectChildActionsAssociated,
  selectActionConnections,
  selectActorActionsByAction,
  selectActionCategoriesByAction,
  (state) => selectEntities(state, DB.CATEGORIES),
  (
    actionsByTaxCat,
    connections,
    actionActors,
    actionCategories,
    categories,
  ) => actionsByTaxCat && actionsByTaxCat.map(
    (tax) => tax.set(
      'categories',
      tax.get('categories').map(
        (cat) => cat.set(
          'actions',
          cat.get('actions').map(
            (action) => action.set(
              'categories',
              getEntityCategories(
                action.get('id'),
                actionCategories,
                categories,
              )
            ).set(
              'actors',
              actionActors.get(parseInt(action.get('id'), 10)),
            )
          )
        )
      )
    )
  )
);

export const selectTaxonomiesWithCategories = createSelector(
  selectTaxonomiesSorted,
  (state) => selectEntities(state, DB.CATEGORIES),
  (taxonomies, categories) => taxonomies.map((tax) => tax.set(
    'categories',
    categories.filter(
      (cat) => qe(
        cat.getIn(['attributes', 'taxonomy_id']),
        tax.get('id')
      )
    )
  ))
);
