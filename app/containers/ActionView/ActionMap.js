/*
 *
 * ActionMap
 *
 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Map, List } from 'immutable';
import { connect } from 'react-redux';
import styled, { css } from 'styled-components';
import { Box, Text } from 'grommet';

import * as topojson from 'topojson-client';
// import { FormattedMessage } from 'react-intl';

import countriesTopo from 'data/ne_countries_10m_v5.topo.json';
import countryPointsJSON from 'data/country-points.json';

import { ACTORTYPES, ACTIONTYPES } from 'themes/config';

import { usePrint } from 'containers/App/PrintContext';

import {
  selectActortypeActors,
  selectIncludeActorMembers,
  selectIncludeTargetMembers,
  selectIncludeActorChildren,
  selectIncludeTargetChildren,
  selectPrintConfig,
  // selectMapTooltips,
} from 'containers/App/selectors';

import {
  setIncludeActorMembers,
  setIncludeTargetMembers,
  setIncludeActorChildren,
  setIncludeTargetChildren,
  // setMapTooltips,
} from 'containers/App/actions';


// import appMessages from 'containers/App/messages';
import qe from 'utils/quasi-equals';
// import { hasGroupActors } from 'utils/entities';
import MapWrapperLeaflet from 'containers/MapControl/MapWrapperLeaflet';
import SimpleMapContainer from 'containers/MapControl/SimpleMapContainer';
import MapOption from 'containers/MapControl/MapInfoOptions/MapOption';

// import messages from './messages';

const Styled = styled((p) => <Box {...p} />)`
  z-index: 0;
  position: relative;
  @media print {
    page-break-inside: avoid;
    break-inside: avoid;
  }
`;
const MapTitle = styled((p) => <Box margin={{ vertical: 'xsmall' }} {...p} />)`
  ${({ isPrint }) => isPrint && css`margin-left: 0`};
@media print {
    margin-left: 0;
  }
`;
const MapOptions = styled((p) => <Box margin={{ horizontal: 'medium' }} {...p} />)`
  ${({ isPrint }) => isPrint && css`margin-left: 0`};
  @media print {
    margin-left: 0;
  }
`;
// const MapContainer = styled((p) => <Box margin={{ horizontal: 'medium' }} {...p} />)`
//   ${({ isPrint }) => isPrint && css`margin-left: 0;`}
//   position: relative;
//   background: #F9F9FA;
//   overflow: hidden;
//   padding-top: ${({ isPrint, orient }) => (isPrint && orient) === 'landscape' ? '50%' : '56.25%'};
//   @media print {
//     margin-left: 0;
//     display: block;
//     page-break-inside: avoid;
//     break-inside: avoid;
//   }
// `;
// const MapSpacer = styled.div`
//   height: ${({ w, orient }) => (orient) === 'landscape' ? w * 0.5 : w * 0.5625}px;
//   display: block;
//   width: 1px;
// `;

/* 16:9 Aspect Ratio (divide 9 by 16 = 0.5625) */
const reduceCountryData = ({
  features,
  hasCountries,
  actorsByType,
  includeChildActions,
  childCountries,
  hasAssociations,
  countriesViaMembership,
}) => features.reduce(
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
  mapId = 'll-action-map',
  // isPrintView,
  printArgs,
  // intl,
}) {
  const [mapTooltips, setMapTooltips] = useState([]);
  const [mapView, setMapView] = useState(null);
  const isPrintView = usePrint();

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
  let countryPointData;

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

    countryData = reduceCountryData({
      features: countriesJSON.features,
      hasCountries,
      actorsByType,
      includeChildActions,
      childCountries,
      hasAssociations,
      countriesViaMembership,
    });

    countryPointData = reduceCountryData({
      features: countryPointsJSON.features,
      hasCountries,
      actorsByType,
      includeChildActions,
      childCountries,
      hasAssociations,
      countriesViaMembership,
    });
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
  // <MapSpacer
  // isPrint={isPrintView}
  // w={ref && ref.current && ref.current.clientWidth}
  // orient={printArgs && printArgs.printOrientation}
  // />
  // const ref = useRef();
  // w={ref && ref.current && ref.current.clientWidth}
  return (
    <Styled>
      <SimpleMapContainer
        orient={printArgs && printArgs.printOrientation}
      >
        <MapWrapperLeaflet
          printArgs={printArgs}
          isPrintView={isPrintView}
          countryData={countryData}
          countryPointData={countryPointData}
          countryFeatures={countriesJSON.features}
          indicator="actions"
          mapSubject={mapSubject}
          maxValueCountries={1}
          fitBoundsToCountryOverlay
          projection="gall-peters"
          includeSecondaryMembers={
            includeActorMembers
            || includeTargetMembers
            || includeActorChildren
            || includeTargetChildren
          }
          mapId={mapId}
          mapView={mapView}
          mapTooltips={mapTooltips}
          setMapTooltips={setMapTooltips}
          onSetMapView={setMapView}
          onActorClick={(id) => onActorClick(id)}
        />
      </SimpleMapContainer>
      {(memberOption || mapTitle || childrenOption) && (
        <MapOptions isPrint={isPrintView}>
          {mapTitle && (
            <MapTitle>
              <Text weight={600}>{mapTitle}</Text>
            </MapTitle>
          )}
          {memberOption && (
            <MapOption option={memberOption} type="member" />
          )}
          {childrenOption && (
            <MapOption option={childrenOption} type="children" />
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
  mapId: PropTypes.string,
  typeId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  printArgs: PropTypes.object,
};

const mapStateToProps = (state) => ({
  countries: selectActortypeActors(state, { type: ACTORTYPES.COUNTRY }),
  includeActorMembers: selectIncludeActorMembers(state),
  includeTargetMembers: selectIncludeTargetMembers(state),
  includeActorChildren: selectIncludeActorChildren(state),
  includeTargetChildren: selectIncludeTargetChildren(state),
  printArgs: selectPrintConfig(state),
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
    // onSetMapTooltips: (items, mapId) => {
    //   dispatch(setMapTooltips(items, mapId));
    // },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionMap);
