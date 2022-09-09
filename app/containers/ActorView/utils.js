import {
  ACTIONTYPES_CONFIG,
  ACTIONTYPE_ACTOR_ACTION_ROLES,
} from 'themes/config';
import appMessages from 'containers/App/messages';

export const getActiontypeColumns = (
  viewEntity,
  typeid,
  viewSubject,
  intl,
  direct = true,
) => {
  let columns = [{
    id: 'main',
    type: 'main',
    sort: 'title',
    attributes: ['title'],
  }];
  if (
    ACTIONTYPES_CONFIG[parseInt(typeid, 10)]
    && ACTIONTYPES_CONFIG[parseInt(typeid, 10)].columns
  ) {
    columns = ACTIONTYPES_CONFIG[parseInt(typeid, 10)].columns.filter(
      (col) => {
        if (typeof col.showOnSingle !== 'undefined') {
          if (Array.isArray(col.showOnSingle)) {
            return col.showOnSingle.indexOf(viewSubject) > -1;
          }
          return col.showOnSingle;
        }
        return true;
      }
    );
  }
  // relationship type
  if (
    direct
    && viewSubject === 'actors'
    && ACTIONTYPE_ACTOR_ACTION_ROLES[typeid]
    && ACTIONTYPE_ACTOR_ACTION_ROLES[typeid].length > 0
  ) {
    columns = [
      ...columns,
      {
        id: 'relationshiptype_id',
        type: 'relationship',
        actionId: viewEntity.get('id'),
        title: intl.formatMessage(appMessages.attributes.relationshiptype_id),
      },
    ];
  }
  return columns;
};
