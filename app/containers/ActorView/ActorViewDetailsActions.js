/*
 *
 * ActorViewDetailsActions
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, intlShape, injectIntl } from 'react-intl';
import styled from 'styled-components';
import { Box, Text } from 'grommet';
import { List, Map } from 'immutable';

import {
  getActionConnectionField,
} from 'utils/fields';
import qe from 'utils/quasi-equals';

import {
  ROUTES,
  ACTIONTYPES,
  ACTIONTYPES_CONFIG,
} from 'themes/config';
import PrintHide from 'components/styled/PrintHide';
import PrintOnly from 'components/styled/PrintOnly';
import FieldGroup from 'components/fields/FieldGroup';

import { setActiontype } from 'containers/App/actions';
import { usePrint } from 'containers/App/PrintContext';
import { selectActiontypes } from 'containers/App/selectors';

import appMessages from 'containers/App/messages';
import ActorActivitiesMap from './ActorActivitiesMap';
import TypeSelectBox from './TypeSelectBox';
import { getActiontypeColumns } from './utils';

import {
  selectActionsByType,
  selectActionsAsMemberByActortype,
} from './selectors';

const StyledPrint = styled.div`
  margin-left: 0;
  margin-bottom: 16px;
`;
export function ActorViewDetailsActions({
  viewEntity,
  taxonomies,
  actionConnections,
  onSetActiontype,
  viewActiontypeId,
  actiontypes,
  onEntityClick,
  canBeMember,
  actionsByActiontype,
  actionsAsMemberByActortype,
  intl,
  printArgs,
}) {
  const isPrint = usePrint();
  let activeActiontypeId;
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
          (memo2, actor) => memo2.concat(actor.get('actionsByType').keySeq()),
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
  activeActiontypeId = viewActiontypeId;
  if (actiontypeIdsOptions && !actiontypeIdsOptions.includes(viewActiontypeId.toString())) {
    activeActiontypeId = actiontypeIdsOptions.first();
  }
  return (
    <Box>
      {(!actiontypeIdsOptions || actiontypeIdsOptions.size === 0) && (
        <Box margin={{ vertical: 'small', horizontal: 'medium' }}>
          <Text>
            No activities for actor in database
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
        && actiontypes
        && activeActiontypeId
        && actiontypeIdsOptions
        && actiontypeIdsOptions.size > 0
        && actiontypeIdsOptions.filter(
          (typeId) => qe(typeId, activeActiontypeId) || (isPrint && printArgs.printAllTypes === 'all')
        ).map((typeId) => {
          const activeActionType = actiontypes.get(typeId.toString());
          const hasTarget = activeActionType && activeActionType.getIn(['attributes', 'has_target']);
          const hasMemberOption = activeActiontypeId && !qe(activeActiontypeId, ACTIONTYPES.NATL);
          // direct actions for selected subject and type
          const activeActiontypeActions = actionsByActiontype && actionsByActiontype.get(parseInt(typeId, 10));
          let actiontypesAsMember;
          if (canBeMember) {
            // figure out inactive action types
            actiontypesAsMember = actionsAsMemberByActortype.reduce(
              (memo, typeActors, id) => {
                const typeActorsForActiveType = typeActors.filter(
                  (actor) => actor.get('actionsByType')
                  && actor.getIn(['actionsByType', typeId])
                  && actor.getIn(['actionsByType', typeId]).size > 0
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
              <PrintOnly>
                <StyledPrint>
                  <Text size="small" style={{ textDecoration: 'underline' }}>
                    <FormattedMessage {...appMessages.entities[`actions_${typeId}`].plural} />
                  </Text>
                </StyledPrint>
              </PrintOnly>
              <Box>
                <ActorActivitiesMap
                  mapId={`ll-map-actor-actions-${typeId}`}
                  actor={viewEntity}
                  actions={activeActiontypeActions}
                  actionsAsMember={actiontypesAsMember}
                  hasMemberOption={hasMemberOption}
                  viewSubject="actors"
                  mapSubject="targets"
                  actiontypeHasTarget={hasTarget}
                  dataReady
                  onEntityClick={(id) => onEntityClick(id, ROUTES.ACTOR)}
                  actiontypeId={typeId}
                  actorCanBeMember={canBeMember}
                />
              </Box>
              {activeActiontypeActions && (
                <Box>
                  <FieldGroup
                    group={{
                      title: 'Individually',
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
                            'actors',
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
                    const prefix = 'As member of ';
                    return (
                      <Box key={actorId}>
                        <FieldGroup
                          group={{
                            title: `${prefix} ${typeLabel}: "${actor.getIn(['attributes', 'title'])}"`,
                            fields: [
                              getActionConnectionField({
                                actions: actor.getIn(['actionsByType', typeId]),
                                taxonomies,
                                onEntityClick,
                                connections: actionConnections,
                                typeid: typeId,
                                columns: getActiontypeColumns(
                                  viewEntity,
                                  typeId,
                                  'actors',
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
  actiontypes: PropTypes.instanceOf(Map),
  canBeMember: PropTypes.bool,
  actionsByActiontype: PropTypes.instanceOf(Map),
  actionsAsMemberByActortype: PropTypes.instanceOf(Map),
  printArgs: PropTypes.object,
  intl: intlShape,
};

const mapStateToProps = (state, { id }) => ({
  actionsByActiontype: selectActionsByType(state, id),
  actionsAsMemberByActortype: selectActionsAsMemberByActortype(state, id),
  actiontypes: selectActiontypes(state),
});

function mapDispatchToProps(dispatch) {
  return {
    onSetActiontype: (type) => {
      dispatch(setActiontype(type));
    },
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(ActorViewDetailsActions));
