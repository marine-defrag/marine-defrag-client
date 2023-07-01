/*
 *
 * MapControl
 *
 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled, { css } from 'styled-components';
import { Box, Text } from 'grommet';

import * as topojson from 'topojson-client';
// import { FormattedMessage } from 'react-intl';

import countriesTopo from 'data/ne_countries_10m_v5.topo.json';
import countryPointJSON from 'data/country-points.json';

import {
  setMapLoaded,
  setMapTooltips,
  setMapView,
} from 'containers/App/actions';
import {
  selectMapTooltips,
  selectPrintConfig,
  selectMapView,
} from 'containers/App/selectors';
import { usePrint } from 'containers/App/PrintContext';

// import appMessages from 'containers/App/messages';
// import { hasGroupActors } from 'utils/entities';
// import SimpleMapContainer from './SimpleMapContainer';
import MapWrapperLeaflet from './MapWrapperLeaflet';
import MapOption from './MapInfoOptions/MapOption';
import MapKey from './MapInfoOptions/MapKey';
import MapInfoOptions from './MapInfoOptions';
// import messages from './messages';

const Styled = styled(
  React.forwardRef((p, ref) => <Box {...p} ref={ref} />)
)`
  z-index: 0;
  @media print {
    page-break-inside: avoid;
    break-inside: avoid;
  }
`;
// position: relative;
const MapTitle = styled((p) => <Box margin={{ vertical: 'xsmall' }} {...p} />)``;
const MapOptions = styled((p) => <Box margin={{ horizontal: 'medium' }} {...p} />)`
  ${({ isPrint }) => isPrint && css`margin-left: 0`};
  @media print {
    margin-left: 0;
  }
`;
const MapKeyWrapper = styled((p) => (
  <Box margin={{ horizontal: 'medium', top: 'xsmall', bottom: 'small' }} {...p} />
))`
  ${({ padLeft }) => !padLeft && css`margin-left: 0`};
  max-width: 400px;
`;
const getMapContainer = (fullMap) => fullMap
  ? styled.div``
  : styled((p) => <Box margin={{ horizontal: 'medium' }} {...p} />)`
    ${({ isPrint }) => isPrint && css`margin-left: 0;`}
    ${({ isPrint }) => isPrint && css`margin-right: 0;`}
    position: relative;
    overflow: hidden;
    padding-top: ${({ isPrint, orient }) => (isPrint && orient) === 'landscape' ? '50%' : '56.25%'};
    @media print {
      margin-left: 0;
      margin-right: 0;
      display: block;
      page-break-inside: avoid;
      break-inside: avoid;
    }
  `;

// height: ${({ w, orient }) => (orient) === 'landscape' ? w * 0.5 : w * 0.5625}px;

export function MapControl({
  mapKey = {},
  mapInfo,
  mapOptions = [],
  mapData = {},
  onActorClick,
  reducePoints,
  reduceCountryAreas,
  fullMap,
  onSetMapLoaded,
  mapTooltips,
  onSetMapTooltips,
  printArgs,
  mapView,
  onSetMapView,
  mapViewLocal,
  onSetMapViewLocal,
  // intl,
}) {
  const {
    indicator,
    indicatorPoints,
    mapId,
    projection,
    mapSubject,
    circleLayerConfig,
    hasPointOption,
    hasPointOverlay,
    fitBounds,
    fitBoundsData,
    typeLabels,
    includeSecondaryMembers,
    scrollWheelZoom,
  } = mapData;
  const {
    keyTitle,
    isIndicator,
    unit,
    maxBinValue,
  } = mapKey;
  const [showAsPoint, setShowAsPoint] = useState(false);

  const countriesJSON = topojson.feature(
    countriesTopo,
    Object.values(countriesTopo.objects)[0],
  );

  let countryData = null;
  let countryPointData = null;
  let locationData = null;
  let maxValue;
  let minValue;
  const minMaxValues = { points: null, countries: null };

  const showPointsOnly = hasPointOption && showAsPoint;
  if (
    reducePoints
    && indicatorPoints
    && indicatorPoints !== '0'
    && (hasPointOverlay || showPointsOnly)
  ) {
    const ffUnit = unit || circleLayerConfig.unit || '';
    const isPercentage = ffUnit.indexOf('%') > -1;
    locationData = reducePoints && reducePoints();

    [maxValue, minValue] = locationData && locationData.reduce(
      ([max, min], feature) => {
        if (!feature || !feature.values) {
          return [max, min];
        }
        return ([
          max !== null ? Math.max(max, feature.values[indicatorPoints]) : feature.values[indicatorPoints],
          min !== null ? Math.min(min, feature.values[indicatorPoints]) : feature.values[indicatorPoints],
        ]);
      },
      [isPercentage ? 100 : null, null],
    );

    minMaxValues.points = {
      max: maxValue,
      min: minValue,
    };
  }
  if (
    reduceCountryAreas
    && indicator
    && !showPointsOnly
  ) {
    countryData = reduceCountryAreas && reduceCountryAreas(countriesJSON.features);
    countryPointData = reduceCountryAreas && reduceCountryAreas(countryPointJSON.features);

    [maxValue, minValue] = countryData
      ? countryData.reduce(
        ([max, min], feature) => ([
          max !== null ? Math.max(max, feature.values[indicator]) : feature.values[indicator],
          min !== null ? Math.min(min, feature.values[indicator]) : feature.values[indicator],
        ]),
        [null, null],
      )
      : [0, 0];
    minMaxValues.countries = {
      max: maxValue,
      min: minValue,
    };
  }

  let allMapOptions = mapOptions;
  if (hasPointOption) {
    allMapOptions = [
      {
        active: showAsPoint,
        onClick: () => setShowAsPoint(!showAsPoint),
        label: 'Show as circles',
        printHide: true,
        key: 'circle',
      },
      ...mapOptions,
    ];
  }
  // const ref = useRef();
  const isPrintView = usePrint();
  const MapContainer = getMapContainer(fullMap);
  // const ref = React.useRef();
  return (
    <Styled>
      <MapContainer
        isPrint={isPrintView}
        orient={printArgs && printArgs.printOrientation}
      >
        <MapWrapperLeaflet
          printArgs={printArgs}
          isPrintView={isPrintView}
          countryData={countryData}
          countryPointData={countryPointData}
          locationData={locationData}
          countryFeatures={countriesJSON.features}
          indicator={indicator}
          mapSubject={mapSubject}
          scrollWheelZoom={scrollWheelZoom}
          typeLabels={typeLabels}
          includeSecondaryMembers={includeSecondaryMembers}
          maxValueCountries={minMaxValues
            && minMaxValues.countries
            ? minMaxValues.countries.max
            : null
          }
          circleLayerConfig={{
            ...circleLayerConfig,
            rangeMax: minMaxValues && minMaxValues.points && minMaxValues.points.max,
          }}
          fitBounds={fitBounds}
          fitBoundsToCountryOverlay={fitBoundsData}
          fullMap={fullMap}
          projection={projection}
          mapId={mapId}
          hasInfo={mapInfo && mapInfo.length > 0}
          mapTooltips={mapTooltips}
          mapView={mapViewLocal || (fullMap ? mapView : null)}
          setMapLoaded={onSetMapLoaded}
          setMapTooltips={onSetMapTooltips}
          onSetMapView={(view) => {
            if (onSetMapViewLocal) {
              onSetMapViewLocal(view);
            } else if (fullMap) {
              onSetMapView(view, mapId, mapView);
            }
          }}
          onActorClick={(id) => onActorClick(id)}
        />
      </MapContainer>
      {mapInfo && mapInfo.length > 0 && (
        <MapInfoOptions
          isPrintView={isPrintView}
          options={mapInfo}
          minMaxValues={minMaxValues}
          countryMapSubject={mapSubject}
          circleLayerConfig={circleLayerConfig}
        />
      )}
      {mapKey && Object.keys(mapKey).length > 0 && (
        <MapOptions isPrint={isPrintView}>
          <MapTitle>
            <Text weight={600}>{keyTitle}</Text>
          </MapTitle>
          <MapKeyWrapper padLeft={!showAsPoint}>
            <MapKey
              isPrint={isPrintView}
              mapSubject={mapSubject}
              maxValue={maxValue}
              minValue={minValue}
              maxBinValue={maxBinValue}
              isIndicator={isIndicator}
              type={hasPointOption && showAsPoint ? 'circles' : 'gradient'}
              unit={unit}
              circleLayerConfig={circleLayerConfig}
            />
          </MapKeyWrapper>
        </MapOptions>
      )}
      {allMapOptions && allMapOptions.length > 0 && (
        <MapOptions isPrint={isPrintView}>
          {allMapOptions.map(
            (option, id) => (
              <MapOption
                key={id}
                option={option}
                type={option.type}
              />
            )
          )}
        </MapOptions>
      )}
    </Styled>
  );
}

MapControl.propTypes = {
  onActorClick: PropTypes.func,
  reducePoints: PropTypes.func,
  reduceCountryAreas: PropTypes.func,
  onSetMapLoaded: PropTypes.func,
  onSetMapTooltips: PropTypes.func,
  onSetMapView: PropTypes.func,
  onSetMapViewLocal: PropTypes.func,
  printArgs: PropTypes.object,
  mapData: PropTypes.object,
  mapView: PropTypes.object,
  mapViewLocal: PropTypes.object,
  mapKey: PropTypes.object,
  mapInfo: PropTypes.array,
  mapOptions: PropTypes.array,
  mapTooltips: PropTypes.array,
  fullMap: PropTypes.bool,
};

const mapStateToProps = (state, { mapData }) => ({
  mapTooltips: selectMapTooltips(state, mapData && mapData.mapId),
  mapView: selectMapView(state, mapData && mapData.mapId),
  printArgs: selectPrintConfig(state),
});

function mapDispatchToProps(dispatch) {
  return {
    onSetMapLoaded: (mapId) => {
      dispatch(setMapLoaded(mapId));
    },
    onSetMapTooltips: (items, mapId) => {
      dispatch(setMapTooltips(items, mapId));
    },
    onSetMapView: (view, mapId) => {
      dispatch(setMapView(view, mapId));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MapControl);
