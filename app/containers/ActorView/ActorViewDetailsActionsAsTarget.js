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
import ButtonPill from 'components/buttons/ButtonPill';

import { setActiontype } from 'containers/App/actions';
import { selectActortypes } from 'containers/App/selectors';

import appMessages from 'containers/App/messages';
import ActorActivitiesMap from './ActorActivitiesMap';
import { getActiontypeColumns } from './utils';

import {
  selectActionsAsTargetByType,
  selectActionsAsTargetAsMemberByActortype,
} from './selectors';

const TypeSelectBox = styled((p) => <Box {...p} />)``;
const TypeButton = styled((p) => <ButtonPill {...p} />)`
  margin-bottom: 5px;
`;
export function ActorViewDetailsActions({
  viewEntity,
  taxonomies,
  actionConnections,
  onSetActiontype,
  viewActiontypeId,
  actortypes,
  onEntityClick,
  typeId,
  hasMembers,
  actionsByActiontype,
  actionsAsMemberByActortype,
  intl,
}) {
  const viewActortype = actortypes && actortypes.find((type) => qe(type.get('id'), typeId));

  // figure out connected action types ##################################################
  const canBeMember = viewActortype && !hasMembers;

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
  // figure out actions for active action type #################################################

  // direct actions for selected subject and type
  const activeActiontypeActions = actionsByActiontype && actionsByActiontype.get(parseInt(activeActiontypeId, 10));
  if (canBeMember) {
    // figure out inactive action types
    actiontypesAsMember = actionsAsMemberByActortype.reduce(
      (memo, typeActors, id) => {
        const typeActorsForActiveType = typeActors.filter(
          (actor) => actor.get('targetingActionsByType')
            && actor.getIn(['targetingActionsByType', activeActiontypeId])
            && actor.getIn(['targetingActionsByType', activeActiontypeId]).size > 0
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
        <TypeSelectBox
          direction="row"
          gap="xxsmall"
          margin={{ top: 'small', horizontal: 'medium', bottom: 'medium' }}
          wrap
        >
          {actiontypeIdsOptions.map(
            (id) => (
              <TypeButton
                key={id}
                onClick={() => onSetActiontype(id)}
                active={qe(activeActiontypeId, id) || actiontypeIdsOptions.size === 1}
                listItems={actiontypeIdsOptions.size}
              >
                <Text size="small">
                  {actiontypeIdsOptions.size > 4 && (
                    <FormattedMessage {...appMessages.entities[`actions_${id}`].pluralShort} />
                  )}
                  {actiontypeIdsOptions.size <= 4 && (
                    <FormattedMessage {...appMessages.entities[`actions_${id}`].plural} />
                  )}
                </Text>
              </TypeButton>
            )
          )}
        </TypeSelectBox>
      )}
      {viewEntity && actiontypeIdsOptions && actiontypeIdsOptions.size > 0 && (
        <Box>
          <ActorActivitiesMap
            actor={viewEntity}
            actions={activeActiontypeActions}
            actionsAsMember={actiontypesAsMember}
            hasMemberOption={hasMemberOption}
            viewSubject="targets"
            mapSubject="actors"
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
              title: 'Targeted directly',
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
                        actions: actor.getIn(['targetingActionsByType', activeActiontypeId]),
                        taxonomies,
                        onEntityClick,
                        connections: actionConnections,
                        typeid: activeActiontypeId,
                        columns: getActiontypeColumns(
                          viewEntity,
                          activeActiontypeId,
                          'targets',
                          intl,
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
  typeId: PropTypes.number,
  viewEntity: PropTypes.instanceOf(Map),
  taxonomies: PropTypes.instanceOf(Map),
  actionConnections: PropTypes.instanceOf(Map),
  onSetActiontype: PropTypes.func,
  onEntityClick: PropTypes.func,
  viewActiontypeId: PropTypes.string,
  hasMembers: PropTypes.bool,
  actortypes: PropTypes.instanceOf(Map),
  actionsByActiontype: PropTypes.instanceOf(Map),
  actionsAsMemberByActortype: PropTypes.instanceOf(Map),
  intl: intlShape,
};

const mapStateToProps = (state, { id }) => ({
  actionsByActiontype: selectActionsAsTargetByType(state, id),
  actionsAsMemberByActortype: selectActionsAsTargetAsMemberByActortype(state, id),
  actortypes: selectActortypes(state),
});

function mapDispatchToProps(dispatch) {
  return {
    onSetActiontype: (type) => {
      dispatch(setActiontype(type));
    },
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(ActorViewDetailsActions));
