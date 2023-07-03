/*
 *
 * MapWrapperLeaflet
 *
 */
import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import L from 'leaflet';
import 'proj4leaflet';
import { ResponsiveContext } from 'grommet';
import { merge } from 'lodash/object';

import { MAP_OPTIONS } from 'themes/config';

import qe from 'utils/quasi-equals';

import Tooltip from './Tooltip';
import {
  scaleColorCount,
  getCircleLayer,
  getBBox,
  getTooltipFeatures,
  getCenterLatLng,
  getPointLayer,
  filterNoDataFeatures,
  filterFeaturesByZoom,
} from './utils';

const Styled = styled.div`
  position: absolute;
  top: ${({ theme, isPrint, fullMap }) => (isPrint && fullMap) ? theme.sizes.header.banner.heightPrint : 0}px;
  bottom: ${({ hasInfo, isPrint }) => isPrint && hasInfo ? '180px' : 0};
  right: 0;
  left: 0;
  background: transparent;
  z-index: 10;
  overflow: hidden;
  width: 100%;
  @media print {
    top: ${({ theme, fullMap }) => fullMap ? theme.sizes.header.banner.heightPrint : 0}px;
    bottom: ${({ hasInfo }) => hasInfo ? '180px' : 0};
  }
`;
// box-shadow: inset 0px 0px 5px 0px rgb(0 0 0 / 50%);
const Map = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background: transparent;
  z-index: 10;
  width: 100%;
