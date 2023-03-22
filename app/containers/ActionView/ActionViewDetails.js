/*
 *
 * ActionViewDetails
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Box, Text, Button } from 'grommet';
import styled from 'styled-components';

import {
  setSubject,
  updatePath,
} from 'containers/App/actions';

import {
  selectSubjectQuery,
  selectActiontypes,
  selectIsPrintView,
  selectPrintConfig,
} from 'containers/App/selectors';

import qe from 'utils/quasi-equals';

import {
  ROUTES,
  ACTIONTYPES,
} from 'themes/config';

import ButtonDefault from 'components/buttons/ButtonDefault';
import PrintHide from 'components/styled/PrintHide';
import PrintOnly from 'components/styled/PrintOnly';
import BoxPrint from 'components/styled/BoxPrint';

import appMessages from 'containers/App/messages';

import { selectChildActionsByType } from './selectors';

import ActionViewDetailsChildren from './ActionViewDetailsChildren';
import ActionViewDetailsTargets from './ActionViewDetailsTargets';
import ActionViewDetailsActors from './ActionViewDetailsActors';
import messages from './messages';

const Styled = styled((p) => <Box pad={{ top: 'medium', bottom: 'large' }} {...p} />)`
  border-top: 1px solid;
  border-color: #f1f0f1;
`;

const SubjectButton = styled((p) => <Button plain {...p} />)`
  padding: 2px 4px;
  border-bottom: 2px solid;
  border-bottom-color: ${({ active }) => active ? 'brand' : 'transparent'};
  background: none;
`;
const PrintSectionTitleWrapper = styled(
  (p) => <Box margin={{ top: 'large', bottom: 'small' }} pad={{ bottom: 'small' }} border="bottom" {...p} />
)``;

export function ActionViewDetails({
  id,
  viewEntity,
  isManager,
  taxonomies,
  childrenByType,
  onEntityClick,
  subject,
  activitytypes,
  handleImportConnection,
  typeId,
  isIndicator,
  onSetSubject,
  isPrintView,
  printArgs,
}) {
  // console.log('childActionsByActiontypeWithActorsByType', childActionsByActiontypeWithActorsByType && childActionsByActiontypeWithActorsByType.toJS())
  // console.log('childActionsByActiontypeWithActorsByType', childActionsByActiontypeWithActorsByType && childActionsByActiontypeWithActorsByType.flatten(1).toJS())
  // console.log(
  //   'childActionsByActiontypeWithTargetsByType',
  //   childActionsByActiontypeWithTargetsByType && childActionsByActiontypeWithTargetsByType.toJS()
  // )
  // console.log(
  //   'childActionsByActiontypeWithTargetsByType',
  //   childActionsByActiontypeWithTargetsByType && childActionsByActiontypeWithTargetsByType.flatten(1).toJS()
  // )
  const viewActivitytype = activitytypes && activitytypes.find((type) => qe(type.get('id'), typeId));
  const hasTarget = viewActivitytype && viewActivitytype.getIn(['attributes', 'has_target']);
  const hasMemberOption = !!typeId && !qe(typeId, ACTIONTYPES.NATL);
  const hasChildren = childrenByType && childrenByType.size > 0;
  let viewSubject = subject;
  const validViewSubjects = ['actors'];
  if (!isIndicator && hasTarget) {
    validViewSubjects.push('targets');
  }
  if (!isIndicator && hasChildren) {
    validViewSubjects.push('children');
  }
  if (validViewSubjects.indexOf(viewSubject) === -1) {
    viewSubject = validViewSubjects.length > 0 ? validViewSubjects[0] : null;
  }
  const showAllTabs = isPrintView && printArgs.printTabs === 'all';
  return (
    <Styled>
      {!isIndicator && !showAllTabs && (
        <PrintHide>
          <Box direction="row" gap="small" margin={{ vertical: 'small', horizontal: 'medium' }}>
            <SubjectButton
              onClick={() => onSetSubject('actors')}
              active={viewSubject === 'actors'}
            >
              <Text size="large">{qe(ACTIONTYPES.DONOR, typeId) ? 'Donors' : 'Actors'}</Text>
            </SubjectButton>
            {hasTarget && (
              <SubjectButton
                onClick={() => onSetSubject('targets')}
                active={viewSubject === 'targets'}
              >
                <Text size="large">{qe(ACTIONTYPES.DONOR, typeId) ? 'Recipients' : 'Targets'}</Text>
              </SubjectButton>
            )}
            {hasChildren && (
              <SubjectButton
                onClick={() => onSetSubject('children')}
                active={viewSubject === 'children'}
              >
                <Text size="large"><FormattedMessage {...appMessages.entities.actions.children} /></Text>
              </SubjectButton>
            )}
          </Box>
        </PrintHide>
      )}
      {(showAllTabs || viewSubject === 'actors') && (
        <>
          {!isIndicator && (
            <PrintOnly>
              <PrintSectionTitleWrapper>
                <Text size="large">{qe(ACTIONTYPES.DONOR, typeId) ? 'Donors' : 'Actors'}</Text>
              </PrintSectionTitleWrapper>
            </PrintOnly>
          )}
          <ActionViewDetailsActors
            id={id}
            viewEntity={viewEntity}
            onEntityClick={onEntityClick}
            hasMemberOption={hasMemberOption}
            taxonomies={taxonomies}
            isIndicator={isIndicator}
            typeId={typeId}
            isManager={isManager}
          />
        </>
      )}
      {(showAllTabs || viewSubject === 'targets') && hasTarget && (
        <>
          {!isIndicator && (
            <PrintOnly>
              <PrintSectionTitleWrapper>
                <Text size="large">{qe(ACTIONTYPES.DONOR, typeId) ? 'Recipients' : 'Targets'}</Text>
              </PrintSectionTitleWrapper>
            </PrintOnly>
          )}
          <ActionViewDetailsTargets
            id={id}
            viewEntity={viewEntity}
            onEntityClick={onEntityClick}
            hasMemberOption={hasMemberOption}
            taxonomies={taxonomies}
            typeId={typeId}
          />
        </>
      )}
      {hasChildren && (showAllTabs || viewSubject === 'children') && (
        <>
          {!isIndicator && (
            <PrintOnly>
              <PrintSectionTitleWrapper>
                <Text size="large"><FormattedMessage {...appMessages.entities.actions.children} /></Text>
                <Text size="large">{qe(ACTIONTYPES.DONOR, typeId) ? 'Recipients' : 'Targets'}</Text>
              </PrintSectionTitleWrapper>
            </PrintOnly>
          )}
          <ActionViewDetailsChildren
            id={id}
            onEntityClick={onEntityClick}
            taxonomies={taxonomies}
            childrenByType={childrenByType}
          />
        </>
      )}
      {isManager && isIndicator && (
        <BoxPrint
          margin={{ top: 'medium', bottom: 'large', horizontal: 'medium' }}
          fill={false}
          alignContent="start"
          direction="row"
          printHide
        >
          <ButtonDefault onClick={() => handleImportConnection()}>
            <FormattedMessage {...messages.importActorConnections} />
          </ButtonDefault>
        </BoxPrint>
      )}
    </Styled>
  );
}

ActionViewDetails.propTypes = {
  viewEntity: PropTypes.instanceOf(Map),
  onEntityClick: PropTypes.func,
  isManager: PropTypes.bool,
  taxonomies: PropTypes.instanceOf(Map),
  childrenByType: PropTypes.instanceOf(Map),
  activitytypes: PropTypes.instanceOf(Map),
  handleImportConnection: PropTypes.func,
  onSetSubject: PropTypes.func,
  subject: PropTypes.string,
  isIndicator: PropTypes.bool,
  isPrintView: PropTypes.bool,
  typeId: PropTypes.number,
  id: PropTypes.string,
  printArgs: PropTypes.object,
};

const mapStateToProps = (state, { id }) => ({
  subject: selectSubjectQuery(state),
  childrenByType: selectChildActionsByType(state, id),
  activitytypes: selectActiontypes(state),
  isPrintView: selectIsPrintView(state),
  printArgs: selectPrintConfig(state),
});

function mapDispatchToProps(dispatch, { id }) {
  return {
    onSetSubject: (type) => {
      dispatch(setSubject(type));
    },
    handleImportConnection: () => {
      dispatch(updatePath(`${ROUTES.ACTOR_ACTIONS}${ROUTES.IMPORT}/${id}`, { replace: true }));
    },
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(ActionViewDetails);
