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
  selectActiontypeTaxonomies,
  selectActiveActortypes,
  selectIsUserManager,
  selectIsSignedIn,
  selectActiontypes,
} from 'containers/App/selectors';

import appMessages from 'containers/App/messages';
import { ROUTES } from 'themes/config';

import EntityList from 'containers/EntityList';
import { CONFIG, DEPENDENCIES } from './constants';
import {
  selectConnections,
  selectActions,
  selectConnectedTaxonomies,
} from './selectors';

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
      params, // { id: the action type }
      // actiontypes,
    } = this.props;
    const { intl } = this.context;
    const typeId = params.id;
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
            title: intl.formatMessage(appMessages.actiontypesSingle[typeId]),
            hiddenSmall: true,
          },
        ],
        onClick: () => this.props.handleNew(typeId),
      });
    }
    // console.log('actiontypes', actiontypes && actiontypes.toJS())
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
            single: intl.formatMessage(appMessages.actiontypesSingle[typeId]),
            plural: intl.formatMessage(appMessages.actiontypes[typeId]),
          }}
          locationQuery={fromJS(location.query)}
        />
      </div>
    );
  }
}

ActionList.propTypes = {
  params: PropTypes.object,
  loadEntitiesIfNeeded: PropTypes.func,
  handleNew: PropTypes.func,
  handleImport: PropTypes.func,
  dataReady: PropTypes.bool,
  isManager: PropTypes.bool,
  location: PropTypes.object,
  entities: PropTypes.instanceOf(List).isRequired,
  taxonomies: PropTypes.instanceOf(Map),
  // actiontypes: PropTypes.instanceOf(Map),
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
  entities: selectActions(
    state,
    {
      type: props.params.id, // type
      locationQuery: fromJS(props.location.query),
    },
  ),
  actiontypes: selectActiontypes(state, props.params.id),
  taxonomies: selectActiontypeTaxonomies(state, { type: props.params.id }),
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
    handleNew: (typeId) => {
      dispatch(updatePath(`${ROUTES.ACTIONS}/${typeId}${ROUTES.NEW}`, { replace: true }));
    },
    handleImport: () => {
      dispatch(updatePath(`${ROUTES.ACTIONS}${ROUTES.IMPORT}`));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionList);
