/*
 *
 * IndicatorCountryMap
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';


// import appMessages from 'containers/App/messages';
import qe from 'utils/quasi-equals';
// import { hasGroupActors } from 'utils/entities';
import MapContainer from 'containers/MapContainer';
import TooltipContent from 'containers/MapContainer/TooltipContent';

import countryPointsJSON from 'data/country-points.json';

export function IndicatorCountryMap({
  countries,
  mapSubject,
  onCountryClick,
  indicator,
  // intl,
}) {
  if (!countries) return null;

  const reducePoints = () => countryPointsJSON.features.reduce(
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
  const reduceCountryAreas = (features) => features.reduce(
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

  // comment stores unit
  const keyTitle = indicator.getIn(['attributes', 'comment'])
    ? `${indicator.getIn(['attributes', 'title'])} [${indicator.getIn(['attributes', 'comment']).trim()}]`
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
  // indicator.getIn(['attributes', 'comment'])
  // && indicator.getIn(['attributes', 'comment']).indexOf('%') === -1;
  return (
    <MapContainer
      mapId="ll-indicator-country-map"
      mapKey={{
        keyTitle,
        isIndicator: true,
        unit: indicator.getIn(['attributes', 'comment']).trim(),
        maxBinValue: 0,
      }}
      mapData={{
        countries,
        indicator: 'indicator',
        indicatorPoints: 'indicator',
        mapId: 'll-indicator-country-map',
        projection: 'robinson',
        mapSubject,
        circleLayerConfig: config,
        fitBounds: true,
        hasPointOption: true,
      }}
      mapOptions={[]}
      onActorClick={(id) => onCountryClick(id)}
      reducePoints={reducePoints}
      reduceCountryAreas={reduceCountryAreas}
    />
  );
}

IndicatorCountryMap.propTypes = {
  indicator: PropTypes.instanceOf(Map), // the action
  countries: PropTypes.instanceOf(Map), // actors by actortype for current action
  onCountryClick: PropTypes.func,
  mapSubject: PropTypes.string,
};

// const mapStateToProps = (state) => ({
//   countries: selectActortypeActors(state, { type: ACTORTYPES.COUNTRY }),
// });

export default IndicatorCountryMap;
