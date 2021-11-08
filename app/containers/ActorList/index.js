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

import { getAcceptanceStatus } from 'utils/entities';

import { loadEntitiesIfNeeded, updatePath } from 'containers/App/actions';
import {
  selectReady,
  selectActortypeTaxonomies,
  selectActiveActortypes,
  selectIsUserManager,
  selectIsSignedIn,
} from 'containers/App/selectors';

import appMessages from 'containers/App/messages';
import { ROUTES } from 'themes/config';

import EntityList from 'containers/EntityList';

import { CONFIG, DEPENDENCIES } from './constants';
import { selectActors, selectConnectedTaxonomies, selectConnections } from './selectors';
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
    // console.log('test props')
    // console.log('test location', isEqual(this.props.location, nextProps.location));
    // console.log('test dataReady', isEqual(this.props.dataReady, nextProps.dataReady));
    // console.log('test entities', isEqual(this.props.entities, nextProps.entities));
    // console.log('test entities', this.props.entities === nextProps.entities);
    // console.log('test taxonomies', isEqual(this.props.taxonomies, nextProps.taxonomies));
    // console.log('test taxonomies', this.props.taxonomies === nextProps.taxonomies);
    // console.log('test connections', isEqual(this.props.connections, nextProps.connections));
    // console.log('test connections', this.props.connections === nextProps.connections);
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   // console.log('EntityListSidebar.shouldComponentUpdate')
  //   // console.log('props isEqual', isEqual(this.props, nextProps))
  //   return !isEqual(this.props.location, nextProps.location)
  //     || !isEqual(this.props.dataReady, nextProps.dataReady)
  //     || !isEqual(this.props.taxonomies, nextProps.taxonomies)
  //     || !isEqual(this.props.connections, nextProps.connections)
  //     || !isEqual(this.props.entities, nextProps.entities)
  //     || !isEqual(this.state, nextState);
  // }
  render() {
    const { intl } = this.context;
    const {
      dataReady,
      actortypes,
      isManager,
      isUserSignedIn,
      params, // { id: the action type }
    } = this.props;
    const typeId = params.id;
    // console.log('RecList:render')
    const currentActortype = actortypes && actortypes.size === 1 && actortypes.first();
    const type = currentActortype
      ? `actors_${currentActortype.get('id')}`
      : 'actors';
    const headerOptions = {
      supTitle: intl.formatMessage(messages.pageTitle),
      icon: type,
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
            title: intl.formatMessage(appMessages.actortypesSingle[typeId]),
            hiddenSmall: true,
          },
        ],
        onClick: () => this.props.handleNew(),
      });
    }
    // if (dataReady) {
    //   console.log(this.props.entities.toJS())
    //   console.log(this.props.connections.toJS())
    //   console.log(this.props.taxonomies.toJS())
    //   console.log(this.props.actortypes.toJS())
    //   console.log(this.props.connectedTaxonomies.toJS())
    // }
    return (
      <div>
        <Helmet
          title={`${intl.formatMessage(messages.pageTitle)}`}
          meta={[
            { name: 'description', content: intl.formatMessage(messages.metaDescription) },
          ]}
        />
        <EntityList
          entities={this.props.entities}
          taxonomies={this.props.taxonomies}
          connections={this.props.connections}
          actortypes={actortypes}
          connectedTaxonomies={this.props.connectedTaxonomies}
          config={CONFIG}
          header={headerOptions}
          dataReady={dataReady}
          entityTitle={{
            single: intl.formatMessage(appMessages.actortypesSingle[typeId]),
            plural: intl.formatMessage(appMessages.actortypes[typeId]),
          }}
          entityIcon={(entity) => {
            const status = getAcceptanceStatus(entity);
            return status ? status.icon : null;
          }}
          locationQuery={fromJS(this.props.location.query)}
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
  actortypes: PropTypes.instanceOf(Map),
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
      locationQuery: fromJS(props.location.query),
      type: props.params.id,
    },
  ),
  taxonomies: selectActortypeTaxonomies(state, { type: props.params.id }),
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
      dispatch(updatePath(`${ROUTES.ACTORS}${ROUTES.NEW}`, { replace: true }));
    },
    handleImport: () => {
      dispatch(updatePath(`${ROUTES.ACTORS}${ROUTES.IMPORT}`));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ActorList);
