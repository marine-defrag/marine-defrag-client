/*
 *
 * ActionViewDetailsActors
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';
import { Box, Text } from 'grommet';

import {
  selectActorConnections,
  selectPrintArgs,
  selectIsPrintView,
} from 'containers/App/selectors';

import { getActorConnectionField } from 'utils/fields';

import {
  ROUTES,
  ACTORTYPES,
} from 'themes/config';

import FieldGroup from 'components/fields/FieldGroup';

import appMessages from 'containers/App/messages';

import {
  selectActorsByType,
  selectChildActionsByTypeWithActorsByType,
} from './selectors';

import IndicatorCountryMap from './IndicatorCountryMap';
import IndicatorLocationMap from './IndicatorLocationMap';
import ActionMap from './ActionMap';
import { getActortypeColumns } from './utils';

export function ActionViewDetailsActors({
  viewEntity,
  taxonomies,
  actorsByActortype,
  childActionsByActiontypeWithActorsByType,
  onEntityClick,
  actorConnections,
  intl,
  typeId,
  isIndicator,
  hasMemberOption,
  isManager,
  isPrintView,
  printArgs,
}) {
  // action has a map
  const hasCountryActionMap = !!typeId && !isIndicator;
  const hasIndicatorCountryMap = !!typeId && isIndicator && actorsByActortype && actorsByActortype.get(parseInt(ACTORTYPES.COUNTRY, 10));
  const hasIndicatorLocationMap = !!typeId && isIndicator && actorsByActortype && actorsByActortype.get(parseInt(ACTORTYPES.POINT, 10));
  // && !qe(typeId, ACTIONTYPES.NATL);
  const showActors = !hasIndicatorLocationMap || isManager;
  return (
    <>
      {(actorsByActortype || childActionsByActiontypeWithActorsByType) && hasCountryActionMap && (
        <ActionMap
          mapId="ll-action-actors"
          actorsByType={actorsByActortype}
          childCountries={
            childActionsByActiontypeWithActorsByType
            && childActionsByActiontypeWithActorsByType.flatten(1).reduce(
              (memo, childActions) => (
                childActions.get('actorsByType')
                && childActions.get('actorsByType').get(1)
              )
                ? memo.merge(childActions.get('actorsByType').get(1))
                : memo,
              Map(),
            )
          }
          mapSubject="actors"
          onActorClick={(id) => onEntityClick(id, ROUTES.ACTOR)}
          hasMemberOption={hasMemberOption}
          typeId={typeId}
          isPrintView={isPrintView}
          printArgs={printArgs}
        />
      )}
      {actorsByActortype && hasIndicatorCountryMap && (
        <IndicatorCountryMap
          countries={actorsByActortype.get(parseInt(ACTORTYPES.COUNTRY, 10))}
          mapSubject="actors"
          onCountryClick={(id) => onEntityClick(id, ROUTES.ACTOR)}
          indicator={viewEntity}
          isPrintView={isPrintView}
          printArgs={printArgs}
        />
      )}
      {actorsByActortype && hasIndicatorLocationMap && (
        <IndicatorLocationMap
          locations={actorsByActortype.get(parseInt(ACTORTYPES.POINT, 10))}
          mapSubject="actors"
          indicator={viewEntity}
          isPrintView={isPrintView}
          printArgs={printArgs}
        />
      )}
      {actorsByActortype && showActors && (
        <FieldGroup
          group={{
            fields: actorsByActortype.reduce(
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
                    true, // viewSubject === 'actors',
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
      {(!actorsByActortype || actorsByActortype.size === 0) && (
        <Box margin={{ vertical: 'small', horizontal: 'medium' }}>
          {!childActionsByActiontypeWithActorsByType && (
            <Text>
              No actors for activity in database
            </Text>
          )}
          {childActionsByActiontypeWithActorsByType && (
            <Text>
              No directly linked actors for activity in database
            </Text>
          )}
        </Box>
      )}
      {childActionsByActiontypeWithActorsByType
        && childActionsByActiontypeWithActorsByType.entrySeq().map(
          ([actiontypeId, typeActions]) => (
            <Box key={actiontypeId}>
              {typeActions.entrySeq().map(([actionId, action]) => {
                const typeLabel = intl.formatMessage(appMessages.entities[`actions_${actiontypeId}`].singleShort);
                const prefix = 'As parent/predecessor of';
                return (
                  <Box key={actionId}>
                    <FieldGroup
                      group={{
                        title: `${prefix} ${typeLabel}: "${action.getIn(['attributes', 'title'])}"`,
                        fields: action.get('actorsByType') && action.get('actorsByType').reduce(
                          (memo, actors, typeid) => memo.concat([
                            getActorConnectionField({
                              actors,
                              taxonomies,
                              onEntityClick,
                              connections: actorConnections,
                              typeid,
                              columns: getActortypeColumns(
                                typeid,
                                isIndicator,
                                true,
                                action,
                                intl,
                              ),
                            }),
                          ]),
                          [],
                        ),
                      }}
                    />
                  </Box>
                );
              })}
            </Box>
          )
        )
      }
    </>
  );
}

ActionViewDetailsActors.propTypes = {
  viewEntity: PropTypes.instanceOf(Map),
  onEntityClick: PropTypes.func,
  taxonomies: PropTypes.instanceOf(Map),
  isIndicator: PropTypes.bool,
  hasMemberOption: PropTypes.bool,
  typeId: PropTypes.number,
  actorsByActortype: PropTypes.instanceOf(Map),
  childActionsByActiontypeWithActorsByType: PropTypes.instanceOf(Map),
  actorConnections: PropTypes.instanceOf(Map),
  intl: intlShape.isRequired,
  isManager: PropTypes.bool,
  isPrintView: PropTypes.bool,
  printArgs: PropTypes.object,
};

const mapStateToProps = (state, { id }) => ({
  actorsByActortype: selectActorsByType(state, id),
  childActionsByActiontypeWithActorsByType: selectChildActionsByTypeWithActorsByType(state, id),
  actorConnections: selectActorConnections(state),
  printArgs: selectPrintArgs(state),
  isPrintView: selectIsPrintView(state),
});

export default connect(mapStateToProps, null)(injectIntl(ActionViewDetailsActors));
