/*
 *
 * Actors
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { Box, Text, Button } from 'grommet';
import styled from 'styled-components';

import {
  setSubject,
  updatePath,
} from 'containers/App/actions';

import {
  selectSubjectQuery,
  selectActorConnections,
  selectActiontypes,
} from 'containers/App/selectors';

import {
  getMarkdownField,
  getActorConnectionField,
} from 'utils/fields';

import qe from 'utils/quasi-equals';
import { checkActionAttribute } from 'utils/entities';


import {
  ROUTES,
  ACTIONTYPES,
  ACTORTYPES_CONFIG,
  ACTORTYPES,
  ACTIONTYPE_ACTOR_ACTION_ROLES,
} from 'themes/config';

import FieldGroup from 'components/fields/FieldGroup';
import ButtonDefault from 'components/buttons/ButtonDefault';

import appMessages from 'containers/App/messages';

import {
  selectActorsByType,
  selectTargetsByType,
} from './selectors';

import ActionMap from './ActionMap';
import IndicatorCountryMap from './IndicatorCountryMap';
import IndicatorLocationMap from './IndicatorLocationMap';
import messages from './messages';

const SubjectButton = styled((p) => <Button plain {...p} />)`
  padding: 2px 4px;
  border-bottom: 2px solid;
  border-bottom-color: ${({ active }) => active ? 'brand' : 'transparent'};
  background: none;
`;


const getActortypeColumns = (
  actortypeId,
  isIndicator,
  isActive,
  viewEntity,
  intl,
) => {
  let columns = [{
    id: 'main',
    type: 'main',
    sort: 'title',
    attributes: ['code', 'title'],
    isIndicator,
  }];
  if (qe(actortypeId, ACTORTYPES.COUNTRY)) {
    columns = [
      ...columns,
      {
        id: 'classes',
        type: 'associations',
        actortype_id: ACTORTYPES.CLASS,
        title: 'Classes',
        isIndicator,
      },
    ];
    if (isIndicator) {
      columns = [
        ...columns,
        {
          id: 'regions',
          type: 'associations',
          actortype_id: ACTORTYPES.REG,
          title: 'Regions',
          isIndicator,
        },
      ];
    }
  }
  if (isIndicator) {
    columns = [
      ...columns,
      {
        id: 'indicator',
        type: 'indicator',
        indicatorId: viewEntity.get('id'),
        title: viewEntity.getIn(['attributes', 'title']),
        unit: viewEntity.getIn(['attributes', 'comment']),
        align: 'end',
        primary: true,
      },
    ];
  }
  if (
    ACTORTYPES_CONFIG[parseInt(actortypeId, 10)]
    && ACTORTYPES_CONFIG[parseInt(actortypeId, 10)].columns
  ) {
    columns = [
      ...columns,
      ...ACTORTYPES_CONFIG[parseInt(actortypeId, 10)].columns,
    ];
  }

  // relationship type
  if (
    isActive
    && ACTIONTYPE_ACTOR_ACTION_ROLES[viewEntity.getIn(['attributes', 'measuretype_id'])]
    && ACTIONTYPE_ACTOR_ACTION_ROLES[viewEntity.getIn(['attributes', 'measuretype_id'])].length > 0
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

export function Actors(props) {
  const {
    viewEntity,
    dataReady,
    isManager,
    taxonomies,
    actorsByActortype,
    targetsByActortype,
    onEntityClick,
    actorConnections,
    subject,
    intl,
    activitytypes,
    handleImportConnection,
    typeId,
    isIndicator,
    onSetSubject,
  } = props;

  const viewActivitytype = activitytypes && activitytypes.find((type) => qe(type.get('id'), typeId));
  const hasTarget = viewActivitytype && viewActivitytype.getIn(['attributes', 'has_target']);
  const hasMemberOption = !!typeId && !qe(typeId, ACTIONTYPES.NATL);
  const viewSubject = hasTarget && subject ? subject : 'actors';

  const actortypesForSubject = !hasTarget || viewSubject === 'actors'
    ? actorsByActortype
    : targetsByActortype;

  // action has a map
  const hasCountryActionMap = !!typeId && !isIndicator;
  const hasIndicatorCountryMap = !!typeId && isIndicator && actortypesForSubject && actortypesForSubject.get(parseInt(ACTORTYPES.COUNTRY, 10));
  const hasIndicatorLocationMap = !!typeId && isIndicator && actortypesForSubject && actortypesForSubject.get(parseInt(ACTORTYPES.POINT, 10));
  // && !qe(typeId, ACTIONTYPES.NATL);

  return (
    <Box>
      {!isIndicator && (
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
        </Box>
      )}
      {(!actortypesForSubject || actortypesForSubject.size === 0) && (
        <Box margin={{ vertical: 'small', horizontal: 'medium' }}>
          {viewSubject === 'actors' && (
            <Text>
              No actors for activity in database
            </Text>
          )}
          {viewSubject === 'targets' && (
            <Text>
              No activity targets in database
            </Text>
          )}
        </Box>
      )}
      {dataReady && actortypesForSubject && hasCountryActionMap && (
        <ActionMap
          entities={actortypesForSubject}
          mapSubject={viewSubject}
          onActorClick={(id) => onEntityClick(id, ROUTES.ACTOR)}
          hasMemberOption={hasMemberOption}
          typeId={typeId}
        />
      )}
      {dataReady && actortypesForSubject && hasIndicatorCountryMap && (
        <IndicatorCountryMap
          countries={actortypesForSubject.get(parseInt(ACTORTYPES.COUNTRY, 10))}
          mapSubject="actors"
          onCountryClick={(id) => onEntityClick(id, ROUTES.ACTOR)}
          indicator={viewEntity}
        />
      )}
      {dataReady && actortypesForSubject && hasIndicatorLocationMap && (
        <IndicatorLocationMap
          locations={actortypesForSubject.get(parseInt(ACTORTYPES.POINT, 10))}
          mapSubject="actors"
          indicator={viewEntity}
        />
      )}
      {viewSubject === 'targets' && hasTarget && (
        <FieldGroup
          group={{
            fields: [
              checkActionAttribute(typeId, 'target_comment')
                && getMarkdownField(viewEntity, 'target_comment', true),
            ],
          }}
        />
      )}
      {actortypesForSubject && (
        <FieldGroup
          group={{
            fields: actortypesForSubject.reduce(
              (memo, actors, typeid) => memo.concat([
                getActorConnectionField({
                  actors: isIndicator
                    ? actors.filter(
                      (actor) => !!actor.getIn(['actionValues', viewEntity.get('id')])
                    )
                    : actors,
                  taxonomies,
                  onEntityClick,
                  connections: actorConnections,
                  typeid,
                  columns: getActortypeColumns(
                    typeid,
                    isIndicator,
                    viewSubject === 'actors',
                    viewEntity,
                    intl,
                  ),
                  isIndicator,
                  sortBy: isIndicator ? 'indicator' : null,
                  sortOrder: isIndicator ? 'desc' : null,
                }),
              ]),
              [],
            ),
          }}
        />
      )}
      {isManager && isIndicator && (
        <Box
          margin={{ bottom: 'large', horizontal: 'medium' }}
          fill={false}
          alignContent="start"
          direction="row"
        >
          <ButtonDefault
            onClick={() => handleImportConnection()}
          >
            <FormattedMessage {...messages.importActorConnections} />
          </ButtonDefault>
        </Box>
      )}
    </Box>
  );
}

Actors.propTypes = {
  viewEntity: PropTypes.object,
  dataReady: PropTypes.bool,
  onEntityClick: PropTypes.func,
  isManager: PropTypes.bool,
  taxonomies: PropTypes.object,
  actorsByActortype: PropTypes.object,
  targetsByActortype: PropTypes.object,
  actorConnections: PropTypes.object,
  activitytypes: PropTypes.object,
  handleImportConnection: PropTypes.func,
  onSetSubject: PropTypes.func,
  intl: intlShape.isRequired,
  subject: PropTypes.string,
  isIndicator: PropTypes.bool,
  typeId: PropTypes.number,
};

const mapStateToProps = (state, { id }) => ({
  subject: selectSubjectQuery(state),
  actorsByActortype: selectActorsByType(state, id),
  targetsByActortype: selectTargetsByType(state, id),
  actorConnections: selectActorConnections(state),
  activitytypes: selectActiontypes(state),
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


export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Actors));
