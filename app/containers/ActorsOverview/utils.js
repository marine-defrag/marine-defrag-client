
import { Globe, List } from 'grommet-icons';
import { CONFIG } from 'containers/ActorList/constants';

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
  }];
}
