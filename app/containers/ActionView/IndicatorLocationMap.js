/*
 *
 * IndicatorLocationMap
 *
 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import styled from 'styled-components';
import { Box, Text } from 'grommet';

import * as topojson from 'topojson-client';
// import { FormattedMessage } from 'react-intl';
import countriesTopo from 'data/ne_countries_10m_v5.topo.json';

import locationsJSON from 'data/locations.json';

// import appMessages from 'containers/App/messages';
import qe from 'utils/quasi-equals';
// import { hasGroupActors } from 'utils/entities';
import MapWrapper from 'containers/MapContainer/MapWrapper';
import MapKey from 'containers/MapContainer/MapInfoOptions/MapKey';
const MapKeyWrapper = styled((p) => <Box margin={{ horizontal: 'medium', vertical: 'xsmall' }} {...p} />)`
  max-width: 400px;
`;
// import messages from './messages';

const Styled = styled((p) => <Box {...p} />)`
  z-index: 0;
`;
const MapTitle = styled((p) => <Box margin={{ horizontal: 'medium', vertical: 'xsmall' }} {...p} />)``;
const MapOuterWrapper = styled((p) => <Box margin={{ horizontal: 'medium' }} {...p} />)`
  position: relative;
  padding-top: ${({ isPrint, orient }) => (isPrint && orient) === 'landscape' ? '50%' : '56.25%'};
  overflow: hidden;
  @media print {
    margin-left: 0;
    display: block;
    page-break-inside: avoid;
    break-inside: avoid;
  }
`;

export function IndicatorLocationMap({
  locations,
  mapSubject,
  indicator,
  isPrintView,
  printArgs,
  // intl,
}) {
  // const { intl } = this.context;
  // let type;
  const [mapTooltips, setMapTooltips] = useState([]);
  const [mapView, setMapView] = useState(null);
  const countriesJSON = topojson.feature(
    countriesTopo,
    Object.values(countriesTopo.objects)[0],
  );
  if (locations) {
    const locationData = locationsJSON.features.reduce(
      (memo, feature) => {
        const location = locations.find(
          (c) => qe(c.getIn(['attributes', 'code']), feature.properties.code)
        );
        if (location) {
          const value = location.getIn(['actionValues', indicator.get('id')]);
          if (!value && value !== 0) {
            return memo;
          }
          const stats = [
            {
              values: [
                {
                  label: indicator.getIn(['attributes', 'title']),
                  unit: indicator.getIn(['attributes', 'comment']),
                  value,
                },
              ],
            },
          ];
          return [
            ...memo,
            {
              ...feature,
              id: location.get('id'),
              attributes: location.get('attributes').toJS(),
              tooltip: {
                id: location.get('id'),
                stats,
                linkActor: false,
              },
              values: {
                indicator: parseFloat(value, 10),
              },
            },
          ];
        }
        return memo;
      },
      [],
    );

    // comment stores unit
    const keyTitle = indicator.getIn(['attributes', 'comment'])
      ? `${indicator.getIn(['attributes', 'title'])} [${indicator.getIn(['attributes', 'comment']).trim()}]`
      : indicator.getIn(['attributes', 'title']);
    const [maxValue, minValue] = locationData && locationData.reduce(
      ([max, min], feature) => ([
        max ? Math.max(max, feature.values.indicator) : feature.values.indicator,
        min ? Math.min(min, feature.values.indicator) : feature.values.indicator,
      ]),
      [null, null],
    );

    const config = {
      attribute: 'indicator',
      render: {
        min: 2,
        max: 30,
        exp: 0.5,
      },
      style: {
        color: '#000A40',
        weight: 0.5,
        fillColor: '#000A40',
        fillOpacity: 0.3,
      },
    };

    return (
      <Styled hasHeader noOverflow>
        <MapOuterWrapper
          isPrint={isPrintView}
          orient={printArgs && printArgs.printOrientation}
        >
          <MapWrapper
            locationData={locationData}
            countryFeatures={countriesJSON.features}
            indicator="indicator"
            mapSubject={mapSubject}
            fitBoundsToCountryOverlay
            projection="robinson"
            circleLayerConfig={config}
            mapId="ll-indicator-location-map"
            isLocationData
            mapView={mapView}
            onSetMapView={setMapView}
            mapTooltips={mapTooltips}
            setMapTooltips={setMapTooltips}
          />
        </MapOuterWrapper>
        <MapTitle>
          <Text weight={600}>{keyTitle}</Text>
        </MapTitle>
        <MapKeyWrapper>
          <MapKey
            mapSubject={mapSubject}
            maxValue={maxValue}
            minValue={minValue}
            isIndicator
            type="circles"
            circleLayerConfig={config}
          />
        </MapKeyWrapper>
      </Styled>
    );
  }
  return null;
}

IndicatorLocationMap.propTypes = {
  indicator: PropTypes.instanceOf(Map), // the action
  locations: PropTypes.instanceOf(Map), // actors by actortype for current action
  mapSubject: PropTypes.string,
  isPrintView: PropTypes.bool,
  printArgs: PropTypes.object,
};

// const mapStateToProps = (state) => ({
//   countries: selectActortypeActors(state, { type: ACTORTYPES.COUNTRY }),
// });

export default IndicatorLocationMap;
