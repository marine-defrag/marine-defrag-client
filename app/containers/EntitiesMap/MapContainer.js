/*
 *
 * EntitiesMap
 *
 */
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { scaleLinear } from 'd3-scale';
import L from 'leaflet';

import qe from 'utils/quasi-equals';
import Tooltip from './Tooltip';
import Key from './Key';

const Styled = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background: white;
  z-index: 10;
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
const TOOLTIP_STYLE = {
  weight: 1,
  fillOpacity: 0,
  color: '#666666',
  interactive: false,
};
const OVER_STYLE = {
  weight: 1,
  fillOpacity: 0,
  color: '#AAAAAA',
  interactive: false,
};

const NO_DATA_COLOR = '#E2E2E2';
const RANGE = ['#CAE0F7', '#164571'];

const scaleColorCount = (max) => scaleLinear()
  .domain([1, max])
  .range(RANGE);

export function MapContainer({
  countryFeatures,
  indicator,
  onCountryClick,
  typeLabels,
}) {
  const [tooltip, setTooltip] = useState(null);
  const [featureOver, setFeatureOver] = useState(null);
  const ref = useRef(null);
  const mapRef = useRef(null);
  const countryLayerGroupRef = useRef(null);
  const countryTooltipGroupRef = useRef(null);
  const countryOverGroupRef = useRef(null);
  const mapEvents = {
    // resize: () => {
    //   // console.log('resize')
    //   setTooltip(null);
    // },
    click: () => {
      // console.log('mapClick')
      setTooltip(null);
    },
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
  const onFeatureClick = (e, feature) => {
    if (e && L.DomEvent) L.DomEvent.stopPropagation(e);
    if (e && e.containerPoint && feature && feature.tooltip) {
      setTooltip({
        anchor: e.containerPoint,
        direction: {
          x: 'left',
          y: 'top',
        },
        feature,
      });
    }
  };
  const onFeatureOver = (e, feature) => {
    if (e && L.DomEvent) L.DomEvent.stopPropagation(e);
    if (!e || !feature || feature.id) setFeatureOver(null);
    if (feature && feature.id) setFeatureOver(feature.id);
  };
  // useEffect(() => {
  //   /**
  //    * Alert if clicked on outside of element
  //    */
  //   function handleClickOutside(event) {
  //     console.log(event.target)
  //     // Do nothing if clicking ref's element or descendent elements
  //     if (!ref.current || ref.current.contains(event.target)) {
  //       return;
  //     }
  //     setTooltip();
  //   }
  //   // Bind the event listener
  //   document.addEventListener('mousedown', handleClickOutside);
  //   return () => {
  //     // Unbind the event listener on clean up
  //     document.removeEventListener('mousedown', handleClickOutside);
  //   };
  // }, [ref]);
  let maxValue;
  if (countryFeatures) {
    maxValue = countryFeatures.reduce((memo, f) => {
      if (!memo) return f.values[indicator];
      return Math.max(memo, f.values[indicator]);
    }, null);
  }
  useEffect(() => {
    mapRef.current = L.map('ll-map', {
      // center: MAP_OPTIONS.CENTER,
      // zoom: size === 'small' ? MAP_OPTIONS.ZOOM.MIN : MAP_OPTIONS.ZOOM.INIT,
      zoomControl: true,
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
    countryTooltipGroupRef.current = L.layerGroup();
    countryTooltipGroupRef.current.addTo(mapRef.current);
    countryOverGroupRef.current = L.layerGroup();
    countryOverGroupRef.current.addTo(mapRef.current);
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
    mapRef.current.zoomControl.setPosition('topleft');
  }, []);
  // add countryFeatures
  useEffect(() => {
    if (countryFeatures) {
      const scale = scaleColorCount(maxValue);
      countryLayerGroupRef.current.clearLayers();
      const jsonLayer = L.geoJSON(
        countryFeatures,
        {
          style: (f) => ({
            ...DEFAULT_STYLE,
            fillColor: f.values && f.values[indicator] && f.values[indicator] > 0
              ? scale(f.values[indicator])
              : NO_DATA_COLOR,
          }),
          onEachFeature: (feature, layer) => {
            layer.on({
              click: (e) => onFeatureClick(e, feature),
              mouseover: (e) => onFeatureOver(e, feature),
              mouseout: () => onFeatureOver(),
            });
          },
        },
      );
      countryLayerGroupRef.current.addLayer(jsonLayer);
    }
  }, [countryFeatures, indicator, tooltip]);
  // add countryFeatures
  useEffect(() => {
    countryTooltipGroupRef.current.clearLayers();
    if (tooltip && countryFeatures) {
      const jsonLayer = L.geoJSON(
        countryFeatures.filter((f) => qe(f.id, tooltip.feature.id)),
        {
          style: TOOLTIP_STYLE,
        },
      );
      countryTooltipGroupRef.current.addLayer(jsonLayer);
    }
  }, [tooltip]);

  useEffect(() => {
    countryOverGroupRef.current.clearLayers();
    if (featureOver && countryFeatures) {
      const jsonLayer = L.geoJSON(
        countryFeatures.filter((f) => qe(f.id, featureOver)),
        {
          style: OVER_STYLE,
        },
      );
      countryOverGroupRef.current.addLayer(jsonLayer);
    }
  }, [featureOver]);

  return (
    <>
      <Styled id="ll-map" ref={ref} />
      {countryFeatures && !!maxValue && (
        <Key
          config={{
            title: typeLabels.plural,
            range: [1, maxValue],
            stops: [
              {
                value: 1,
                color: RANGE[0],
              },
              {
                value: maxValue,
                color: RANGE[1],
              },
            ],
          }}
        />
      )}
      {tooltip && (
        <Tooltip
          position={null}
          direction={tooltip.direction}
          feature={tooltip.feature}
          onClose={() => setTooltip(null)}
          typeLabels={typeLabels}
          onFeatureClick={(evt) => {
            if (evt !== undefined && evt.stopPropagation) evt.stopPropagation();
            setTooltip(null);
            if (tooltip.feature && tooltip.feature.attributes) {
              onCountryClick(tooltip.feature.id);
            }
          }}
        />
      )}
    </>
  );
}

MapContainer.propTypes = {
  typeLabels: PropTypes.object,
  countryFeatures: PropTypes.array,
  indicator: PropTypes.string,
  onCountryClick: PropTypes.func,
};

export default MapContainer;
