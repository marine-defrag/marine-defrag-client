/*
 *
 * ActorList
 *
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { Map, List, fromJS } from 'immutable';
import { injectIntl, intlShape } from 'react-intl';

import {
  loadEntitiesIfNeeded,
  updatePath,
  printView,
} from 'containers/App/actions';
import {
  selectReady,
  selectActortypeTaxonomiesWithCats,
  selectIsUserManager,
  selectIsUserAnalyst,
  selectActortypes,
  selectActiontypesForActortype,
  selectActiontypesForTargettype,
  selectMembertypesForActortype,
  selectAssociationtypesForActortype,
  selectActortypeActors,
  selectViewQuery,
  selectHasFFOverlay,
} from 'containers/App/selectors';

import { checkActionAttribute } from 'utils/entities';
import { keydownHandlerPrint } from 'utils/print';
import qe from 'utils/quasi-equals';
import appMessages from 'containers/App/messages';
import { ROUTES, ACTORTYPES, FF_ONLY_ACTORTYPES } from 'themes/config';

import EntityList from 'containers/EntityList';

import { PRINT_TYPES } from 'containers/App/constants';

import { CONFIG, DEPENDENCIES } from './constants';
import {
  selectListActors,
  selectConnectedTaxonomies,
  selectConnections,
} from './selectors';

import messages from './messages';

const prepareTypeOptions = (
  types,
  activeId,
  isUserManager,
  intl,
) => types.toList().toJS().filter(
  (type) => qe(FF_ONLY_ACTORTYPES, type.id)
    ? isUserManager
    : true
).map(
  (type) => ({
    value: type.id,
    label: intl.formatMessage(appMessages.actortypes[type.id]),
    active: activeId === type.id,
  })
);

export function ActorList({
  dataReady,
  entities,
  allEntities,
  taxonomies,
  connections,
  connectedTaxonomies,
  location,
  isManager,
  isAnalyst,
  params, // { id: the action type }
  actiontypes,
  actortypes,
  actiontypesForTarget,
  membertypes,
  associationtypes,
  onSelectType,
  intl,
  onLoadEntitiesIfNeeded,
  handleNew,
  handleImport,
  onSetPrintView,
  view,
  hasFFOverlay,
}) {
  useEffect(() => {
    if (!dataReady) onLoadEntitiesIfNeeded();
  }, [dataReady]);


  const typeId = params.id;
  const type = `actors_${typeId}`;

  const showMap = typeId
    && CONFIG.views
    && CONFIG.views.map
    && CONFIG.views.map.types
    && CONFIG.views.map.types.indexOf(typeId) > -1
    && view === 'map';
  const mySetPrintView = () => onSetPrintView({
    printType: PRINT_TYPES.LIST,
    printContentOptions: showMap ? null : { pages: true },
    printMapOptions: showMap && !hasFFOverlay ? { markers: true } : null,
    printMapMarkers: true,
    fixed: showMap,
    printOrientation: showMap ? 'landscape' : 'portrait',
    printSize: 'A4',
  });
  const keydownHandler = (e) => {
    keydownHandlerPrint(e, mySetPrintView);
  };
  useEffect(() => {
    document.addEventListener('keydown', keydownHandler);
    return () => {
      document.removeEventListener('keydown', keydownHandler);
    };
  }, []);

  const headerOptions = {
    supTitle: intl.formatMessage(messages.pageTitle),
    actions: [],
    info: appMessages.actortypes_info[typeId]
      && (qe(typeId, ACTORTYPES.REG) || qe(typeId, ACTORTYPES.ORG))
      ? {
        title: 'Please note',
        content: intl.formatMessage(appMessages.actortypes_info[typeId]),
      }
      : null,
  };
  if (isAnalyst) {
    headerOptions.actions.push({
      type: 'bookmarker',
      title: intl.formatMessage(appMessages.entities[type].plural),
      entityType: type,
    });
  }
  if (window.print) {
    headerOptions.actions.push({
      type: 'icon',
      // onClick: () => window.print(),
      onClick: mySetPrintView,
      title: 'Print',
      icon: 'print',
    });
  }
  if (isManager) {
    headerOptions.actions.push({
      type: 'text',
      title: intl.formatMessage(appMessages.buttons.import),
      onClick: () => handleImport(),
      isManager,
    });
    headerOptions.actions.push({
      type: 'text',
      title: 'Create new',
      onClick: () => handleNew(typeId),
      isManager,
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
        allEntityCount={allEntities && allEntities.size}
        taxonomies={taxonomies}
        connections={connections}
        connectedTaxonomies={connectedTaxonomies}
        config={CONFIG}
        headerOptions={headerOptions}
        dataReady={dataReady}
        entityTitle={{
          single: intl.formatMessage(appMessages.entities[type].single),
          plural: intl.formatMessage(appMessages.entities[type].plural),
        }}
        locationQuery={fromJS(location.query)}
        actortypes={actortypes}
        actiontypes={actiontypes}
        actiontypesForTarget={actiontypesForTarget}
        membertypes={membertypes}
        associationtypes={associationtypes}
        typeOptions={prepareTypeOptions(
          actortypes,
          typeId,
          isManager,
          intl,
        )}
        onSelectType={onSelectType}
        typeId={typeId}
        showCode={checkActionAttribute(typeId, 'code', isManager)}
      />
    </div>
  );
}

ActorList.propTypes = {
  dataReady: PropTypes.bool,
  isManager: PropTypes.bool,
  isAnalyst: PropTypes.bool,
  location: PropTypes.object,
  params: PropTypes.object,
  view: PropTypes.string,
  entities: PropTypes.instanceOf(List).isRequired,
  allEntities: PropTypes.instanceOf(Map),
  taxonomies: PropTypes.instanceOf(Map),
  connectedTaxonomies: PropTypes.instanceOf(Map),
  connections: PropTypes.instanceOf(Map),
  actortypes: PropTypes.instanceOf(Map),
  actiontypes: PropTypes.instanceOf(Map),
  actiontypesForTarget: PropTypes.instanceOf(Map),
  membertypes: PropTypes.instanceOf(Map),
  associationtypes: PropTypes.instanceOf(Map),
  onLoadEntitiesIfNeeded: PropTypes.func,
  handleNew: PropTypes.func,
  handleImport: PropTypes.func,
  onSetPrintView: PropTypes.func,
  onSelectType: PropTypes.func,
  hasFFOverlay: PropTypes.bool,
  intl: intlShape.isRequired,
};

const mapStateToProps = (state, props) => ({
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  entities: selectListActors(state, { type: props.params.id }),
  taxonomies: selectActortypeTaxonomiesWithCats(state, { type: props.params.id }),
  connections: selectConnections(state),
  connectedTaxonomies: selectConnectedTaxonomies(state),
  isManager: selectIsUserManager(state),
  isAnalyst: selectIsUserAnalyst(state),
  actiontypes: selectActiontypesForActortype(state, { type: props.params.id }),
  actiontypesForTarget: selectActiontypesForTargettype(state, { type: props.params.id }),
  membertypes: selectMembertypesForActortype(state, { type: props.params.id }),
  associationtypes: selectAssociationtypesForActortype(state, { type: props.params.id }),
  actortypes: selectActortypes(state),
  allEntities: selectActortypeActors(state, { type: props.params.id }),
  view: selectViewQuery(state),
  hasFFOverlay: selectHasFFOverlay(state),
});

function mapDispatchToProps(dispatch) {
  return {
    onLoadEntitiesIfNeeded: () => {
      DEPENDENCIES.forEach((path) => dispatch(loadEntitiesIfNeeded(path)));
    },
    handleNew: (typeId) => {
      dispatch(updatePath(`${ROUTES.ACTORS}/${typeId}${ROUTES.NEW}`, { replace: true }));
    },
    handleImport: () => {
      dispatch(updatePath(`${ROUTES.ACTORS}${ROUTES.IMPORT}`));
    },
    onSelectType: (typeId) => {
      dispatch(updatePath(
        typeId && typeId !== ''
          ? `${ROUTES.ACTORS}/${typeId}`
          : ROUTES.ACTORS
      ));
    },
    onSetPrintView: (config) => {
      dispatch(printView(config));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(ActorList));
