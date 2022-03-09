import React from 'react';
import PropTypes from 'prop-types';
import { Map, List } from 'immutable';

import EntityListItem from 'components/EntityListItem';

export class EntityListItemWrapper extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const {
      isManager,
      onEntitySelect,
      entityIcon,
      entityIdsSelected,
      taxonomies,
      connections,
      config,
      onEntityClick,
      entities,
      entityPath,
      inSingleView,
      url,
      showCode,
      showValueForAction,
    } = this.props;
    return (
      <div>
        {entities.map((entity, key) => (
          <EntityListItem
            key={key}
            entity={entity}
            error={this.props.errors ? this.props.errors.get(entity.get('id')) : null}
            onDismissError={this.props.onDismissError}
            isManager={isManager}
            inSingleView={inSingleView}
            isSelected={isManager && entityIdsSelected.includes(entity.get('id'))}
            onSelect={(checked) => onEntitySelect(entity.get('id'), checked)}
            entityIcon={entityIcon}
            taxonomies={taxonomies}
            connections={connections}
            config={config}
            onEntityClick={onEntityClick}
            entityPath={entityPath}
            url={url}
            showCode={showCode}
            showValueForAction={showValueForAction}
          />
        ))}
      </div>
    );
  }
}

EntityListItemWrapper.propTypes = {
  entities: PropTypes.instanceOf(List).isRequired,
  entityIdsSelected: PropTypes.instanceOf(List),
  errors: PropTypes.instanceOf(Map),
  showCode: PropTypes.bool,
  taxonomies: PropTypes.instanceOf(Map),
  connections: PropTypes.instanceOf(Map),
  showValueForAction: PropTypes.instanceOf(Map),
  config: PropTypes.object,
  isManager: PropTypes.bool,
  onEntityClick: PropTypes.func,
  onEntitySelect: PropTypes.func,
  onDismissError: PropTypes.func,
  entityPath: PropTypes.string,
  url: PropTypes.string,
  entityIcon: PropTypes.func,
  inSingleView: PropTypes.bool,
};

export default EntityListItemWrapper;
