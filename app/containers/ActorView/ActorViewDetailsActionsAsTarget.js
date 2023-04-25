/*
 *
 * ActorViewDetailsActions
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, intlShape, injectIntl } from 'react-intl';
import { Box, Text } from 'grommet';
import { List, Map } from 'immutable';
import styled from 'styled-components';

import {
  getActionConnectionField,
} from 'utils/fields';
import qe from 'utils/quasi-equals';

import {
  ROUTES,
  ACTIONTYPES,
  ACTIONTYPES_CONFIG,
} from 'themes/config';

import FieldGroup from 'components/fields/FieldGroup';

import { setActiontype } from 'containers/App/actions';
import { usePrint } from 'containers/App/PrintContext';

import appMessages from 'containers/App/messages';
import PrintHide from 'components/styled/PrintHide';
import PrintOnly from 'components/styled/PrintOnly';
import ActorActivitiesMap from './ActorActivitiesMap';
import TypeSelectBox from './TypeSelectBox';

import { getActiontypeColumns } from './utils';

import {
  selectActionsAsTargetByType,
  selectActionsAsTargetAsMemberByActortype,
} from './selectors';

const StyledPrint = styled.div`
  margin-left: 0;
  margin-bottom: 16px;
`;
const MapWrapper = styled.div`
  @media print {
    page-break-inside: avoid;
    break-inside: avoid;
  }
`;
export function ActorViewDetailsActions({
  viewEntity,
  taxonomies,
  actionConnections,
  onSetActiontype,
  viewActiontypeId,
  onEntityClick,
  actionsByActiontype,
  actionsAsMemberByActortype,
  intl,
  canBeMember,
  printArgs,
}) {
  const isPrint = usePrint();
  // figure out connected action types ##################################################
  // direct && indirect actiontypeids for selected subject
  let actiontypeIdsOptions = actionsByActiontype
    && actionsByActiontype.entrySeq().map(([id]) => id.toString());
  // any indirect actions present for selected subject and type?
  // indirect actions by type for selected subject
  let actiontypeIdsAsMember;
  if (canBeMember) {
    // indirect actiontypeids for selected subject
    actiontypeIdsAsMember = actionsAsMemberByActortype.reduce(
      (memo, typeActors) => memo.concat(
        typeActors.reduce(
          (memo2, actor) => memo2.concat(actor.get('targetingActionsByType').keySeq()),
          List(),
        )
      ),
      List(),
    ).toSet();
    // concat w/ active types for available tabs
    if (actiontypeIdsAsMember) {
      actiontypeIdsOptions = actiontypeIdsOptions
        ? actiontypeIdsOptions.concat(actiontypeIdsAsMember).toSet()
        : actiontypeIdsAsMember.toSet();
    }
  }

  // sort
  actiontypeIdsOptions = actiontypeIdsOptions
    && actiontypeIdsOptions.sort((a, b) => {
      const configA = ACTIONTYPES_CONFIG[a];
      const configB = ACTIONTYPES_CONFIG[b];
      return configA.order < configB.order ? -1 : 1;
    });
  // figure out active action type #################################################
  // selected actiontype (or first in list when not in list)
  let activeActiontypeId = viewActiontypeId;
  if (actiontypeIdsOptions && !actiontypeIdsOptions.includes(viewActiontypeId.toString())) {
    activeActiontypeId = actiontypeIdsOptions.first();
  }
  return (
    <Box>
      {(!actiontypeIdsOptions || actiontypeIdsOptions.size === 0) && (
        <Box margin={{ vertical: 'small', horizontal: 'medium' }}>
          <Text>
            Actor not target of any activities in database
          </Text>
        </Box>
      )}
      {actiontypeIdsOptions && actiontypeIdsOptions.size > 0 && (
        <PrintHide>
          <TypeSelectBox
            options={actiontypeIdsOptions}
            onSelectType={onSetActiontype}
            activeOptionId={activeActiontypeId}
            type="actions"
          />
        </PrintHide>
      )}
      {viewEntity
        && actiontypeIdsOptions
        && actiontypeIdsOptions.size > 0
        && actiontypeIdsOptions.filter(
          (typeId) => qe(typeId, activeActiontypeId) || (isPrint && printArgs.printAllTypes === 'all')
        ).map((typeId) => {
          const hasMemberOption = typeId && !qe(typeId, ACTIONTYPES.NATL);
          const activeActiontypeActions = actionsByActiontype && actionsByActiontype.get(parseInt(typeId, 10));
          let actiontypesAsMember;
          if (canBeMember) {
            // figure out inactive action types
            actiontypesAsMember = actionsAsMemberByActortype.reduce(
              (memo, typeActors, id) => {
                const typeActorsForActiveType = typeActors.filter(
                  (actor) => actor.get('targetingActionsByType')
                    && actor.getIn(['targetingActionsByType', typeId])
                    && actor.getIn(['targetingActionsByType', typeId]).size > 0
                );
                if (typeActorsForActiveType && typeActorsForActiveType.size > 0) {
                  return memo.merge(Map().set(id, typeActorsForActiveType));
                }
                return memo;
              },
              Map(),
            );
          }
          return (
            <div key={typeId}>
              <MapWrapper>
                <PrintOnly>
                  <StyledPrint>
                    <Text size="small" style={{ textDecoration: 'underline' }}>
                      <FormattedMessage {...appMessages.entities[`actions_${typeId}`].plural} />
                    </Text>
                  </StyledPrint>
                </PrintOnly>
                <ActorActivitiesMap
                  mapId={`ll-map-target-actions-${typeId}`}
                  actor={viewEntity}
                  actions={activeActiontypeActions}
                  actionsAsMember={actiontypesAsMember}
                  hasMemberOption={hasMemberOption}
                  viewSubject="targets"
                  mapSubject="actors"
                  dataReady
                  onEntityClick={(id) => onEntityClick(id, ROUTES.ACTOR)}
                  actiontypeId={typeId}
                  actorCanBeMember={canBeMember}
                />
              </MapWrapper>
              {activeActiontypeActions && (
                <Box>
                  <FieldGroup
                    group={{
                      title: 'Targeted directly',
                      fields: [
                        getActionConnectionField({
                          actions: activeActiontypeActions,
                          taxonomies,
                          onEntityClick,
                          connections: actionConnections,
                          typeid: typeId,
                          columns: getActiontypeColumns(
                            viewEntity,
                            typeId,
                            'targets',
                            intl,
                          ),
                        }),
                      ],
                    }}
                  />
                </Box>
              )}
              {canBeMember && actiontypesAsMember.entrySeq().map(([actortypeId, typeActors]) => (
                <Box key={actortypeId}>
                  {typeActors.entrySeq().map(([actorId, actor]) => {
                    const typeLabel = intl.formatMessage(appMessages.entities[`actors_${actortypeId}`].singleShort);
                    const prefix = 'Targeted as member of ';
                    return (
                      <Box key={actorId}>
                        <FieldGroup
                          group={{
                            title: `${prefix} ${typeLabel}: "${actor.getIn(['attributes', 'title'])}"`,
                            fields: [
                              getActionConnectionField({
                                actions: actor.getIn(['targetingActionsByType', typeId]),
                                taxonomies,
                                onEntityClick,
                                connections: actionConnections,
                                typeid: typeId,
                                columns: getActiontypeColumns(
                                  viewEntity,
                                  typeId,
                                  'targets',
                                  intl,
                                  false, // direct
                                ),
                              }),
                            ],
                          }}
                        />
                      </Box>
                    );
                  })}
                </Box>
              ))}
            </div>
          );
        })
      }
    </Box>
  );
}

ActorViewDetailsActions.propTypes = {
  // id: PropTypes.string,
  viewEntity: PropTypes.instanceOf(Map),
  taxonomies: PropTypes.instanceOf(Map),
  actionConnections: PropTypes.instanceOf(Map),
  onSetActiontype: PropTypes.func,
  onEntityClick: PropTypes.func,
  viewActiontypeId: PropTypes.string,
  canBeMember: PropTypes.bool,
  actionsByActiontype: PropTypes.instanceOf(Map),
  actionsAsMemberByActortype: PropTypes.instanceOf(Map),
  intl: intlShape,
  printArgs: PropTypes.object,
};

const mapStateToProps = (state, { id }) => ({
  actionsByActiontype: selectActionsAsTargetByType(state, id),
  actionsAsMemberByActortype: selectActionsAsTargetAsMemberByActortype(state, id),
});

function mapDispatchToProps(dispatch) {
  return {
    onSetActiontype: (type) => {
      dispatch(setActiontype(type));
    },
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(ActorViewDetailsActions));
