/*
 *
 * ActorList
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { Map, List, fromJS } from 'immutable';

import { loadEntitiesIfNeeded, updatePath } from 'containers/App/actions';
import {
  selectReady,
  selectActortypeTaxonomies,
  selectIsUserManager,
  selectIsSignedIn,
} from 'containers/App/selectors';

import appMessages from 'containers/App/messages';
import { ROUTES } from 'themes/config';

import EntityList from 'containers/EntityList';

import { CONFIG, DEPENDENCIES } from './constants';
import {
  selectActors,
  selectConnectedTaxonomies,
  selectConnections,
} from './selectors';

import messages from './messages';

export class ActorList extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
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
    const { intl } = this.context;
    const {
      dataReady,
      entities,
      taxonomies,
      connections,
      connectedTaxonomies,
      location,
      isManager,
      isUserSignedIn,
      params, // { id: the action type }
    } = this.props;
    const typeId = params.id;
    const type = `actors_${typeId}`;
    const headerOptions = {
      supTitle: intl.formatMessage(messages.pageTitle),
      actions: [],
    };
    if (isUserSignedIn) {
      headerOptions.actions.push({
        type: 'bookmarker',
        title: intl.formatMessage(appMessages.entities[type].plural),
        entityType: type,
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
            title: intl.formatMessage(appMessages.entities[type].single),
            hiddenSmall: true,
          },
        ],
        onClick: () => this.props.handleNew(typeId),
      });
    }
    return (
      <div>
        <Helmet
          title={`${intl.formatMessage(messages.pageTitle)}`}
          meta={[
            { name: 'description', content: intl.formatMessage(messages.metaDescription) },
          ]}
        />
        <EntityList
          entities={entities}
          taxonomies={taxonomies}
          connections={connections}
          connectedTaxonomies={connectedTaxonomies}
          config={CONFIG}
          header={headerOptions}
          dataReady={dataReady}
          entityTitle={{
            single: intl.formatMessage(appMessages.entities[type].single),
            plural: intl.formatMessage(appMessages.entities[type].plural),
          }}
          locationQuery={fromJS(location.query)}
        />
      </div>
    );
  }
}

ActorList.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  handleNew: PropTypes.func,
  handleImport: PropTypes.func,
  dataReady: PropTypes.bool,
  isManager: PropTypes.bool,
  entities: PropTypes.instanceOf(List).isRequired,
  taxonomies: PropTypes.instanceOf(Map),
  connectedTaxonomies: PropTypes.instanceOf(Map),
  connections: PropTypes.instanceOf(Map),
  location: PropTypes.object,
  isUserSignedIn: PropTypes.bool,
  params: PropTypes.object,
};

ActorList.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => ({
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  entities: selectActors(
    state,
    {
      type: props.params.id, // type
      locationQuery: fromJS(props.location.query),
    },
  ),
  taxonomies: selectActortypeTaxonomies(state, { type: props.params.id }),
  connections: selectConnections(state),
  connectedTaxonomies: selectConnectedTaxonomies(state),
  isManager: selectIsUserManager(state),
  isUserSignedIn: selectIsSignedIn(state),
});

function mapDispatchToProps(dispatch) {
  return {
    loadEntitiesIfNeeded: () => {
      DEPENDENCIES.forEach((path) => dispatch(loadEntitiesIfNeeded(path)));
    },
    handleNew: (typeId) => {
      dispatch(updatePath(`${ROUTES.ACTORS}/${typeId}${ROUTES.NEW}`, { replace: true }));
    },
    handleImport: () => {
      dispatch(updatePath(`${ROUTES.ACTORS}${ROUTES.IMPORT}`));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ActorList);
