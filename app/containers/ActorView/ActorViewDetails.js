/*
 *
 * ActorViewDetails
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Box, Text, Button } from 'grommet';
import { Map } from 'immutable';
import styled from 'styled-components';

import qe from 'utils/quasi-equals';

import { ACTORTYPES } from 'themes/config';

import {
  selectActionConnections,
  selectSubjectQuery,
  selectActiontypeQuery,
  selectActortypes,
} from 'containers/App/selectors';

import { setSubject } from 'containers/App/actions';
import PrintHide from 'components/styled/PrintHide';
import PrintOnly from 'components/styled/PrintOnly';

import ActorViewDetailsActions from './ActorViewDetailsActions';
import ActorViewDetailsActionsAsTarget from './ActorViewDetailsActionsAsTarget';
import ActorViewDetailsMembers from './ActorViewDetailsMembers';
import ActorViewDetailsCountryFacts from './ActorViewDetailsCountryFacts';

const Styled = styled((p) => <Box pad={{ top: 'medium', bottom: 'large' }} {...p} />)`
  border-top: 1px solid;
  border-bottom: 1px solid;
  border-color: #f1f0f1;
`;
const SubjectButton = styled((p) => <Button plain {...p} />)`
  padding: 2px 4px;
  border-bottom: 2px solid;
  border-bottom-color: ${({ active }) => active ? 'brand' : 'transparent'};
  background: none;
`;

export function ActorViewDetails(props) {
  const {
    viewEntity,
    taxonomies,
    actionConnections,
    viewActiontypeId,
    onEntityClick,
    isCountry,
    typeId,
    subject,
    onSetSubject,
    actorConnections,
    actortypes,
    id,
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

  return (
    <Styled>
      <PrintHide>
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
      </PrintHide>
      <PrintOnly>
        <Box pad={{ bottom: 'small' }}>
          {hasMembers && viewSubject === 'members' && (
            <Text size="large">Members</Text>
          )}
          {isActive && viewSubject === 'actors' && (
            <Text size="large">Activities</Text>
          )}
          {isTarget && viewSubject === 'targets' && (
            <Text size="large">Targeted by</Text>
          )}
          {(isCountry || isLocation) && viewSubject === 'facts' && (
            <Text size="large">Facts & Figures</Text>
          )}
        </Box>
      </PrintOnly>
      {viewSubject === 'members' && hasMembers && (
        <ActorViewDetailsMembers
          id={id}
          onEntityClick={onEntityClick}
          taxonomies={taxonomies}
          actorConnections={actorConnections}
        />
      )}
      {viewSubject === 'actors' && (
        <ActorViewDetailsActions
          id={id}
          viewEntity={viewEntity}
          taxonomies={taxonomies}
          viewActiontypeId={viewActiontypeId}
          onEntityClick={onEntityClick}
          actionConnections={actionConnections}
          canBeMember={isCountry}
        />
      )}
      {viewSubject === 'targets' && (
        <ActorViewDetailsActionsAsTarget
          id={id}
          viewEntity={viewEntity}
          taxonomies={taxonomies}
          viewActiontypeId={viewActiontypeId}
          onEntityClick={onEntityClick}
          actionConnections={actionConnections}
          canBeMember={isCountry}
        />
      )}
      {viewSubject === 'facts' && (
        <ActorViewDetailsCountryFacts
          id={id}
          resources={actionConnections && actionConnections.get('resources')}
        />
      )}
    </Styled>
  );
}

ActorViewDetails.propTypes = {
  viewEntity: PropTypes.instanceOf(Map),
  taxonomies: PropTypes.instanceOf(Map),
  actionConnections: PropTypes.instanceOf(Map),
  onEntityClick: PropTypes.func,
  viewActiontypeId: PropTypes.string,
  subject: PropTypes.string,
  onSetSubject: PropTypes.func,
  actorConnections: PropTypes.instanceOf(Map),
  actortypes: PropTypes.instanceOf(Map),
  isCountry: PropTypes.bool,
  typeId: PropTypes.number,
  id: PropTypes.string,
};

const mapStateToProps = (state) => ({
  actionConnections: selectActionConnections(state),
  subject: selectSubjectQuery(state),
  viewActiontypeId: selectActiontypeQuery(state),
  actortypes: selectActortypes(state),
});

function mapDispatchToProps(dispatch) {
  return {
    onSetSubject: (type) => {
      dispatch(setSubject(type));
    },
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(ActorViewDetails);
