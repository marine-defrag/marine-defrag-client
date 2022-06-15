/*
 *
 * IndicatorLocationMap
 *
 */
import React from 'react';
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
import MapContainer from 'containers/MapContainer';
import TooltipContent from 'containers/MapContainer/TooltipContent';
import MapKey from 'containers/MapContainer/MapInfoOptions/MapKey';
const MapKeyWrapper = styled((p) => <Box margin={{ horizontal: 'medium', vertical: 'xsmall' }} {...p} />)`
  max-width: 400px;
`;
// import messages from './messages';

const Styled = styled((p) => <Box {...p} />)`
  z-index: 0;
`;
const MapTitle = styled((p) => <Box margin={{ horizontal: 'medium', vertical: 'xsmall' }} {...p} />)``;
const MapWrapper = styled((p) => <Box margin={{ horizontal: 'medium' }} {...p} />)`
  position: relative;
  height: 500px;
`;

export function IndicatorLocationMap({
  locations,
  mapSubject,
  indicator,
  // intl,
}) {
  // const { intl } = this.context;
  // let type;
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
                title: location.getIn(['attributes', 'title']),
                content: (
                  <TooltipContent
                    stats={stats}
                  />
                ),
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
      ? `${indicator.getIn(['attributes', 'title'])} (${indicator.getIn(['attributes', 'comment'])})`
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
        <MapTitle>
          <Text weight={600}>{indicator.getIn(['attributes', 'title'])}</Text>
        </MapTitle>
        <MapWrapper>
          <MapContainer
            locationData={locationData}
            countryFeatures={countriesJSON.features}
            indicator="indicator"
            maxValue={maxValue}
            mapSubject={mapSubject}
            fitBounds
            projection="robinson"
            layerConfig={config}
          />
        </MapWrapper>
        <MapKeyWrapper>
          <Box margin={{ bottom: 'xsmall' }}>
            <Text size="small">{keyTitle}</Text>
          </Box>
          <MapKey
            mapSubject={mapSubject}
            maxValue={maxValue}
            minValue={minValue}
            isIndicator
            type="circles"
            config={config}
          />
        </MapKeyWrapper>
      </Styled>
    );
  }
  return (<div> WIP Location Map </div>);
}

IndicatorLocationMap.propTypes = {
  indicator: PropTypes.instanceOf(Map), // the action
  locations: PropTypes.instanceOf(Map), // actors by actortype for current action
  mapSubject: PropTypes.string,
};

// const mapStateToProps = (state) => ({
//   countries: selectActortypeActors(state, { type: ACTORTYPES.COUNTRY }),
// });

export default IndicatorLocationMap;
