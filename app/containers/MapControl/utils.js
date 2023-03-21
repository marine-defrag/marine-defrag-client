import L from 'leaflet';
import { scaleLinear, scalePow } from 'd3-scale';
import { List } from 'immutable';

import { MAP_OPTIONS } from 'themes/config';
import qe from 'utils/quasi-equals';

export const getRange = (allFeatures, attribute, rangeMax) => allFeatures.reduce(
  (range, f) => {
    const val = f.values && parseFloat(f.values[attribute]);
    return {
      min: range.min ? Math.min(range.min, val) : val,
      max: range.max ? Math.max(range.max, val) : val,
    };
  },
  {
    min: null,
    max: rangeMax || null,
  },
);

export const scaleColorCount = (max, stops, isIndicator) => {
  const noStops = stops.length;
  const min = isIndicator ? 0 : 1;
  const minMax = max - min;
  const maxFactor = minMax / (noStops - 1);
  const domain = stops.map((stop, i) => (i * maxFactor + min));
  return scaleLinear()
    .domain(domain)
    .range(stops);
};

export const addToList = (list, countryId, actionId) => {
  // if already present, add action id to country key
  if (list.get(countryId)) {
    return !list.get(countryId).includes(actionId)
      ? list.set(countryId, list.get(countryId).push(actionId))
      : list;
  }
  // else add country with action id as first entry
  return list.set(countryId, List([actionId]));
};

const getFloatProperty = (feature, attribute) => feature.values
  && parseFloat(feature.values[attribute]);

export const scaleCircle = (val, range, config) => {
  const scale = scalePow()
    .exponent(config.exp || 0.5)
    .domain([0, range.max])
    .range([0, config.max]);
  return Math.max(config.min, scale(val));
};

export const valueOfCircle = (radius, range, config) => {
  const scale = scalePow()
    .exponent(1 / config.exp || 2)
    .domain([0, config.max])
    .range([0, range.max]);
  return scale(radius);
};

export const getCircleLayer = ({ features, config, markerEvents }) => {
  const options = {
    pane: 'overlayPane',
    ...config.style,
    zIndex: config['z-index'] || 1,
  };
  const events = {
    mouseout: markerEvents.mouseout,
    click: markerEvents.click,
  };
  const range = getRange(features, config.attribute, config.rangeMax);
  const jsonLayer = L.geoJSON(
    {
      features,
      crs: {
        type: 'name',
        properties: {
          name: 'urn:ogc:def:crs:OGC:1.3:CRS84',
        },
      },
    },
    {
      pointToLayer: (feature, latlng) => L.circleMarker(latlng, {
        ...options,
        radius: scaleCircle(
          getFloatProperty(feature, config.attribute),
          range,
          config.render,
        ),
      }).on(events),
    },
  );
  return jsonLayer;
};

export const getCenterLatLng = (center) => {
  if (!center) {
    return MAP_OPTIONS.CENTER;
  }
  if (Array.isArray(center)) {
    return {
      lat: center[0],
      lng: center[1],
    };
  }
  return {
    lat: center.lat,
    lng: center.lng,
  };
};

export const getTooltipFeatures = (mapTooltips, countryData, locationData) => {
  if (countryData || locationData) {
    // add country Data
    return mapTooltips.reduce(
      (memo, fid) => {
        let content = [];
        const countryF = countryData && countryData.find((fcd) => qe(fcd.id, fid));
        const locF = locationData && locationData.find((fcd) => qe(fcd.id, fid));
        const feature = countryF || locF;
        if (feature) {
          if (
            countryF
            && countryF.tooltip
            && (countryF.tooltip.stats || countryF.tooltip.content)
          ) {
            content = [
              ...content,
              countryF.tooltip.stats
                ? {
                  stats: countryF.tooltip.stats,
                  isCount: countryF.tooltip.isCount,
                }
                : countryF.tooltip.content,
            ];
          }
          if (
            locF
            && locF.tooltip
            && (locF.tooltip.stats || locF.tooltip.content)
          ) {
            content = [
              ...content,
              locF.tooltip.stats
                ? {
                  stats: locF.tooltip.stats,
                  isCount: locF.tooltip.isCount,
                }
                : locF.tooltip.content,
            ];
          }
          return [
            ...memo,
            {
              ...feature,
              tooltip: {
                ...feature.tooltip,
                content,
              },
            },
          ];
        }
        return memo;
      },
      [],
    );
  }
  return [];
};

export const getBBox = (bounds, xLat = 0.5, xLon = 180) => {
  const nw = bounds[0];
  const se = bounds[1];
  const n = nw[0]; // 90
  const w = nw[1]; // -180
  const s = se[0]; // -90
  const e = se[1]; // 180
  const coordinates = [];
  // South: SE >> SW
  for (let lon = e; lon >= w; lon -= xLon) {
    coordinates.push([lon, s]);
  }
  // SW >> NW
  for (let lat = s; lat <= n; lat += xLat) {
    coordinates.push([w, lat]);
  }
  // NW >> NE
  for (let lon = w; lon <= e; lon += xLon) {
    coordinates.push([lon, n]);
  }
  // NE >> SE
  for (let lat = n; lat >= s; lat -= xLat) {
    coordinates.push([e, lat]);
  }

  return ({
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [coordinates],
        },
      },
    ],
  });
};
