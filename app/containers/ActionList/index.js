/*
 *
 * ActionList
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { List, Map, fromJS } from 'immutable';

import { loadEntitiesIfNeeded, updatePath } from 'containers/App/actions';
import {
  selectReady,
  selectActionTaxonomies,
  selectActiveActortypes,
  selectIsUserManager,
  selectIsSignedIn,
} from 'containers/App/selectors';

import appMessages from 'containers/App/messages';
import { ROUTES } from 'themes/config';

import EntityList from 'containers/EntityList';
import { CONFIG, DEPENDENCIES } from './constants';
import { selectConnections, selectActions, selectConnectedTaxonomies } from './selectors';

import messages from './messages';

export class ActionList extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  UNSAFE_componentWillMount() {
    this.props.loadEntitiesIfNeeded();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
  }

  render() {
    const {
      dataReady,
      entities,
      taxonomies,
      actortypes,
      connections,
      connectedTaxonomies,
      location,
      isManager,
      isUserSignedIn,
    } = this.props;
    const { intl } = this.context;
    const headerOptions = {
      supTitle: intl.formatMessage(messages.pageTitle),
      icon: 'actions',
      actions: [],
    };
    if (isUserSignedIn) {
      headerOptions.actions.push({
        type: 'bookmarker',
        title: intl.formatMessage(messages.pageTitle),
      });
    }
    if (window.print) {
      headerOptions.actions.push({
        type: 'icon',
        onClick: () => window.print(),
        title: 'Print',
        icon: 'print',
      });
    }
    if (isManager) {
      headerOptions.actions.push({
        type: 'text',
        title: intl.formatMessage(appMessages.buttons.import),
        onClick: () => this.props.handleImport(),
      });
      headerOptions.actions.push({
        type: 'add',
        title: [
          intl.formatMessage(appMessages.buttons.add),
          {
            title: intl.formatMessage(appMessages.entities.actions.single),
            hiddenSmall: true,
          },
        ],
        onClick: () => this.props.handleNew(),
      });
    }
    return (
      <div>
        <Helmet
          title={intl.formatMessage(messages.pageTitle)}
          meta={[
            { name: 'description', content: intl.formatMessage(messages.metaDescription) },
          ]}
        />
        <EntityList
          entities={entities}
          taxonomies={taxonomies}
          actortypes={actortypes}
          connections={connections}
          connectedTaxonomies={connectedTaxonomies}
          config={CONFIG}
          header={headerOptions}
          dataReady={dataReady}
          entityTitle={{
            single: intl.formatMessage(appMessages.entities.actions.single),
            plural: intl.formatMessage(appMessages.entities.actions.plural),
          }}
          locationQuery={fromJS(location.query)}
        />
      </div>
    );
  }
}

ActionList.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  handleNew: PropTypes.func,
  handleImport: PropTypes.func,
  dataReady: PropTypes.bool,
  isManager: PropTypes.bool,
  location: PropTypes.object,
  entities: PropTypes.instanceOf(List).isRequired,
  taxonomies: PropTypes.instanceOf(Map),
  actortypes: PropTypes.instanceOf(Map),
  connections: PropTypes.instanceOf(Map),
  connectedTaxonomies: PropTypes.instanceOf(Map),
  isUserSignedIn: PropTypes.bool,
};

ActionList.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => ({
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  entities: selectActions(state, fromJS(props.location.query)),
  taxonomies: selectActionTaxonomies(state),
  connections: selectConnections(state),
  connectedTaxonomies: selectConnectedTaxonomies(state),
  actortypes: selectActiveActortypes(state),
  isManager: selectIsUserManager(state),
  isUserSignedIn: selectIsSignedIn(state),
});
function mapDispatchToProps(dispatch) {
  return {
    loadEntitiesIfNeeded: () => {
      DEPENDENCIES.forEach((path) => dispatch(loadEntitiesIfNeeded(path)));
    },
    handleNew: () => {
      dispatch(updatePath(`${ROUTES.ACTIONS}${ROUTES.NEW}`, { replace: true }));
    },
    handleImport: () => {
      dispatch(updatePath(`${ROUTES.ACTIONS}${ROUTES.IMPORT}`));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionList);
