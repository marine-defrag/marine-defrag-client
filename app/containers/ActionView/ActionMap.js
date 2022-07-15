/*
 *
 * ActionMap
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
  selectIncludeActorChildren,
  selectIncludeTargetChildren,
} from 'containers/App/selectors';

import {
  setIncludeActorMembers,
  setIncludeTargetMembers,
  setIncludeActorChildren,
  setIncludeTargetChildren,
} from 'containers/App/actions';


// import appMessages from 'containers/App/messages';
import qe from 'utils/quasi-equals';
// import { hasGroupActors } from 'utils/entities';
import MapContainer from 'containers/MapContainer';
import MapMemberOption from 'containers/MapContainer/MapInfoOptions/MapMemberOption';
import MapChildrenOption from 'containers/MapContainer/MapInfoOptions/MapChildrenOption';

// import messages from './messages';

const Styled = styled((p) => <Box {...p} />)`
  z-index: 0;
`;
const MapTitle = styled((p) => <Box margin={{ vertical: 'xsmall' }} {...p} />)``;
const MapOptions = styled((p) => <Box margin={{ horizontal: 'medium' }} {...p} />)``;
const MapWrapper = styled((p) => <Box margin={{ horizontal: 'medium' }} {...p} />)`
  position: relative;
  height: 400px;
  background: #F9F9FA;
`;

export function ActionMap({
  actorsByType,
  mapSubject,
  onSetIncludeActorMembers,
  onSetIncludeTargetMembers,
  includeActorMembers,
  includeTargetMembers,
  onActorClick,
  countries,
  hasMemberOption,
  onSetIncludeActorChildren,
  onSetIncludeTargetChildren,
  includeActorChildren,
  includeTargetChildren,
  typeId,
  childCountries,
  // intl,
}) {
  // console.log('ActionMap')
  // // const { intl } = this.context;
  // // let type;
  // console.log('childCountries', childCountries && childCountries.toJS());
  const countriesJSON = topojson.feature(
    countriesTopo,
    Object.values(countriesTopo.objects)[0],
  );
  const hasChildCountries = childCountries && childCountries.size > 0;
  let hasCountries;
  let hasAssociations;
  if (actorsByType) {
    hasCountries = actorsByType.get(parseInt(ACTORTYPES.COUNTRY, 10));
    hasAssociations = mapSubject === 'actors'
      ? !!actorsByType.get(parseInt(ACTORTYPES.GROUP, 10))
      : !!(actorsByType.get(parseInt(ACTORTYPES.GROUP, 10)) || actorsByType.get(parseInt(ACTORTYPES.REG, 10)) || actorsByType.get(parseInt(ACTORTYPES.CLASS, 10)));
  }
  if (!hasCountries && !hasAssociations && !hasChildCountries) return null;
  const includeMembers = mapSubject === 'actors'
    ? includeActorMembers
    : includeTargetMembers;
  const includeChildActions = mapSubject === 'actors'
    ? includeActorChildren
    : includeTargetChildren;

  let countryData;
  if (actorsByType || childCountries) {
    const countriesViaMembership = actorsByType && hasMemberOption && includeMembers && hasAssociations && actorsByType.reduce(
      (memo, typeActors, actortypeId) => {
        // skip non group types
        // TODO check actortypes db object
        if (qe(actortypeId, ACTORTYPES.COUNTRY) || qe(actortypeId, ACTORTYPES.ORG)) {
          return memo;
        }
        return memo.concat(typeActors.reduce(
          (memo2, association) => {
            if (association.getIn(['membersByType', ACTORTYPES.COUNTRY])) {
              return memo2.concat(association.getIn(['membersByType', ACTORTYPES.COUNTRY]).toList());
            }
            return memo2;
          },
          List(),
        ));
      },
      List(),
    ).toSet(
    ).map(
      (countryId) => countries.get(countryId.toString())
    );

    countryData = countriesJSON.features.reduce(
      (memo, feature) => {
        const countryDirect = hasCountries && actorsByType.get(parseInt(ACTORTYPES.COUNTRY, 10)).find(
          (e) => qe(e.getIn(['attributes', 'code']), feature.properties.ADM0_A3)
        );
        const countryViaChild = !countryDirect
          && includeChildActions
          && childCountries
          && childCountries.find(
            (e) => qe(e.getIn(['attributes', 'code']), feature.properties.ADM0_A3)
          );
        const countryViaMembership = !countryDirect
          && !countryViaChild
          && hasAssociations
          && countriesViaMembership
          && countriesViaMembership.find(
            (e) => qe(e.getIn(['attributes', 'code']), feature.properties.ADM0_A3)
          );
        let opacity = 1;
        if (countryViaChild) {
          opacity = 0.6;
        } else if (countryViaMembership) {
          opacity = 0.3;
        }
        const country = countryDirect || countryViaMembership || countryViaChild;
        if (country) {
          return [
            ...memo,
            {
              ...feature,
              id: country.get('id'),
              attributes: country.get('attributes').toJS(),
              tooltip: {
                id: country.get('id'),
                title: country.getIn(['attributes', 'title']),
              },
              values: {
                actions: 1,
              },
              style: {
                fillOpacity: opacity,
              },
            },
          ];
        }
        return memo;
      },
      [],
    );
  }
  if (!countryData) return null;

  // map title and map options
  let memberOption;
  let childrenOption; // children option
  let mapTitle;
  if (mapSubject === 'targets') {
    mapTitle = qe(ACTIONTYPES.DONOR, typeId)
      ? 'Recipient countries'
      : 'Countries targeted by activity';
    // note this should always be true!
    if (hasMemberOption && hasAssociations) {
      memberOption = {
        active: includeTargetMembers,
        onClick: () => onSetIncludeTargetMembers(includeTargetMembers ? '0' : '1'),
        label: 'Show members of targeted regions, groups or classes',
        key: 'targets',
      };
    }
    // console.log('childCountries', childCountries && childCountries.toJS())
    // console.log('includeTargetChildren', includeTargetChildren)
    if (childCountries) {
      childrenOption = {
        active: includeTargetChildren,
        onClick: () => onSetIncludeTargetChildren(includeTargetChildren ? '0' : '1'),
        label: 'Show countries targeted by child or successor activities',
        key: 'targets',
      };
    }
  }
  if (mapSubject === 'actors') {
    mapTitle = qe(ACTIONTYPES.DONOR, typeId)
      ? 'Donor countries'
      : 'Countries responsible by activity';
    if (hasMemberOption && hasAssociations) {
      memberOption = {
        active: includeActorMembers,
        onClick: () => onSetIncludeActorMembers(includeActorMembers ? '0' : '1'),
        label: 'Show members of group actors',
        key: 'actors',
      };
    }
    // console.log('childCountries', childCountries && childCountries.toJS())
    // console.log('includeActorChildren', includeActorChildren)
    if (childCountries) {
      childrenOption = {
        active: includeActorChildren,
        onClick: () => onSetIncludeActorChildren(includeActorChildren ? '0' : '1'),
        label: 'Show countries responsible for child or successor activities',
        key: 'actors',
      };
    }
  }

  return (
    <Styled hasHeader noOverflow>
      <MapWrapper>
        <MapContainer
          countryData={countryData}
          countryFeatures={countriesJSON.features}
          indicator="actions"
          onActorClick={(id) => onActorClick(id)}
          maxValue={1}
          includeSecondaryMembers={
            includeActorMembers
            || includeTargetMembers
            || includeActorChildren
            || includeTargetChildren
          }
          mapSubject={mapSubject}
          fitBounds
          projection="gall-peters"
          mapId="ll-action-map"
        />
      </MapWrapper>
      {(memberOption || mapTitle || childrenOption) && (
        <MapOptions>
          {mapTitle && (
            <MapTitle>
              <Text weight={600}>{mapTitle}</Text>
            </MapTitle>
          )}
          {memberOption && (
            <MapMemberOption option={memberOption} />
          )}
          {childrenOption && (
            <MapChildrenOption option={childrenOption} />
          )}
        </MapOptions>
      )}
    </Styled>
  );
}

ActionMap.propTypes = {
  actorsByType: PropTypes.instanceOf(Map), // actors by actortype for current action
  childCountries: PropTypes.instanceOf(Map), // actors by actortype for current action
  countries: PropTypes.instanceOf(Map), // all countries needed for indirect connections
  onSetIncludeActorMembers: PropTypes.func,
  onSetIncludeTargetMembers: PropTypes.func,
  includeActorMembers: PropTypes.bool,
  includeTargetMembers: PropTypes.bool,
  hasMemberOption: PropTypes.bool,
  onSetIncludeActorChildren: PropTypes.func,
  onSetIncludeTargetChildren: PropTypes.func,
  includeActorChildren: PropTypes.bool,
  includeTargetChildren: PropTypes.bool,
  onActorClick: PropTypes.func,
  mapSubject: PropTypes.string,
  typeId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};

const mapStateToProps = (state) => ({
  countries: selectActortypeActors(state, { type: ACTORTYPES.COUNTRY }),
  includeActorMembers: selectIncludeActorMembers(state),
  includeTargetMembers: selectIncludeTargetMembers(state),
  includeActorChildren: selectIncludeActorChildren(state),
  includeTargetChildren: selectIncludeTargetChildren(state),
});
function mapDispatchToProps(dispatch) {
  return {
    onSetIncludeTargetMembers: (active) => {
      dispatch(setIncludeTargetMembers(active));
    },
    onSetIncludeActorMembers: (active) => {
      dispatch(setIncludeActorMembers(active));
    },
    onSetIncludeTargetChildren: (active) => {
      dispatch(setIncludeTargetChildren(active));
    },
    onSetIncludeActorChildren: (active) => {
      dispatch(setIncludeActorChildren(active));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionMap);
