/*
 *
 * ActorViewDetailsActions
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
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

import FieldGroup from 'components/fields/FieldGroup';

import { setActiontype } from 'containers/App/actions';
import { selectActiontypes } from 'containers/App/selectors';

import appMessages from 'containers/App/messages';
import ActorActivitiesMap from './ActorActivitiesMap';
import TypeSelectBox from './TypeSelectBox';
import { getActiontypeColumns } from './utils';

import {
  selectActionsByType,
  selectActionsAsMemberByActortype,
} from './selectors';

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
}) {
  let activeActiontypeId;
  let actiontypesAsMember;
  let actiontypeIdsAsMember;
  // direct && indirect actiontypeids for selected subject
  let actiontypeIdsOptions = actionsByActiontype
    && actionsByActiontype.entrySeq().map(([id]) => id.toString());
  // any indirect actions present for selected subject and type?
  // indirect actions by type for selected subject
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
  // figure out actions for active action type #################################################

  // direct actions for selected subject and type
  const activeActiontypeActions = actionsByActiontype && actionsByActiontype.get(parseInt(activeActiontypeId, 10));
  if (canBeMember) {
    // figure out inactive action types
    actiontypesAsMember = actionsAsMemberByActortype.reduce(
      (memo, typeActors, id) => {
        const typeActorsForActiveType = typeActors.filter(
          (actor) => actor.get('actionsByType')
          && actor.getIn(['actionsByType', activeActiontypeId])
          && actor.getIn(['actionsByType', activeActiontypeId]).size > 0
        );
        if (typeActorsForActiveType && typeActorsForActiveType.size > 0) {
          return memo.merge(Map().set(id, typeActorsForActiveType));
        }
        return memo;
      },
      Map(),
    );
  }
  // figure out if we have a map and what to show #################################################
  const hasMemberOption = activeActiontypeId && !qe(activeActiontypeId, ACTIONTYPES.NATL);
  const activeActionType = actiontypes && activeActiontypeId && actiontypes.get(activeActiontypeId.toString());
  const hasTarget = activeActionType && activeActionType.getIn(['attributes', 'has_target']);
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
        <TypeSelectBox
          options={actiontypeIdsOptions}
          onSelectType={onSetActiontype}
          activeOptionId={activeActiontypeId}
          type="actions"
        />
      )}
      {viewEntity && actiontypeIdsOptions && actiontypeIdsOptions.size > 0 && (
        <Box>
          <ActorActivitiesMap
            actor={viewEntity}
            actions={activeActiontypeActions}
            actionsAsMember={actiontypesAsMember}
            hasMemberOption={hasMemberOption}
            viewSubject="actors"
            mapSubject="targets"
            actiontypeHasTarget={hasTarget}
            dataReady
            onEntityClick={(id) => onEntityClick(id, ROUTES.ACTOR)}
            actiontypeId={activeActiontypeId}
            actorCanBeMember={canBeMember}
          />
        </Box>
      )}
      {actionsByActiontype && activeActiontypeActions && actionsByActiontype.size > 0 && (
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
                  typeid: activeActiontypeId,
                  columns: getActiontypeColumns(
                    viewEntity,
                    activeActiontypeId,
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
                        actions: actor.getIn(['actionsByType', activeActiontypeId]),
                        taxonomies,
                        onEntityClick,
                        connections: actionConnections,
                        typeid: activeActiontypeId,
                        columns: getActiontypeColumns(
                          viewEntity,
                          activeActiontypeId,
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
