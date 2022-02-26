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
import { Box } from 'grommet';

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
// import messages from './messages';

const Styled = styled((p) => <Box {...p} />)`
  z-index: 0;
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
  // intl,
}) {
  // const { intl } = this.context;
  // let type;
  const countriesJSON = topojson.feature(
    countriesTopo,
    Object.values(countriesTopo.objects)[0],
  );
  // console.log('viewSubject', viewSubject)
  // console.log('mapSubject', mapSubject)
  // console.log('hasMemberOption', hasMemberOption)
  // console.log('actions', actions && actions.toJS())
  // console.log('actionsAsMember', actionsAsMember && actionsAsMember.toJS());
  let countriesActionCount;
  const actorName = actor.getIn(['attributes', 'title']);
  let memberOption;
  let memberTargetOption;
  let mapTitle;
  // showing targets (actor is acting)
  if (mapSubject === 'targets' && actiontypeHasTarget) {
    if (hasMemberOption) {
      mapTitle = `Who (else) is targeted by activities of ${actorName}?`;
      memberOption = {
        active: includeActorMembers,
        onClick: () => onSetIncludeActorMembers(includeActorMembers ? '0' : '1'),
        label: `Include activities of groups ${actorName} belongs to`,
        key: 'am',
      };
      memberTargetOption = {
        active: includeTargetMembers,
        onClick: () => onSetIncludeTargetMembers(includeTargetMembers ? '0' : '1'),
        label: 'Show member countries of targeted regions, groups, classes',
        key: 'tm',
      };
    }
    // explicit targets directly targeted by actor
    // stored in actions
    // direct/direct
    // Map({
    //  [countryId]: count
    // })
    countriesActionCount = actions && actions.reduce(
      (memo, action) => {
        if (action.get('targetsByType')) {
          return action.get('targetsByType').reduce(
            (memo2, targettypeTargets, targettypeId) => {
              if (qe(targettypeId, ACTORTYPES.COUNTRY)) {
                return targettypeTargets.reduce(
                  (memo3, countryId) => {
                    if (memo3.get(countryId)) {
                      return memo3.set(countryId, memo3.get(countryId).push(action.get('id')));
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
                              return memo4.set(memberId, memo4.get(memberId).push(action.get('id')));
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
    if (includeActorMembers) {
      // explicit targets indirectly targeted by actor
      // stored in actionsAsMember
      // direct/indirect
      // xTargetCountriesAsMember = null;
      // grouped by actortype (>> flatten) and group actor
      // TODO consider prepping in index
      // TODO make sure activities are not counted double!!!
      countriesActionCount = actionsAsMember && actionsAsMember.flatten(1).reduce(
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
                        return memo3.set(countryId, memo3.get(countryId).push(action.get('id')));
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
                                return memo4.set(memberId, memo4.get(memberId).push(action.get('id')));
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

    // indirect targets directly targeted by actor
    // stored in actions
    // indirect/direct

    // indirect targets indirectly targeted by actor
    // stored in actionsAsMember
    // indirect/indirect
  }
  if (mapSubject === 'actors' || (mapSubject === 'targets' && !actiontypeHasTarget)) {
    if (hasMemberOption) {
      if (mapSubject === 'actors') { // viewSubject === 'targets'
        mapTitle = `Who is responsible for activities targeting ${actorName}?`;
        memberTargetOption = {
          active: includeTargetMembers,
          onClick: () => onSetIncludeTargetMembers(includeTargetMembers ? '0' : '1'),
          label: `Include activities targeting ${actorName} indirectly via a region, group or class`,
          key: 'tm',
        };
        memberOption = {
          active: includeActorMembers,
          onClick: () => onSetIncludeActorMembers(includeActorMembers ? '0' : '1'),
          label: `Show member countries of groups targeting ${actorName}`,
          key: 'am',
        };
      }
      if (mapSubject === 'targets' && !actiontypeHasTarget) {
        if (!qe(actiontypeId, ACTIONTYPES.NATL)) {
          mapTitle = 'Who is participating?'; // '${actorName}`; // regional strategies, intl frameworks
          memberOption = {
            active: includeActorMembers,
            onClick: () => onSetIncludeActorMembers(includeActorMembers ? '0' : '1'),
            label: `Include activities of groups ${actorName} belongs to`,
          };
        }
      }
    }
    // showing actors (actor is target or responsible for actions without target)
    // countries directly targeting actor explicitly
    // stored in actions
    // direct/direct
    // xCountries = null;
    countriesActionCount = actions && actions.reduce(
      (memo, action) => {
        if (action.get('actorsByType')) {
          return action.get('actorsByType').reduce(
            (memo2, actortypeActors, actortypeId) => {
              if (qe(actortypeId, ACTORTYPES.COUNTRY)) {
                return actortypeActors.reduce(
                  (memo3, countryId) => {
                    if (memo3.get(countryId)) {
                      return memo3.set(countryId, memo3.get(countryId).push(action.get('id')));
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
                              return memo4.set(memberId, memo4.get(memberId).push(action.get('id')));
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
    if (includeTargetMembers) {
      // countries directly targeting actor via actor's membership in group, class, region
      // stored in actionsAsMember
      // direct/indirect
      // grouped by actortype (>> flatten) and group actor
      // TODO consider prepping in index
      if (mapSubject === 'actors' && actionsAsMember) {
        countriesActionCount = actionsAsMember && actionsAsMember.flatten(1).reduce(
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
                (memo2, targettypeTargets, targettypeId) => {
                  if (qe(targettypeId, ACTORTYPES.COUNTRY)) {
                    return targettypeTargets.reduce(
                      (memo3, countryId) => {
                        if (memo3.get(countryId)) {
                          return memo3.set(countryId, memo3.get(countryId).push(action.get('id')));
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
                                  return memo4.set(memberId, memo4.get(memberId).push(action.get('id')));
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
      if (mapSubject === 'targets' && actionsAsMember && includeActorMembers) {
        countriesActionCount = actionsAsMember && actionsAsMember.flatten(1).reduce(
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
                (memo2, targettypeTargets, targettypeId) => {
                  if (qe(targettypeId, ACTORTYPES.COUNTRY)) {
                    return targettypeTargets.reduce(
                      (memo3, countryId) => {
                        if (memo3.get(countryId)) {
                          return memo3.set(countryId, memo3.get(countryId).push(action.get('id')));
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
                                  return memo4.set(memberId, memo4.get(memberId).push(action.get('id')));
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
    // countries indirectly targeting actor explicitly (via countries' groups)
    // stored in actions
    // indirect/direct

    // countries indirectly targeting actor via actor's membership in group, class, region (via countries' groups)
    // stored in actionsAsMember
    // indirect/indirect
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
  // console.log(countriesActionCount && countriesActionCount)
  // TODO remove duplicates
  const maxValue = countriesActionCount && countriesActionCount.reduce(
    (max, actionList) => Math.max(max, actionList.size),
    0,
  );
  return (
    <Styled hasHeader noOverflow>
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
        />
      </MapWrapper>
      {(mapTitle || memberOption || memberTargetOption) && (
        <MapOptions>
          <Box>
            <strong>{mapTitle}</strong>
          </Box>
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
