export const DEPENDENCIES = [
  'user_roles',
  'categories',
  'taxonomies',
  'actortypes',
  'actortype_taxonomies',
  'actor_categories',
  'actors',
  'measure_categories',
  'actor_measures',
  'actions',
];

export const TAXONOMY_DEFAULT = 1;

export const SORT_OPTIONS = [
  {
    query: 'title',
    field: 'referenceThenTitle',
    order: 'asc',
    type: 'string',
    default: 'true',
  },
  {
    query: 'actions',
    field: 'actions',
    type: 'number',
    order: 'desc',
  },
  {
    query: 'actors',
    field: 'actors',
    type: 'number',
    order: 'desc',
  },
];

export const SORT_CHANGE = 'impactoss/CategoryList/SORT_CHANGE';
