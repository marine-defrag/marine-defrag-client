/*
 *
 * ActionViewDetailsTargets
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';
import { Box, Text } from 'grommet';

import { selectActorConnections } from 'containers/App/selectors';

import {
  getMarkdownField,
  getActorConnectionField,
} from 'utils/fields';

import { checkActionAttribute } from 'utils/entities';


import {
  ROUTES,
} from 'themes/config';

import FieldGroup from 'components/fields/FieldGroup';

import appMessages from 'containers/App/messages';

import {
  selectChildActionsByTypeWithTargetsByType,
  selectTargetsByType,
} from './selectors';

import ActionMap from './ActionMap';
import { getActortypeColumns } from './utils';

export function ActionViewDetailsTargets({
  viewEntity,
  taxonomies,
  targetsByActortype,
  childActionsByActiontypeWithTargetsByType,
  onEntityClick,
  actorConnections,
  intl,
  typeId,
  hasMemberOption,
}) {
  // action has a map
  const hasCountryActionMap = !!typeId;

  return (
    <>
      {(targetsByActortype || childActionsByActiontypeWithTargetsByType) && hasCountryActionMap && (
        <ActionMap
          actorsByType={targetsByActortype}
          childCountries={
            childActionsByActiontypeWithTargetsByType
            && childActionsByActiontypeWithTargetsByType.flatten(1).reduce(
              (memo, childActions) => (
                childActions.get('targetsByType')
                && childActions.get('targetsByType').get(1)
              )
                ? memo.merge(childActions.get('targetsByType').get(1))
                : memo,
              Map(),
            )
          }
          mapSubject="targets"
          onActorClick={(id) => onEntityClick(id, ROUTES.ACTOR)}
          hasMemberOption={hasMemberOption}
          typeId={typeId}
        />
      )}
      <FieldGroup
        group={{
          fields: [
            checkActionAttribute(typeId, 'target_comment')
              && getMarkdownField(viewEntity, 'target_comment', true),
          ],
        }}
      />
      {targetsByActortype && (
        <FieldGroup
          group={{
            fields: targetsByActortype.reduce(
              (memo, actors, typeid) => memo.concat([
                getActorConnectionField({
                  actors,
                  taxonomies,
                  onEntityClick,
                  connections: actorConnections,
                  typeid,
                  columns: getActortypeColumns(
                    typeid,
                    false, // isIndicator
                    false, // viewSubject === 'actors',
                    viewEntity,
                    intl,
                  ),
                }),
              ]),
              [],
            ),
          }}
        />
      )}
      {(!targetsByActortype || targetsByActortype.size === 0) && (
        <Box margin={{ vertical: 'small', horizontal: 'medium' }}>
          {!childActionsByActiontypeWithTargetsByType && (
            <Text>
              No activity targets in database
            </Text>
          )}
          {childActionsByActiontypeWithTargetsByType && (
            <Text>
              No directly linked activity targets in database
            </Text>
          )}
        </Box>
      )}
      {childActionsByActiontypeWithTargetsByType
        && childActionsByActiontypeWithTargetsByType.entrySeq().map(
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
                        fields: action.get('targetsByType').reduce(
                          (memo, actors, typeid) => memo.concat([
                            getActorConnectionField({
                              actors,
                              taxonomies,
                              onEntityClick,
                              connections: actorConnections,
                              typeid,
                              columns: getActortypeColumns(
                                typeid,
                                false, // isIndicator
                                false,
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

ActionViewDetailsTargets.propTypes = {
  viewEntity: PropTypes.instanceOf(Map),
  onEntityClick: PropTypes.func,
  hasMemberOption: PropTypes.bool,
  taxonomies: PropTypes.instanceOf(Map),
  typeId: PropTypes.number,
  childActionsByActiontypeWithTargetsByType: PropTypes.instanceOf(Map),
  targetsByActortype: PropTypes.instanceOf(Map),
  actorConnections: PropTypes.instanceOf(Map),
  intl: intlShape.isRequired,
};

const mapStateToProps = (state, { id }) => ({
  childActionsByActiontypeWithTargetsByType: selectChildActionsByTypeWithTargetsByType(state, id),
  targetsByActortype: selectTargetsByType(state, id),
  actorConnections: selectActorConnections(state),
});

export default connect(mapStateToProps, null)(injectIntl(ActionViewDetailsTargets));
