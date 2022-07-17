import qe from 'utils/quasi-equals';
import {
  ACTORTYPES_CONFIG,
  ACTORTYPES,
  ACTIONTYPE_ACTOR_ACTION_ROLES,
} from 'themes/config';

import appMessages from 'containers/App/messages';

export const getActortypeColumns = (
  actortypeId,
  isIndicator,
  isActive,
  entity,
  intl,
) => {
  let columns = [{
    id: 'main',
    type: 'main',
    sort: 'title',
    attributes: ['code', 'title'],
    isIndicator,
  }];
  if (qe(actortypeId, ACTORTYPES.COUNTRY)) {
    columns = [
      ...columns,
      {
        id: 'classes',
        type: 'associations',
        actortype_id: ACTORTYPES.CLASS,
        title: 'Classes',
        isIndicator,
      },
    ];
    if (isIndicator) {
      columns = [
        ...columns,
        {
          id: 'regions',
          type: 'associations',
          actortype_id: ACTORTYPES.REG,
          title: 'Regions',
          isIndicator,
        },
      ];
    }
  }
  if (isIndicator) {
    columns = [
      ...columns,
      {
        id: 'indicator',
        type: 'indicator',
        indicatorId: entity.get('id'),
        title: entity.getIn(['attributes', 'title']),
        unit: entity.getIn(['attributes', 'comment']),
        align: 'end',
        primary: true,
      },
    ];
  }
  if (
    ACTORTYPES_CONFIG[parseInt(actortypeId, 10)]
    && ACTORTYPES_CONFIG[parseInt(actortypeId, 10)].columns
  ) {
    columns = [
      ...columns,
      ...ACTORTYPES_CONFIG[parseInt(actortypeId, 10)].columns,
    ];
  }

  // relationship type
  if (
    isActive
    && ACTIONTYPE_ACTOR_ACTION_ROLES[entity.getIn(['attributes', 'measuretype_id'])]
    && ACTIONTYPE_ACTOR_ACTION_ROLES[entity.getIn(['attributes', 'measuretype_id'])].length > 0
  ) {
    columns = [
      ...columns,
      {
        id: 'relationshiptype_id',
        type: 'relationship',
        actionId: entity.get('id'),
        title: intl.formatMessage(appMessages.attributes.relationshiptype_id),
      },
    ];
  }
  return columns;
};
