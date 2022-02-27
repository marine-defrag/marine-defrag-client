/*
 *
 * ActorMap
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Map, List } from 'immutable';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Box, Text } from 'grommet';

import * as topojson from 'topojson-client';
// import { FormattedMessage } from 'react-intl';

import countriesTopo from 'data/ne_countries_10m_v5.topo.json';

import { ACTORTYPES, ACTIONTYPES } from 'themes/config';

import {
  selectActortypeActors,
  selectIncludeActorMembers,
  selectIncludeTargetMembers,
  selectMembershipsGroupedByAssociation,
} from 'containers/App/selectors';

import {
  setIncludeActorMembers,
  setIncludeTargetMembers,
} from 'containers/App/actions';


// import appMessages from 'containers/App/messages';
import qe from 'utils/quasi-equals';
// import { hasGroupActors } from 'utils/entities';
import MapContainer from 'containers/EntitiesMap/MapContainer';
import MapMemberOption from 'containers/EntitiesMap/MapInfoOptions/MapMemberOption';
import MapKey from 'containers/EntitiesMap/MapInfoOptions/MapKey';
// import messages from './messages';

const Styled = styled((p) => <Box {...p} />)`
  z-index: 0;
`;
const MapTitle = styled((p) => <Box margin={{ horizontal: 'medium', vertical: 'xsmall' }} {...p} />)``;
const MapKeyWrapper = styled((p) => <Box margin={{ horizontal: 'medium', vertical: 'xsmall' }} {...p} />)`
  max-width: 400px;
`;
const MapOptions = styled((p) => <Box margin={{ horizontal: 'medium' }} {...p} />)``;
const MapWrapper = styled((p) => <Box margin={{ horizontal: 'medium' }} {...p} />)`
  position: relative;
  height: 400px;
`;

export function ActorMap({
  actor,
  actions,
  actionsAsMember,
  mapSubject,
  onSetIncludeActorMembers,
  onSetIncludeTargetMembers,
  includeActorMembers,
  includeTargetMembers,
  onEntityClick,
  countries,
  hasMemberOption,
  actiontypeId,
  actiontypeHasTarget,
  memberships,
  actorCanBeMember,
  // intl,
}) {
  // console.log('actions', actions && actions.toJS())
  // console.log('actionsAsMember', actionsAsMember && actionsAsMember.toJS())
  // console.log('actiontypeHasTarget', actiontypeHasTarget)
  // console.log('hasMemberOption', hasMemberOption)
  // const { intl } = this.context;
  // let type;
  const countriesJSON = topojson.feature(
    countriesTopo,
    Object.values(countriesTopo.objects)[0],
  );
  let countriesActionCount;
  const actorName = actor.getIn(['attributes', 'title']);
  let memberOption;
  let memberTargetOption;
  let mapTitle;
  let keyTitle;
  // show targets for actor's activities (real targets)
  // > donations / initiatives / regional seas conventions
  if (mapSubject === 'targets' && actiontypeHasTarget) {
    if (actions) {
      countriesActionCount = actions.reduce(
        (memo, action) => {
          if (action.get('targetsByType')) {
            return action.get('targetsByType').reduce(
              (memo2, targettypeTargets, targettypeId) => {
                if (qe(targettypeId, ACTORTYPES.COUNTRY)) {
                  return targettypeTargets.reduce(
                    (memo3, countryId) => {
                      if (memo3.get(countryId)) {
                        if (!memo3.get(countryId).includes(action.get('id'))) {
                          return memo3.set(countryId, memo3.get(countryId).push(action.get('id')));
                        }
                        return memo3;
                      }
                      return memo3.set(countryId, List([action.get('id')]));
                    },
                    memo2,
                  );
                }
                // TODO check actortype if it can have members
                if (includeTargetMembers && !qe(targettypeId, ACTORTYPES.ORG)) {
                  return targettypeTargets.reduce(
                    (memo3, groupId) => {
                      const groupMembers = memberships.get(groupId);
                      if (groupMembers) {
                        return groupMembers.reduce(
                          (memo4, memberId) => {
                            const country = countries.get(memberId.toString());
                            if (country) {
                              if (memo4.get(memberId)) {
                                if (!memo4.get(memberId).includes(action.get('id'))) {
                                  return memo4.set(memberId, memo4.get(memberId).push(action.get('id')));
                                }
                                return memo4;
                              }
                              return memo4.set(memberId, List([action.get('id')]));
                            }
                            return memo4;
                          },
                          memo3,
                        );
                      }
                      return memo3;
                    },
                    memo2,
                  );
                }
                return memo2;
              },
              memo,
            );
          }
          return memo;
        },
        countriesActionCount || Map(),
      );
    }
    if (includeActorMembers && actionsAsMember) {
      countriesActionCount = actionsAsMember.flatten(1).reduce(
        (memo, groupActor) => {
          if (groupActor.getIn(['actionsByType', actiontypeId])) {
            return memo.concat(groupActor.getIn(['actionsByType', actiontypeId]).toList());
          }
          return memo;
        },
        List()
      ).reduce(
        (memo, action) => {
          if (action.get('targetsByType')) {
            return action.get('targetsByType').reduce(
              (memo2, targettypeTargets, targettypeId) => {
                if (qe(targettypeId, ACTORTYPES.COUNTRY)) {
                  return targettypeTargets.reduce(
                    (memo3, countryId) => {
                      if (memo3.get(countryId)) {
                        if (!memo3.get(countryId).includes(action.get('id'))) {
                          return memo3.set(countryId, memo3.get(countryId).push(action.get('id')));
                        }
                        return memo3;
                      }
                      return memo3.set(countryId, List([action.get('id')]));
                    },
                    memo2,
                  );
                }
                // TODO check actortype if it can have members
                if (includeTargetMembers && !qe(targettypeId, ACTORTYPES.ORG)) {
                  return targettypeTargets.reduce(
                    (memo3, groupId) => {
                      const groupMembers = memberships.get(groupId);
                      if (groupMembers) {
                        return groupMembers.reduce(
                          (memo4, memberId) => {
                            const country = countries.get(memberId.toString());
                            if (country) {
                              if (memo4.get(memberId)) {
                                if (!memo4.get(memberId).includes(action.get('id'))) {
                                  return memo4.set(memberId, memo4.get(memberId).push(action.get('id')));
                                }
                                return memo4;
                              }
                              return memo4.set(memberId, List([action.get('id')]));
                            }
                            return memo4;
                          },
                          memo3,
                        );
                      }
                      return memo3;
                    },
                    memo2,
                  );
                }
                return memo2;
              },
              memo,
            );
          }
          return memo;
        },
        countriesActionCount || Map(),
      );
    }
  }

  // show targets for actor's activities (targets are actually actors)
  // > intl frameworks / regional strategies / national strategies
  if (mapSubject === 'targets' && !actiontypeHasTarget) {
    if (actions) {
      countriesActionCount = actions.reduce(
        (memo, action) => {
          if (action.get('actorsByType')) {
            return action.get('actorsByType').reduce(
              (memo2, actortypeActors, actortypeId) => {
                if (qe(actortypeId, ACTORTYPES.COUNTRY)) {
                  return actortypeActors.reduce(
                    (memo3, countryId) => {
                      if (memo3.get(countryId)) {
                        if (!memo3.get(countryId).includes(action.get('id'))) {
                          return memo3.set(countryId, memo3.get(countryId).push(action.get('id')));
                        }
                        return memo3;
                      }
                      return memo3.set(countryId, List([action.get('id')]));
                    },
                    memo2,
                  );
                }
                if (!actorCanBeMember && qe(actortypeId, ACTORTYPES.GROUP)) {
                  return actortypeActors.reduce(
                    (memo3, groupId) => {
                      const groupMembers = memberships.get(groupId);
                      if (groupMembers) {
                        return groupMembers.reduce(
                          (memo4, memberId) => {
                            const country = countries.get(memberId.toString());
                            if (country) {
                              if (memo4.get(memberId)) {
                                if (!memo4.get(memberId).includes(action.get('id'))) {
                                  return memo4.set(memberId, memo4.get(memberId).push(action.get('id')));
                                }
                                return memo4;
                              }
                              return memo4.set(memberId, List([action.get('id')]));
                            }
                            return memo4;
                          },
                          memo3,
                        );
                      }
                      return memo3;
                    },
                    memo2,
                  );
                }
                return memo2;
              },
              memo,
            );
          }
          return memo;
        },
        countriesActionCount || Map(),
      );
    }
    if (includeActorMembers && actionsAsMember) {
      countriesActionCount = actionsAsMember.flatten(1).reduce(
        (memo, groupActor) => {
          if (groupActor.getIn(['actionsByType', actiontypeId])) {
            return memo.concat(groupActor.getIn(['actionsByType', actiontypeId]).toList());
          }
          return memo;
        },
        List()
      ).reduce(
        (memo, action) => {
          if (action.get('actorsByType')) {
            return action.get('actorsByType').reduce(
              (memo2, actortypeActors, actortypeId) => {
                if (!qe(actortypeId, ACTORTYPES.ORG)) {
                  return actortypeActors.reduce(
                    (memo3, groupId) => {
                      const groupMembers = memberships.get(groupId);
                      if (groupMembers) {
                        return groupMembers.reduce(
                          (memo4, memberId) => {
                            const country = countries.get(memberId.toString());
                            if (country) {
                              if (memo4.get(memberId)) {
                                if (!memo4.get(memberId).includes(action.get('id'))) {
                                  return memo4.set(memberId, memo4.get(memberId).push(action.get('id')));
                                }
                                return memo4;
                              }
                              return memo4.set(memberId, List([action.get('id')]));
                            }
                            return memo4;
                          },
                          memo3,
                        );
                      }
                      return memo3;
                    },
                    memo2,
                  );
                }
                return memo2;
              },
              memo,
            );
          }
          return memo;
        },
        countriesActionCount || Map(),
      );
    }
  }

  // show actors for activities targeting actor
  // > donations / reg strategies / initiatives
  if (mapSubject === 'actors') {
    if (actions) {
      countriesActionCount = actions && actions.reduce(
        (memo, action) => {
          if (action.get('actorsByType')) {
            return action.get('actorsByType').reduce(
              (memo2, actortypeActors, actortypeId) => {
                if (qe(actortypeId, ACTORTYPES.COUNTRY)) {
                  return actortypeActors.reduce(
                    (memo3, countryId) => {
                      if (memo3.get(countryId)) {
                        if (!memo3.get(countryId).includes(action.get('id'))) {
                          return memo3.set(countryId, memo3.get(countryId).push(action.get('id')));
                        }
                        return memo3;
                      }
                      return memo3.set(countryId, List([action.get('id')]));
                    },
                    memo2,
                  );
                }
                // TODO check actortype if it can have members
                if (includeActorMembers && !qe(actortypeId, ACTORTYPES.ORG)) {
                  return actortypeActors.reduce(
                    (memo3, groupId) => {
                      const groupMembers = memberships.get(groupId);
                      if (groupMembers) {
                        return groupMembers.reduce(
                          (memo4, memberId) => {
                            const country = countries.get(memberId.toString());
                            if (country) {
                              if (memo4.get(memberId)) {
                                if (!memo4.get(memberId).includes(action.get('id'))) {
                                  return memo4.set(memberId, memo4.get(memberId).push(action.get('id')));
                                }
                                return memo4;
                              }
                              return memo4.set(memberId, List([action.get('id')]));
                            }
                            return memo4;
                          },
                          memo3,
                        );
                      }
                      return memo3;
                    },
                    memo2,
                  );
                }
                return memo2;
              },
              memo,
            );
          }
          return memo;
        },
        countriesActionCount || Map(),
      );
    }
    if (includeTargetMembers && actionsAsMember) {
      countriesActionCount = actionsAsMember.flatten(1).reduce(
        (memo, groupActor) => {
          if (groupActor.getIn(['targetingActionsByType', actiontypeId])) {
            return memo.concat(groupActor.getIn(['targetingActionsByType', actiontypeId]).toList());
          }
          return memo;
        },
        List()
      ).reduce(
        (memo, action) => {
          if (action.get('actorsByType')) {
            return action.get('actorsByType').reduce(
              (memo2, actortypeActors, actortypeId) => {
                if (qe(actortypeId, ACTORTYPES.COUNTRY)) {
                  return actortypeActors.reduce(
                    (memo3, countryId) => {
                      if (memo3.get(countryId)) {
                        if (!memo3.get(countryId).includes(action.get('id'))) {
                          return memo3.set(countryId, memo3.get(countryId).push(action.get('id')));
                        }
                        return memo3;
                      }
                      return memo3.set(countryId, List([action.get('id')]));
                    },
                    memo2,
                  );
                }
                // TODO check actortype if it can have members
                if (includeActorMembers && !qe(actortypeId, ACTORTYPES.ORG)) {
                  return actortypeActors.reduce(
                    (memo3, groupId) => {
                      const groupMembers = memberships.get(groupId);
                      if (groupMembers) {
                        return groupMembers.reduce(
                          (memo4, memberId) => {
                            const country = countries.get(memberId.toString());
                            if (country) {
                              if (memo4.get(memberId)) {
                                if (!memo4.get(memberId).includes(action.get('id'))) {
                                  return memo4.set(memberId, memo4.get(memberId).push(action.get('id')));
                                }
                                return memo4;
                              }
                              return memo4.set(memberId, List([action.get('id')]));
                            }
                            return memo4;
                          },
                          memo3,
                        );
                      }
                      return memo3;
                    },
                    memo2,
                  );
                }
                return memo2;
              },
              memo,
            );
          }
          return memo;
        },
        countriesActionCount || Map(),
      );
    }
  }
  const countryCount = countriesActionCount && countriesActionCount.size;
  // also figure out map options
  if (mapSubject === 'targets' && actiontypeHasTarget) {
    mapTitle = `${countryCount} ${countryCount === 1 ? 'country' : 'countries'} targeted by activities of '${actorName}'`;
    keyTitle = 'No of activities targeting each country';
    if (hasMemberOption) {
      if (actorCanBeMember) {
        memberOption = {
          active: includeActorMembers,
          onClick: () => onSetIncludeActorMembers(includeActorMembers ? '0' : '1'),
          label: `Include activities of groups '${actorName}' belongs to`,
          key: 'am',
        };
      }
      memberTargetOption = {
        active: includeTargetMembers,
        onClick: () => onSetIncludeTargetMembers(includeTargetMembers ? '0' : '1'),
        label: `Include regions, groups, classes targeted by activities of '${actorName}'`,
        key: 'tm',
      };
    }
  }

  // show targets for actor's activities (targets are actually actors)
  // > intl frameworks / regional strategies / national strategies
  if (mapSubject === 'targets' && !actiontypeHasTarget) {
    mapTitle = `${countryCount} ${countryCount === 1 ? 'country' : 'countries'} targeted by activities of '${actorName}'`; // '${actorName}`; // regional strategies, intl frameworks
    keyTitle = 'No of activities targeting each country';
    if (hasMemberOption && !qe(actiontypeId, ACTIONTYPES.NATL) && actorCanBeMember) {
      memberOption = {
        active: includeActorMembers,
        onClick: () => onSetIncludeActorMembers(includeActorMembers ? '0' : '1'),
        label: `Include activities of groups '${actorName}' belongs to`,
      };
    }
  }
  // show actors for activities targeting actor
  // > donations / reg strategies / initiatives
  if (mapSubject === 'actors') {
    mapTitle = `${countryCount} ${countryCount === 1 ? 'country' : 'countries'} with activities targeting '${actorName}'`;
    keyTitle = 'No of activities per country';
    if (hasMemberOption) {
      memberOption = {
        active: includeActorMembers,
        onClick: () => onSetIncludeActorMembers(includeActorMembers ? '0' : '1'),
        label: `Include member countries of groups targeting '${actorName}'`,
        key: 'am',
      };
      if (actorCanBeMember) {
        memberTargetOption = {
          active: includeTargetMembers,
          onClick: () => onSetIncludeTargetMembers(includeTargetMembers ? '0' : '1'),
          label: `Include countries with activities targeting '${actorName}' indirectly via a region, group or class`,
          key: 'tm',
        };
      }
    }
  }

  const countryData = countriesJSON.features.reduce(
    (memo, feature) => {
      const country = countries && countries.find(
        (e) => qe(e.getIn(['attributes', 'code']), feature.properties.ADM0_A3)
      );
      if (country) {
        const actionCount = countriesActionCount
          && countriesActionCount.get(parseInt(country.get('id'), 10))
          && countriesActionCount.get(parseInt(country.get('id'), 10)).size;
        if (actionCount) {
          return [
            ...memo,
            {
              ...feature,
              id: country.get('id'),
              attributes: country.get('attributes').toJS(),
              tooltip: {
                title: country.getIn(['attributes', 'title']),
              },
              values: {
                actions: actionCount || 0,
              },
            },
          ];
        }
      }
      return memo;
    },
    [],
  );
  const maxValue = countriesActionCount && countriesActionCount.reduce(
    (max, actionList) => Math.max(max, actionList.size),
    0,
  );
  return (
    <Styled hasHeader noOverflow>
      {mapTitle && (
        <MapTitle>
          <Text weight={600}>{mapTitle}</Text>
        </MapTitle>
      )}
      <MapWrapper>
        <MapContainer
          countryData={countryData}
          countryFeatures={countriesJSON.features}
          indicator="actions"
          onCountryClick={(id) => onEntityClick(id)}
          maxValue={maxValue}
          includeActorMembers={includeActorMembers}
          includeTargetMembers={includeTargetMembers}
          mapSubject={mapSubject}
          fitBounds
          projection="gall-peters"
        />
      </MapWrapper>
      {maxValue > 1 && (
        <MapKeyWrapper>
          <Text size="small">{keyTitle}</Text>
          <MapKey mapSubject={mapSubject} maxValue={maxValue} maxBinValue={0} />
        </MapKeyWrapper>
      )}
      {(memberOption || memberTargetOption) && (
        <MapOptions>
          {memberTargetOption && (
            <MapMemberOption option={memberTargetOption} />
          )}
          {memberOption && (
            <MapMemberOption option={memberOption} />
          )}
        </MapOptions>
      )}
    </Styled>
  );
}

ActorMap.propTypes = {
  actor: PropTypes.instanceOf(Map), // the current actor (ie country)
  actions: PropTypes.instanceOf(Map), // the current actor (ie country)
  actionsAsMember: PropTypes.instanceOf(Map), // the current actor (ie country)
  countries: PropTypes.instanceOf(Map), // all countries needed for indirect connections
  memberships: PropTypes.instanceOf(Map), // all countries needed for indirect connections
  onSetIncludeActorMembers: PropTypes.func,
  onSetIncludeTargetMembers: PropTypes.func,
  includeActorMembers: PropTypes.bool,
  includeTargetMembers: PropTypes.bool,
  hasMemberOption: PropTypes.bool,
  actiontypeHasTarget: PropTypes.bool,
  actorCanBeMember: PropTypes.bool,
  onEntityClick: PropTypes.func,
  mapSubject: PropTypes.string,
  actiontypeId: PropTypes.string,
};

const mapStateToProps = (state) => ({
  countries: selectActortypeActors(state, { type: ACTORTYPES.COUNTRY }),
  includeActorMembers: selectIncludeActorMembers(state),
  includeTargetMembers: selectIncludeTargetMembers(state),
  memberships: selectMembershipsGroupedByAssociation(state),
});
function mapDispatchToProps(dispatch) {
  return {
    onSetIncludeTargetMembers: (active) => {
      dispatch(setIncludeTargetMembers(active));
    },
    onSetIncludeActorMembers: (active) => {
      dispatch(setIncludeActorMembers(active));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ActorMap);
