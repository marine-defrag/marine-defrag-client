/*
 *
 * ActorViewDetails
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, intlShape, injectIntl } from 'react-intl';
import { Box, Text, Button } from 'grommet';
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
  ACTIONTYPE_ACTOR_ACTION_ROLES,
  ACTORTYPES,
} from 'themes/config';

import FieldGroup from 'components/fields/FieldGroup';
import ButtonPill from 'components/buttons/ButtonPill';

import {
  selectActionConnections,
  selectSubjectQuery,
  selectActiontypeQuery,
  selectActortypes,
  selectActiontypes,
} from 'containers/App/selectors';

import {
  updatePath,
  setSubject,
  setActiontype,
} from 'containers/App/actions';

import appMessages from 'containers/App/messages';
import ActorActivitiesMap from './ActorActivitiesMap';
import Members from './Members';
import CountryFacts from './CountryFacts';

import {
  selectActionsByType,
  selectActionsAsTargetByType,
  selectMembersByType,
  selectActionsAsMemberByActortype,
  selectActionsAsTargetAsMemberByActortype,
  selectActorIndicators,
} from './selectors';

const TypeSelectBox = styled((p) => <Box {...p} />)``;
const TypeButton = styled((p) => <ButtonPill {...p} />)`
  margin-bottom: 5px;
`;

const SubjectButton = styled((p) => <Button plain {...p} />)`
  padding: 2px 4px;
  border-bottom: 2px solid;
  border-bottom-color: ${({ active }) => active ? 'brand' : 'transparent'};
  background: none;
`;

const getActiontypeColumns = (viewEntity, typeid, viewSubject, intl) => {
  let columns = [{
    id: 'main',
    type: 'main',
    sort: 'title',
    attributes: ['title'],
  }];
  if (
    ACTIONTYPES_CONFIG[parseInt(typeid, 10)]
    && ACTIONTYPES_CONFIG[parseInt(typeid, 10)].columns
  ) {
    columns = ACTIONTYPES_CONFIG[parseInt(typeid, 10)].columns.filter(
      (col) => {
        if (typeof col.showOnSingle !== 'undefined') {
          if (Array.isArray(col.showOnSingle)) {
            return col.showOnSingle.indexOf(viewSubject) > -1;
          }
          return col.showOnSingle;
        }
        return true;
      }
    );
  }
  // relationship type
  if (
    viewSubject === 'actors'
    && ACTIONTYPE_ACTOR_ACTION_ROLES[typeid]
    && ACTIONTYPE_ACTOR_ACTION_ROLES[typeid].length > 0
  ) {
    columns = [
      ...columns,
      {
        id: 'relationshiptype_id',
        type: 'relationship',
        actionId: viewEntity.get('id'),
        title: intl.formatMessage(appMessages.attributes.relationshiptype_id),
      },
    ];
  }
  return columns;
};

export function ActorViewDetails(props) {
  const {
    viewEntity,
    taxonomies,
    actionConnections,
    onSetActiontype,
    viewActiontypeId,
    actionsByActiontype,
    actionsAsTargetByActiontype,
    actiontypes,
    actionsAsMemberByActortype,
    actionsAsTargetAsMemberByActortype,
    onEntityClick,
    intl,
    actortypes,
    isCountry,
    typeId,
    subject,
    onSetSubject,
    membersByType,
    actorConnections,
    onUpdatePath,
    indicators,
  } = props;
  const viewActortype = actortypes && actortypes.find((type) => qe(type.get('id'), typeId));

  const isLocation = qe(typeId, ACTORTYPES.POINT);
  const isTarget = !isLocation && viewActortype && viewActortype.getIn(['attributes', 'is_target']);
  const isActive = !isLocation && viewActortype && viewActortype.getIn(['attributes', 'is_active']);
  const hasMembers = viewActortype && viewActortype.getIn(['attributes', 'has_members']);

  let viewSubject = subject || (hasMembers ? 'members' : 'actors');
  const validViewSubjects = [];
  if (isTarget) {
    validViewSubjects.push('targets');
  }
  if (isActive) {
    validViewSubjects.push('actors');
  }
  if (hasMembers) {
    validViewSubjects.push('members');
  }
  if (isCountry || isLocation) {
    validViewSubjects.push('facts');
  }
  if (validViewSubjects.indexOf(viewSubject) === -1) {
    viewSubject = validViewSubjects.length > 0 ? validViewSubjects[0] : null;
  }

  // figure out connected action types ##################################################
  const canBeMember = viewActortype && !hasMembers;
  let actiontypesForSubject;
  let actiontypesAsMemberByActortypeForSubject;
  let actiontypeIdsAsMemberForSubject;
  let actiontypeIdsForSubjectOptions;
  let actiontypesAsMemberForSubject;
  let activeActiontypeId;
  let activeActiontypeActions;

  if (viewSubject !== 'members') {
    // direct actions by type for selected subject
    if (viewSubject === 'actors') {
      actiontypesForSubject = actionsByActiontype;
    } else if (viewSubject === 'targets') {
      actiontypesForSubject = actionsAsTargetByActiontype;
    }
    // direct && indirect actiontypeids for selected subject
    actiontypeIdsForSubjectOptions = actiontypesForSubject
      && actiontypesForSubject.entrySeq().map(([id]) => id.toString());
    // any indirect actions present for selected subject and type?
    // indirect actions by type for selected subject
    if (canBeMember) {
      if (viewSubject === 'actors') {
        actiontypesAsMemberByActortypeForSubject = actionsAsMemberByActortype;
        // indirect actiontypeids for selected subject
        actiontypeIdsAsMemberForSubject = actiontypesAsMemberByActortypeForSubject.reduce(
          (memo, typeActors) => memo.concat(
            typeActors.reduce(
              (memo2, actor) => memo2.concat(actor.get('actionsByType').keySeq()),
              List(),
            )
          ),
          List(),
        ).toSet();
      } else if (viewSubject === 'targets') {
        actiontypesAsMemberByActortypeForSubject = actionsAsTargetAsMemberByActortype;
        // indirect actiontypeids for selected subject
        actiontypeIdsAsMemberForSubject = actiontypesAsMemberByActortypeForSubject.reduce(
          (memo, typeActors) => memo.concat(
            typeActors.reduce(
              (memo2, actor) => memo2.concat(actor.get('targetingActionsByType').keySeq()),
              List(),
            )
          ),
          List(),
        ).toSet();
      }
    }

    // concat w/ active types for available tabs
    if (actiontypeIdsAsMemberForSubject) {
      actiontypeIdsForSubjectOptions = actiontypeIdsForSubjectOptions
        ? actiontypeIdsForSubjectOptions.concat(
          actiontypeIdsAsMemberForSubject
        ).toSet()
        : (actiontypeIdsAsMemberForSubject && actiontypeIdsAsMemberForSubject.toSet());
    }
    // sort
    actiontypeIdsForSubjectOptions = actiontypeIdsForSubjectOptions
      && actiontypeIdsForSubjectOptions.sort((a, b) => {
        const configA = ACTIONTYPES_CONFIG[a];
        const configB = ACTIONTYPES_CONFIG[b];
        return configA.order < configB.order ? -1 : 1;
      });
    // figure out active action type #################################################
    // selected actiontype (or first in list when not in list)
    activeActiontypeId = viewActiontypeId;
    if (actiontypeIdsForSubjectOptions && !actiontypeIdsForSubjectOptions.includes(viewActiontypeId.toString())) {
      activeActiontypeId = actiontypeIdsForSubjectOptions.first();
    }
    // figure out actions for active action type #################################################

    // direct actions for selected subject and type
    activeActiontypeActions = actiontypesForSubject && actiontypesForSubject.get(parseInt(activeActiontypeId, 10));
    if (canBeMember) {
      // figure out inactive action types
      if (viewSubject === 'actors') {
        actiontypesAsMemberForSubject = actiontypesAsMemberByActortypeForSubject.reduce(
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
      } else if (viewSubject === 'targets') {
        actiontypesAsMemberForSubject = actiontypesAsMemberByActortypeForSubject.reduce(
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
    }
  }
  // figure out if we have a map and what to show #################################################

  // we have the option to include actions for
  //    actors that can be members (i.e. countries)
  // we can have
  // let mapSubject = false;
  // let hasActivityMap = typeId && qe(typeId, ACTORTYPES.COUNTRY);
  let mapSubject = false;
  const hasMemberOption = activeActiontypeId && !qe(activeActiontypeId, ACTIONTYPES.NATL);
  const hasActivityMap = true; // typeId && qe(typeId, ACTORTYPES.COUNTRY);
  let hasTarget;
  const activeActionType = actiontypes && activeActiontypeId && actiontypes.get(activeActiontypeId.toString());
  if (hasActivityMap) {
    if (viewSubject === 'actors') {
      mapSubject = 'targets';
      hasTarget = activeActionType && activeActionType.getIn(['attributes', 'has_target']);
      // only show target maps
      // hasActivityMap = !qe(activeActiontypeId, ACTIONTYPES.NATL);
    } else if (viewSubject === 'targets') {
      mapSubject = 'actors';
    }
  }

  return (
    <Box>
      <Box direction="row" gap="small" margin={{ vertical: 'small', horizontal: 'medium' }}>
        {hasMembers && (
          <SubjectButton
            onClick={() => onSetSubject('members')}
            active={viewSubject === 'members'}
          >
            <Text size="large">Members</Text>
          </SubjectButton>
        )}
        {isActive && (
          <SubjectButton
            onClick={() => onSetSubject('actors')}
            active={viewSubject === 'actors'}
          >
            <Text size="large">Activities</Text>
          </SubjectButton>
        )}
        {isTarget && (
          <SubjectButton
            onClick={() => onSetSubject('targets')}
            active={viewSubject === 'targets'}
          >
            <Text size="large">Targeted by</Text>
          </SubjectButton>
        )}
        {(isCountry || isLocation) && (
          <SubjectButton
            onClick={() => onSetSubject('facts')}
            active={viewSubject === 'facts'}
          >
            <Text size="large">Facts & Figures</Text>
          </SubjectButton>
        )}
      </Box>
      {viewSubject === 'members' && hasMembers && (
        <Members
          membersByType={membersByType}
          onEntityClick={(id) => onEntityClick(id, ROUTES.ACTOR)}
          taxonomies={taxonomies}
          actorConnections={actorConnections}
        />
      )}
      {(viewSubject === 'actors' || viewSubject === 'targets') && (
        <Box>
          {(!actiontypeIdsForSubjectOptions || actiontypeIdsForSubjectOptions.size === 0) && (
            <Box margin={{ vertical: 'small', horizontal: 'medium' }}>
              {viewSubject === 'actors' && (
                <Text>
                  No activities for actor in database
                </Text>
              )}
              {viewSubject === 'targets' && (
                <Text>
                  Actor not target of any activities in database
                </Text>
              )}
            </Box>
          )}
          {actiontypeIdsForSubjectOptions && actiontypeIdsForSubjectOptions.size > 0 && (
            <TypeSelectBox
              direction="row"
              gap="xxsmall"
              margin={{ top: 'small', horizontal: 'medium', bottom: 'medium' }}
              wrap
            >
              {actiontypeIdsForSubjectOptions.map(
                (id) => (
                  <TypeButton
                    key={id}
                    onClick={() => onSetActiontype(id)}
                    active={qe(activeActiontypeId, id) || actiontypeIdsForSubjectOptions.size === 1}
                    listItems={actiontypeIdsForSubjectOptions.size}
                  >
                    <Text size="small">
                      {actiontypeIdsForSubjectOptions.size > 4 && (
                        <FormattedMessage {...appMessages.entities[`actions_${id}`].pluralShort} />
                      )}
                      {actiontypeIdsForSubjectOptions.size <= 4 && (
                        <FormattedMessage {...appMessages.entities[`actions_${id}`].plural} />
                      )}
                    </Text>
                  </TypeButton>
                )
              )}
            </TypeSelectBox>
          )}
          {actiontypeIdsForSubjectOptions && actiontypeIdsForSubjectOptions.size > 0 && (
            <Box>
              {viewEntity && hasActivityMap && (
                <ActorActivitiesMap
                  actor={viewEntity}
                  actions={activeActiontypeActions}
                  actionsAsMember={actiontypesAsMemberForSubject}
                  hasMemberOption={hasMemberOption}
                  viewSubject={viewSubject}
                  mapSubject={mapSubject}
                  actiontypeHasTarget={hasTarget}
                  dataReady
                  onEntityClick={(id) => onEntityClick(id, ROUTES.ACTOR)}
                  actiontypeId={activeActiontypeId}
                  actorCanBeMember={canBeMember}
                />
              )}
            </Box>
          )}
          {actiontypesForSubject && activeActiontypeActions && actiontypesForSubject.size > 0 && (
            <Box>
              <FieldGroup
                group={{
                  title: viewSubject === 'actors' ? 'Individually' : 'Targeted directly',
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
                        viewSubject,
                        intl,
                      ),
                    }),
                  ],
                }}
              />
            </Box>
          )}
          {canBeMember && actiontypesAsMemberForSubject.entrySeq().map(([actortypeId, typeActors]) => (
            <Box key={actortypeId}>
              {typeActors.entrySeq().map(([actorId, actor]) => {
                const typeLabel = intl.formatMessage(appMessages.entities[`actors_${actortypeId}`].singleShort);
                const prefix = viewSubject === 'actors' ? 'As member of ' : 'Targeted as member of ';
                return (
                  <Box key={actorId}>
                    <FieldGroup
                      group={{
                        title: `${prefix} ${typeLabel}: "${actor.getIn(['attributes', 'title'])}"`,
                        fields: [
                          getActionConnectionField({
                            actions: actor.getIn([viewSubject === 'actors' ? 'actionsByType' : 'targetingActionsByType', activeActiontypeId]),
                            taxonomies,
                            onEntityClick,
                            connections: actionConnections,
                            typeid: activeActiontypeId,
                            columns: getActiontypeColumns(
                              viewEntity,
                              activeActiontypeId,
                              viewSubject,
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
      )}
      {viewSubject === 'facts' && (
        <CountryFacts
          onUpdatePath={onUpdatePath}
          indicators={indicators}
          resources={actionConnections && actionConnections.get('resources')}
        />
      )}
    </Box>
  );
}

ActorViewDetails.propTypes = {
  viewEntity: PropTypes.instanceOf(Map),
  taxonomies: PropTypes.instanceOf(Map),
  actionConnections: PropTypes.instanceOf(Map),
  onSetActiontype: PropTypes.func,
  onEntityClick: PropTypes.func,
  viewActiontypeId: PropTypes.string,
  actionsByActiontype: PropTypes.instanceOf(Map),
  actionsAsTargetByActiontype: PropTypes.instanceOf(Map),
  actiontypes: PropTypes.instanceOf(Map),
  actionsAsMemberByActortype: PropTypes.instanceOf(Map),
  actionsAsTargetAsMemberByActortype: PropTypes.instanceOf(Map),
  intl: intlShape,
  onUpdatePath: PropTypes.func,
  subject: PropTypes.string,
  onSetSubject: PropTypes.func,
  actorConnections: PropTypes.instanceOf(Map),
  indicators: PropTypes.instanceOf(Map),
  membersByType: PropTypes.instanceOf(Map),
  actortypes: PropTypes.instanceOf(Map),
  isCountry: PropTypes.bool,
  typeId: PropTypes.number,
};

const mapStateToProps = (state, { id }) => ({
  indicators: selectActorIndicators(state, id),
  actionsByActiontype: selectActionsByType(state, id),
  actionsAsTargetByActiontype: selectActionsAsTargetByType(state, id),
  actionsAsMemberByActortype: selectActionsAsMemberByActortype(state, id),
  actionsAsTargetAsMemberByActortype: selectActionsAsTargetAsMemberByActortype(state, id),
  actionConnections: selectActionConnections(state),
  membersByType: selectMembersByType(state, id),
  subject: selectSubjectQuery(state),
  viewActiontypeId: selectActiontypeQuery(state),
  actortypes: selectActortypes(state),
  actiontypes: selectActiontypes(state),
});

function mapDispatchToProps(dispatch) {
  return {
    onUpdatePath: (path) => {
      dispatch(updatePath(path));
    },
    onSetSubject: (type) => {
      dispatch(setSubject(type));
    },
    onSetActiontype: (type) => {
      dispatch(setActiontype(type));
    },
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(ActorViewDetails));
