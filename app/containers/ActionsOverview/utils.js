
import { Globe, Calendar, List } from 'grommet-icons';
import { CONFIG } from 'containers/ActionList/constants';

export function getIconConfig(typeId) {
  return [{
    type: 'list',
    hasView: CONFIG.views && !!CONFIG.views.list,
    icon: List,
    path: '',
  },
  {
    type: 'map',
    hasView: typeId
      && CONFIG.views
      && CONFIG.views.map
      && CONFIG.views.map.types
      && CONFIG.views.map.types.indexOf(typeId) > -1,
    icon: Globe,
    path: '',
  },
  {
    type: 'timeline',
    hasView: typeId
      && CONFIG.views
      && CONFIG.views.timeline
      && CONFIG.views.timeline.types
      && CONFIG.views.timeline.types.indexOf(typeId) > -1,
    icon: Calendar,
    path: '',
  },
  ];
}
