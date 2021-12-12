/*
 *
 * EntitiesMap
 *
 */
import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { scaleLinear } from 'd3-scale';
import L from 'leaflet';

const Styled = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background: white;
`;

const MAP_OPTIONS = {
  CENTER: [20, 0],
  ZOOM: {
    INIT: 2,
    MIN: 1,
    MAX: 7,
  },
  BOUNDS: {
    N: 85,
    W: -270,
    S: -85,
    E: 540,
  },
};

const DEFAULT_STYLE = {
  weight: 1,
  color: '#BBC3CD',
  fillOpacity: 1,
};

const NO_DATA_COLOR = '#E2E2E2';

const scaleColorCount = (max) => scaleLinear()
  .domain([1, max])
  .range(['#CAE0F7', '#164571']);

export function MapContainer({
  countryFeatures,
}) {
  const mapRef = useRef(null);
  const countryLayerGroupRef = useRef(null);
  const mapEvents = {
    // resize: () => {
    //   // console.log('resize')
    //   setTooltip(null);
    // },
    // click: () => {
    //   // console.log('mapClick')
    //   setTooltip(null);
    // },
    // zoomstart: () => {
    //   // console.log('zoomstart')
    //   setTooltip(null);
    // },
    // movestart: () => {
    //   // console.log('movestart')
    //   setTooltip(null);
    // },
    // layeradd: () => {
    //   // console.log('layerAdd', layer)
    //   // setTooltip(null)
    // },
    // layerremove: () => {
    //   // console.log('layerremove', layer)
    //   // setTooltip(null)
    // },
  };
  useEffect(() => {
    mapRef.current = L.map('ll-map', {
      // center: MAP_OPTIONS.CENTER,
      // zoom: size === 'small' ? MAP_OPTIONS.ZOOM.MIN : MAP_OPTIONS.ZOOM.INIT,
      zoomControl: false,
      minZoom: MAP_OPTIONS.ZOOM.MIN,
      maxZoom: MAP_OPTIONS.ZOOM.MAX,
      maxBounds: [
        [MAP_OPTIONS.BOUNDS.N, MAP_OPTIONS.BOUNDS.W],
        [MAP_OPTIONS.BOUNDS.S, MAP_OPTIONS.BOUNDS.E],
      ],
      attributionControl: false,
    }).on(mapEvents);
    countryLayerGroupRef.current = L.layerGroup();
    countryLayerGroupRef.current.addTo(mapRef.current);
    //
    // mapRef.current.on('zoomend', () => {
    //   setZoom(mapRef.current.getZoom());
    // });
    // mapRef.current.on('moveend', () => {
    //   onMapMove(getNWSE(mapRef.current));
    // });
    mapRef.current.setView(
      MAP_OPTIONS.CENTER,
      MAP_OPTIONS.ZOOM.INIT,
    );
  }, []);
  // add countryFeatures
  useEffect(() => {
    if (countryFeatures) {
      const maxValue = countryFeatures.reduce((memo, f) => {
        if (!memo) return f.values.count;
        return Math.max(memo, f.values.count);
      }, null);
      const scale = scaleColorCount(maxValue);
      countryLayerGroupRef.current.clearLayers();
      const jsonLayer = L.geoJSON(
        countryFeatures,
        {
          style: (f) => ({
            ...DEFAULT_STYLE,
            fillColor: f.values && f.values.count && f.values.count > 0
              ? scale(f.values.count)
              : NO_DATA_COLOR,
          }),
        },
      );
      countryLayerGroupRef.current.addLayer(jsonLayer);
    }
  }, [countryFeatures]);

  return (
    <Styled id="ll-map" />
  );
}

MapContainer.propTypes = {
  countryFeatures: PropTypes.array,
};

export default MapContainer;
