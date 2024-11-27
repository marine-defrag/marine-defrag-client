import L from 'leaflet';
import { scaleLinear, scalePow } from 'd3-scale';
import { List } from 'immutable';

import { MAP_OPTIONS } from 'themes/config';
import qe from 'utils/quasi-equals';

export const filterFeaturesByZoom = (
  features,
  zoom,
  propertyMaxZoom,
) => features.filter((feature) => {
  if (
    feature.properties && feature.properties[propertyMaxZoom]
  ) {
    return zoom <= parseInt(feature.properties[propertyMaxZoom], 10);
  }
  return false;
});
export const filterNoDataFeatures = (
  features,
  indicator,
  isCount,
) => features.filter((f) => {
  // exclude if no value is set
  if (!f.values || typeof f.values[indicator] === 'undefined') {
    return false;
  }
  // exclude if value is 0 and where 0 means "no data"
  if (isCount && f.values && f.values[indicator] === 0) {
    return false;
  }
  return true;
});

const getPointIconFillColor = ({
  feature,
  mapSubject,
  indicator,
  maxValueCountries,
  mapOptions,
  valueToStyle,
  styleType,
}) => {
  // check if custom styleType mapping exists
  if (styleType && mapOptions.STYLE[styleType]) {
    return mapOptions.STYLE[styleType].fillColor;
  }
  // check for explicitly set feature color
  if (feature.style && feature.style.fillColor) {
    return feature.style.fillColor;
  }
  if (feature.values && typeof feature.values[indicator] !== 'undefined') {
    // check for custom valueToStyle mapping function
    if (valueToStyle) {
      const style = valueToStyle(feature.values[indicator]);
      if (style && style.fillColor) {
        return style.fillColor;
      }
    }
    // use gradient scale if available
    // ... and if a value of 0 is not assumed to be "no data" (i.e. when counting activities)
    const noDataThreshold = indicator === 'indicator' ? 0 : 1;
    if (
      mapSubject
      && mapOptions.GRADIENT[mapSubject]
      && feature.values[indicator] >= noDataThreshold
    ) {
      const scale = scaleColorCount(maxValueCountries, mapOptions.GRADIENT[mapSubject], indicator === 'indicator');
      return scale(feature.values[indicator]);
    }
  }
  // return default "no data" color
  return mapOptions.NO_DATA_COLOR;
};

// append point countries onto map
export const getPointLayer = ({ data, config, markerEvents }) => {
  const layer = L.featureGroup(null);
  const {
    indicator, mapOptions, mapSubject, maxValueCountries, tooltip, valueToStyle, styleType,
  } = config;
  const events = {
    mouseover: (e) => markerEvents.mouseover ? markerEvents.mouseover(e, config) : null,
    mouseout: (e) => markerEvents.mouseout ? markerEvents.mouseout(e, config) : null,
    click: (e) => (markerEvents.click ? markerEvents.click(e, config) : null),
  };

  const tooltipFeatureIds = (tooltip && tooltip.features && tooltip.features.length > 0) ? tooltip.features.map((f) => f.id) : [];
  const jsonLayer = L.geoJSON(data, {
    pointToLayer: (feature, latlng) => {
      const iconCircleColor = getPointIconFillColor({
        feature,
        mapSubject,
        indicator,
        maxValueCountries,
        mapOptions,
        valueToStyle,
        styleType,
      });
      const iconRingColor = (tooltipFeatureIds.length && tooltipFeatureIds.indexOf(feature.id) > -1) || feature.isActive ? mapOptions.STYLE.active.color : 'white';
      const iconCircleOpacity = feature.style && feature.style.fillOpacity ? feature.style.fillOpacity : 1;
      const svgIcon = L.divIcon({
        html: `
<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 28 30"
  width="25"
  height="27"
>
  <path
    d="m24,14.18c0-5.52-4.48-10-10-10S4,8.66,4,14.18c0,4.37,2.8,8.07,6.71,9.43l3.29,4.2,3.29-4.2c3.9-1.36,6.71-5.07,6.71-9.43Z"
    fill="${iconRingColor}"
    filter="drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.35))"
  />
  <circle cx="14" cy="14.18" r="8.18" fill="${iconCircleColor}"     opacity="${iconCircleOpacity}"/>
</svg>`,
        className: 'country-marker-svg-icon',
        iconSize: [25, 27],
        iconAnchor: [12.5, 27],
      });

      return L.marker(latlng, {
        zIndex: 1,
        pane: 'markerPane',
        icon: svgIcon,
        keyboard: false,
      }).on(events);
    },
  });

  layer.addLayer(jsonLayer);

  return layer;
};

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