`;

// const PROJ[projection] = {
//   name: 'Custom',
//   crs: 'ESRI:54030',
//   proj4def: '+proj=robin +lon_0=11.7 +x_0=-11.7 +y_0=0 +datum=WGS84 +units=m +no_defs +type=crs',
//   resolutions: [
//     65536, 32768, 16384, 8192, 4096, 2048, 1024, 512, 256, 128,
//   ],
//   origin: [0, 11.7],
//   bounds: [[90, -180], [-90, 180]], // [[N, W], [S, E]]
// };

// const usePrevious = (value) => {
//   const ref = useRef();
//   useEffect(() => {
//     ref.current = value; // assign the value of ref to the argument
//   }, [value]); // this code will run when the value of 'value' changes
//   return ref.current; // in the end, return the current ref value.
// };
const TOOLTIP_INITIAL = { features: [] };
const VIEW_INITIAL = {
  center: MAP_OPTIONS.CENTER,
  zoom: MAP_OPTIONS.ZOOM.INIT,
};
export function MapWrapperLeaflet({
  countryFeatures,
  countryData,
  countryPointData,
  locationData,
  indicator,
  onActorClick,
  maxValueCountries,
  includeSecondaryMembers,
  mapSubject,
  fitBounds = false,
  fitBoundsToCountryOverlay = false,
  options = {},
  projection = 'robinson',
  styleType,
  mapId = 'll-map',
  interactive = true,
  scrollWheelZoom = false,
  isLocationData = false, // real location data not country points
  circleLayerConfig = {},
  hasInfo,
  // setMapLoaded,
  isPrintView,
  mapTooltips,
  setMapTooltips,
  onSetMapView,
  mapView,
  printArgs,
  fullMap,
}) {
  const size = React.useContext(ResponsiveContext);
  const [refHeight, setRefHeight] = useState(null);
  const [featureOver, setFeatureOver] = useState(null);
  const ref = useRef(null);
  const mapRef = useRef(null);
  const countryLayerGroupRef = useRef(null);
  const countryOverlayGroupRef = useRef(null);
  const countryPointOverlayGroupRef = useRef(null);
  const locationOverlayGroupRef = useRef(null);
  const countryTooltipGroupRef = useRef(null);
  const countryOverGroupRef = useRef(null);

  const mapOptions = merge({}, options, MAP_OPTIONS);
  const customMapProjection = mapOptions.PROJ[projection];
  let leafletOptions = {
    dragging: interactive,
    doubleClickZoom: interactive,
    scrollWheelZoom,
    minZoom: mapOptions.ZOOM.MIN,
    maxZoom: mapOptions.ZOOM.MAX,
    worldCopyJump: false,
    attributionControl: false,
    center: mapView ? mapView.center : VIEW_INITIAL.center,
    zoom: mapView ? mapView.zoom : VIEW_INITIAL.zoom,
    debounceMoveend: true,
    // center: mapOptions.CENTER,
    // zoom: size === 'small' ? mapOptions.ZOOM.MIN : mapOptions.ZOOM.INIT,
  };
  leafletOptions = customMapProjection
    ? {
      crs: new L.Proj.CRS(
        customMapProjection.crs,
        customMapProjection.proj4def,
        {
          resolutions: customMapProjection.resolutions,
          origin: customMapProjection.origin,
          bounds: customMapProjection.bounds,
        },
      ),
      ...leafletOptions,
      zoomControl: size !== 'small' && interactive,
      continuousWorld: customMapProjection.continuousWorld || false,
      // maxBounds: [
      //   [mapOptions.BOUNDS.N, mapOptions.BOUNDS.W],
      //   [mapOptions.BOUNDS.S, mapOptions.BOUNDS.E],
      // ],
    }
    : {
      ...leafletOptions,
      zoomControl: interactive,
      continuousWorld: true,
    };
  if (isPrintView) {
    leafletOptions = {
      ...leafletOptions,
      preferCanvas: true,
      renderer: L.canvas(),
    };
  }
  const mapEvents = {
    // resize: () => {
    //   console.log('resize')
    //   // setTooltip(null);
    // },
    // unload: () => {
    //   console.log('unload')
    //   // setTooltip(null);
    // },
    // click: () => {
    //   // console.log('mapClick')
    //   // setMapTooltips();
    // },
    // mouseover: (a, b, c) => {
    //   console.log('mouseOver', a, b, c)
    // },
    // mousemove: (a, b, c) => {
    //   console.log('mousemove', a, b, c)
    // },
    // zoomend: (e) => {
    //   // console.log('zoomstart')
    //   if (mapRef.current) {
    //     console.log('zoomend: update mapview state', e)
    //     onSetMapView(
    //       {
    //         center: getCenterLatLng(mapRef.current.getCenter()),
    //         zoom: mapRef.current.getZoom(),
    //       },
    //       mapId,
    //     );
    //   }
    // },
    zoomend: () => {
      if (mapRef.current && onSetMapView) {
        onSetMapView(
          {
            center: getCenterLatLng(mapRef.current.getCenter()),
            zoom: mapRef.current.getZoom(),
          },
          mapId,
        );
      }
    },
    dragend: () => {
      if (mapRef.current && onSetMapView) {
        onSetMapView(
          {
            center: getCenterLatLng(mapRef.current.getCenter()),
            zoom: mapRef.current.getZoom(),
          },
          mapId,
        );
      }
    },
    // layeradd: () => {
    //   // console.log('layerAdd', layer)
    //   // setTooltip(null)
    // },
    // layerremove: () => {
    //   // console.log('layerremove', layer)
    //   // setTooltip(null)
    // },
  };
  const onFeatureClickTT = (e) => {
    const { feature } = e.sourceTarget;
    if (e && L.DomEvent) L.DomEvent.stopPropagation(e);
    if (setMapTooltips && e && e.containerPoint && feature && feature.tooltip) {
      const featureId = feature.id.toString();
      const activeTT = mapTooltips.indexOf(featureId) > -1;
      let ttNew = [];
      if (activeTT) {
        ttNew = mapTooltips.reduce(
          (memo, fid) => fid === featureId ? memo : [...memo, fid],
          [],
        );
      } else {
        ttNew = [
          featureId,
          ...mapTooltips,
        ];
      }
      setMapTooltips(ttNew);
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
  useLayoutEffect(() => {
    setRefHeight(ref && ref.current ? ref.current.clientHeight : 300);
  }, [ref]);
  useLayoutEffect(() => {
    if (mapRef.current) {
      mapRef.current.invalidateSize();
    }
  }, [printArgs]);
  // map init
  useLayoutEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map(mapId, leafletOptions).on(mapEvents);

      // create an orange rectangle
      if (customMapProjection && customMapProjection.addBBox) {
        L.geoJSON(getBBox(customMapProjection.bounds), mapOptions.BBOX_STYLE).addTo(mapRef.current);
      }
      countryLayerGroupRef.current = L.layerGroup();
      countryLayerGroupRef.current.addTo(mapRef.current);
      countryOverlayGroupRef.current = L.layerGroup();
      countryOverlayGroupRef.current.addTo(mapRef.current);
      countryPointOverlayGroupRef.current = L.layerGroup();
      countryPointOverlayGroupRef.current.addTo(mapRef.current);
      locationOverlayGroupRef.current = L.layerGroup();
      locationOverlayGroupRef.current.addTo(mapRef.current);
      countryTooltipGroupRef.current = L.layerGroup();
      countryTooltipGroupRef.current.addTo(mapRef.current);
      countryOverGroupRef.current = L.layerGroup();
      countryOverGroupRef.current.addTo(mapRef.current);
      // notify app when loaded
      // if (setMapLoaded) {
      //   mapRef.current.on('load', () => {
      //     setMapLoaded(mapId);
      //   });
      // }
      if (mapRef.current.zoomControl) {
        mapRef.current.zoomControl.setPosition('topleft');
      }
    }
  }, []);
  // useLayoutEffect(() => {
  //   if (mapView && mapRef.current) {
  //     const centerCurrent = mapRef.current.getCenter();
  //     const zoomCurrent = mapRef.current.getZoom();
  //     if (zoomCurrent !== mapView.zoom) {
  //       console.log('update map zoom from props')
  //       mapRef.current.setZoom(
  //         mapView.zoom,
  //         { animate: false },
  //       );
  //     }
  //     if (
  //       (centerCurrent.lat !== mapView.center.lat)
  //       || (centerCurrent.lng !== mapView.center.lng)
  //     ) {
  //       console.log('update map center from props')
  //       mapRef.current.panTo(
  //         mapView.center,
  //         { duration: 0 },
  //       );
  //     }
  //   }
  // }, [mapView]);
  // add countryFeatures basemap
  useLayoutEffect(() => {
    if (countryFeatures) {
      countryLayerGroupRef.current.clearLayers();
      const jsonLayer = L.geoJSON(
        countryFeatures,
        {
          style: () => ({
            ...mapOptions.DEFAULT_STYLE,
          }),
        },
      );
      countryLayerGroupRef.current.addLayer(jsonLayer);
    }
  }, [countryFeatures]);

  // add countryData
  useLayoutEffect(() => {
    countryOverlayGroupRef.current.clearLayers();
    if (countryData && countryData.length > 0) {
      const scale = mapSubject
        && scaleColorCount(maxValueCountries, mapOptions.GRADIENT[mapSubject], indicator === 'indicator');
      // treat 0 as no data when showing counts
      const noDataThreshold = indicator === 'indicator' ? 0 : 1;
      const jsonLayer = L.geoJSON(
        countryData,
        {
          style: (f) => {
            const defaultStyle = styleType && mapOptions.STYLE[styleType]
              ? {
                ...mapOptions.DEFAULT_STYLE,
                ...mapOptions.STYLE[styleType],
              }
              : mapOptions.DEFAULT_STYLE;
            const fstyle = f.isActive
              ? {
                ...defaultStyle,
                ...mapOptions.STYLE.active,
              }
              : defaultStyle;
            if (mapSubject) {
              if (
                f.values
                && typeof f.values[indicator] !== 'undefined'
                && f.values[indicator] >= noDataThreshold
              ) {
                return {
                  ...fstyle,
                  fillColor: scale(f.values[indicator]),
                  ...f.style,
                };
              }
              return {
                ...fstyle,
                fillColor: mapOptions.NO_DATA_COLOR,
                ...f.style,
              };
            }
            return {
              ...fstyle,
              ...f.style,
            };
          },
        },
      ).on({
        click: (e) => onFeatureClickTT(e),
        mouseout: () => onFeatureOver(),
      });
      countryOverlayGroupRef.current.addLayer(jsonLayer);
    }
  }, [countryData, indicator, mapSubject]);
  // }, [countryData, indicator, mapTooltips, mapSubject]);

  // add countryPointData
  useEffect(() => {
    countryPointOverlayGroupRef.current.clearLayers();
    const hasLocationData = locationData && locationData.length > 0;
    const showMarkers = !isPrintView || (printArgs && printArgs.printMapMarkers);
    if (
      !hasLocationData
      && countryPointData && countryPointData.length > 0
      && showMarkers
    ) {
      const zoom = mapView && mapView.zoom ? mapView.zoom : MAP_OPTIONS.ZOOM.INIT;
      const jsonLayer = getPointLayer({
        data: filterNoDataFeatures(
          filterFeaturesByZoom(countryPointData, zoom, 'marker_max_zoom'),
          indicator,
          !!mapSubject, // proxy for isCount: mapSubject only set for "count indicators"
        ),
        config: {
          indicator, mapOptions, mapSubject, maxValueCountries, tooltip, styleType,
        },
        markerEvents: {
          click: (e) => onFeatureClickTT(e),
          mouseout: () => onFeatureOver(),
        },
      });

      countryPointOverlayGroupRef.current.addLayer(jsonLayer);
    }
  }, [countryPointData, mapView, indicator, tooltip, mapSubject, locationData, printArgs, isPrintView]);

  // add zoom to countryData
  useEffect(() => {
    if (
      mapRef
      && mapRef.current
      && fitBounds
      && !fitBoundsToCountryOverlay
      && !mapView
    ) {
      const bounds = (customMapProjection && customMapProjection.bounds)
        ? L.latLngBounds(customMapProjection.bounds)
        : L.latLngBounds([[90, -180], [-90, 180]]);
      const boundsZoom = mapRef.current.getBoundsZoom(
        bounds,
        false, // inside,
        [20, 20], // padding in px
      );
      const boundsCenter = bounds.getCenter();
      const currentCenter = mapRef.current.getCenter();
      const currentZoom = mapRef.current.getZoom();
      if (
        (boundsZoom !== currentZoom)
        || !qe(currentCenter.lat, boundsCenter.lat)
        || !qe(currentCenter.lng, boundsCenter.lng)
      ) {
        // if (mapRef.current.getCenter())
        // add zoom level to account for custom proj issue
        const ZOOM_OFFSET = 0;
        const MAX_ZOOM = 7;
        mapRef.current.setView(
          boundsCenter,
          Math.min(
            Math.max(boundsZoom - ZOOM_OFFSET, 0),
            MAX_ZOOM,
          ),
          { animate: false },
        );
      }
    }
  }, []);
  useEffect(() => {
    if (
      mapRef
      && mapRef.current
      && !fitBounds
      && fitBoundsToCountryOverlay
      && countryData
      && countryData.length > 0
      && countryOverlayGroupRef
      && countryOverlayGroupRef.current
      && countryOverlayGroupRef.current.getLayers()
      && countryOverlayGroupRef.current.getLayers().length > 0
      && !mapView
      // && mapView.zoom === VIEW_INITIAL.zoom
      // && mapView.center.lng === VIEW_INITIAL.center.lng
      // && mapView.center.lat === VIEW_INITIAL.center.lat
    ) {
      const jsonLayer = countryOverlayGroupRef.current.getLayers()[0];
      if (jsonLayer.getBounds) {
        const boundsZoom = mapRef.current.getBoundsZoom(
          jsonLayer.getBounds(),
          false, // inside,
          [20, 20], // padding in px
        );
        // L.rectangle(jsonLayer.getBounds(), { color: '#ff7800', weight: 1 }).addTo(mapRef.current);
        const boundsCenter = jsonLayer.getBounds().getCenter();
        const currentCenter = mapRef.current.getCenter();
        const currentZoom = mapRef.current.getZoom();
        if (
          (boundsZoom !== currentZoom)
          || !qe(currentCenter.lat, boundsCenter.lat)
          || !qe(currentCenter.lng, boundsCenter.lng)
        ) {
          // if (mapRef.current.getCenter())
          // add zoom level to account for custom proj issue
          const ZOOM_OFFSET = 0;
          const MAX_ZOOM = 7;
          mapRef.current.setView(
            boundsCenter,
            Math.min(
              Math.max(boundsZoom - ZOOM_OFFSET, 0),
              MAX_ZOOM,
            ),
            { animate: false },
          );
        }
      }
    }
  }, [countryData]);
  // add locationData
  useLayoutEffect(() => {
    locationOverlayGroupRef.current.clearLayers();
    if (locationData && locationData.length > 0) {
      const layer = L.featureGroup(null, { pane: 'overlayPane' });
      const jsonLayer = getCircleLayer({
        features: locationData,
        config: circleLayerConfig,
        markerEvents: {
          click: (e) => onFeatureClickTT(e),
          mouseout: () => onFeatureOver(),
        },
      });
      layer.addLayer(jsonLayer);
      locationOverlayGroupRef.current.addLayer(layer);
    }
    // TODO
  }, [locationData, indicator, mapTooltips, mapSubject, circleLayerConfig]);

  // add zoom to locationData
  useLayoutEffect(() => {
    if (
      mapRef
      && mapRef.current
      && locationData
      && locationData.length > 0
      && locationOverlayGroupRef
      && locationOverlayGroupRef.current
      && locationOverlayGroupRef.current.getLayers()
      && locationOverlayGroupRef.current.getLayers().length > 0
      && !mapView
    ) {
      const jsonLayer = locationOverlayGroupRef.current.getLayers()[0];
      if (jsonLayer.getBounds) {
        const boundsZoom = mapRef.current.getBoundsZoom(
          jsonLayer.getBounds(),
          false, // inside,
          [20, 20], // padding in px
        );
        const boundsCenter = jsonLayer.getBounds().getCenter();
        // add zoom level to account for custom proj issue
        const ZOOM_OFFSET = 0;
        const MAX_ZOOM = 7;
        mapRef.current.setView(
          boundsCenter,
          Math.min(
            Math.max(boundsZoom - ZOOM_OFFSET, 0),
            MAX_ZOOM,
          ),
          { animate: false },
        );
      }
    }
  }, [locationData]);

  // // highlight tooltip feature
  useLayoutEffect(() => {
    countryTooltipGroupRef.current.clearLayers();
    if (countryData && mapTooltips && mapTooltips && mapTooltips.length > 0) {
      mapTooltips.forEach(
        (fid) => {
          const jsonLayer = L.geoJSON(
            countryData.filter((f) => qe(f.id, fid)),
            { style: mapOptions.TOOLTIP_STYLE },
          );
          countryTooltipGroupRef.current.addLayer(jsonLayer);
        }
      );
    }
    if (locationData && locationOverlayGroupRef.current && locationOverlayGroupRef.current.getLayers()) {
      const layerGroup = locationOverlayGroupRef.current.getLayers()[0];
      const layer = layerGroup && layerGroup.getLayers()[0];
      if (layer) {
        // TODO
        if (mapTooltips && mapTooltips.length > 0) {
          if (layer && layer.getLayers()) {
            layer.getLayers().filter(
              (f) => mapTooltips.indexOf(f.feature.id) > -1
            ).forEach(
              (f) => {
                f.bringToFront();
                f.setStyle({ weight: 1.5 });
              }
            );
          }
        } else {
          layer.getLayers().forEach(
            (feature) => feature.setStyle({ weight: 0.5 })
          );
        }
      }
    }
  }, [mapTooltips, mapSubject, includeSecondaryMembers, mapView]);

  useLayoutEffect(() => {
    countryOverGroupRef.current.clearLayers();
    if (featureOver && countryData) {
      const jsonLayer = L.geoJSON(
        countryData.filter((f) => qe(f.id, featureOver)),
        {
          style: mapOptions.OVER_STYLE,
        },
      );
      countryOverGroupRef.current.addLayer(jsonLayer);
    }
  }, [featureOver]);
  let tooltip = TOOLTIP_INITIAL;
  // update tooltip
  if (mapTooltips) {
    tooltip = {
      direction: { x: 'left', y: 'top' },
      features: getTooltipFeatures(
        mapTooltips,
        countryData,
        locationData,
      ),
    };
  }

  // if (mapRef) onSetMapRef(mapRef, mapId);
  return (
    <Styled hasInfo={hasInfo} ref={ref} isPrint={isPrintView} fullMap={fullMap}>
      <Map id={mapId} styleType={styleType} />
      {tooltip && tooltip.features && tooltip.features.length > 0 && (
        <Tooltip
          isPrintView={isPrintView}
          printArgs={printArgs}
          isLocationData={isLocationData}
          h={refHeight}
          position={null}
          direction={tooltip.direction}
          features={tooltip.features && tooltip.features.map((f) => f && f.tooltip)}
          onFeatureClick={onActorClick ? (id) => onActorClick(id) : null}
          onClose={(id) => setMapTooltips(
            mapTooltips.reduce(
              (memo, fid) => qe(fid, id) ? memo : [...memo, fid],
              [],
            )
          )}
        />
      )}
    </Styled>
  );
}

MapWrapperLeaflet.propTypes = {
  countryFeatures: PropTypes.array, // country basemap
  countryData: PropTypes.array, // country data overlay
  countryPointData: PropTypes.array,
  locationData: PropTypes.array, // location data overlay
  indicator: PropTypes.string,
  onActorClick: PropTypes.func,
  maxValueCountries: PropTypes.number,
  includeSecondaryMembers: PropTypes.bool,
  fitBounds: PropTypes.bool,
  fitBoundsToCountryOverlay: PropTypes.bool,
  interactive: PropTypes.bool,
  scrollWheelZoom: PropTypes.bool,
  mapSubject: PropTypes.string,
  projection: PropTypes.string,
  styleType: PropTypes.string,
  mapId: PropTypes.string,
  options: PropTypes.object,
  isLocationData: PropTypes.bool,
  hasInfo: PropTypes.bool,
  fullMap: PropTypes.bool,
  isPrintView: PropTypes.bool,
  circleLayerConfig: PropTypes.object,
  printArgs: PropTypes.object,
  mapTooltips: PropTypes.array,
  setMapTooltips: PropTypes.func,
  mapView: PropTypes.object,
  onSetMapView: PropTypes.func,
  // onSetMapSubject: PropTypes.func,
};

export default MapWrapperLeaflet;
