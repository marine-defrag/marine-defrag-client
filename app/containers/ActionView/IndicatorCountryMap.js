/*
 *
 * IndicatorCountryMap
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
import countryPointsJSON from 'data/country-points.json';

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

export function IndicatorCountryMap({
  countries,
  mapSubject,
  onCountryClick,
  indicator,
  showAsPoint = false,
  // intl,
}) {
  // \\const [showAsPoint, setShowAsPoint] = useState(false)
  // const { intl } = this.context;
  // let type;
  // const indicatorCountries = entities.get(parseInt(ACTORTYPES.COUNTRY, 10));
  let countryData;
  let locationData;
  let maxValue;
  let minValue;
  if (countries) {
    const countriesJSON = topojson.feature(
      countriesTopo,
      Object.values(countriesTopo.objects)[0],
    );

    if (showAsPoint) {
      locationData = countryPointsJSON.features.reduce(
        (memo, feature) => {
          const country = countries.find(
            (c) => qe(c.getIn(['attributes', 'code']), feature.properties.code)
          );
          if (country) {
            const value = country.getIn(['actionValues', indicator.get('id')]);
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
                id: country.get('id'),
                attributes: country.get('attributes').toJS(),
                tooltip: {
                  id: country.get('id'),
                  title: country.getIn(['attributes', 'title']),
                  content: <TooltipContent stats={stats} />,
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
      [maxValue, minValue] = locationData && locationData.reduce(
        ([max, min], feature) => ([
          max !== null ? Math.max(max, feature.values.indicator) : feature.values.indicator,
          min !== null ? Math.min(min, feature.values.indicator) : feature.values.indicator,
        ]),
        [null, null],
      );
    } else {
      countryData = countriesJSON.features.reduce(
        (memo, feature) => {
          const country = countries.find(
            (c) => qe(c.getIn(['attributes', 'code']), feature.properties.ADM0_A3)
          );
          if (country) {
            const value = country.getIn(['actionValues', indicator.get('id')]);
            if (!value && value !== 0) {
              return memo;
            }
            const stats = [
              {
                values: [
                  {
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
                id: country.get('id'),
                attributes: country.get('attributes').toJS(),
                tooltip: {
                  id: country.get('id'),
                  title: country.getIn(['attributes', 'title']),
                  content: <TooltipContent stats={stats} />,
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
      [maxValue, minValue] = countryData && countryData.reduce(
        ([max, min], feature) => ([
          max !== null ? Math.max(max, feature.values.indicator) : feature.values.indicator,
          min !== null ? Math.min(min, feature.values.indicator) : feature.values.indicator,
        ]),
        [null, null],
      );
    }

    // comment stores unit
    const keyTitle = indicator.getIn(['attributes', 'comment'])
      ? `${indicator.getIn(['attributes', 'title'])} (${indicator.getIn(['attributes', 'comment'])})`
      : indicator.getIn(['attributes', 'title']);

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
            countryData={countryData}
            locationData={locationData}
            countryFeatures={countriesJSON.features}
            indicator="indicator"
            onActorClick={(id) => onCountryClick(id)}
            maxValue={maxValue}
            mapSubject={mapSubject}
            fitBounds
            projection="robinson"
            mapId="ll-indicator-country-map"
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
            maxBinValue={0}
            isIndicator
            type={showAsPoint ? 'circles' : 'gradient'}
            unit={indicator.getIn(['attributes', 'comment'])}
            config={config}
          />
        </MapKeyWrapper>
      </Styled>
    );
  }
  return null;
}

IndicatorCountryMap.propTypes = {
  indicator: PropTypes.instanceOf(Map), // the action
  countries: PropTypes.instanceOf(Map), // actors by actortype for current action
  onCountryClick: PropTypes.func,
  mapSubject: PropTypes.string,
  showAsPoint: PropTypes.bool,
};

// const mapStateToProps = (state) => ({
//   countries: selectActortypeActors(state, { type: ACTORTYPES.COUNTRY }),
// });

export default IndicatorCountryMap;
