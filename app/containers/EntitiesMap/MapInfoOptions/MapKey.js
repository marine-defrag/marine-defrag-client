import React from 'react';
import PropTypes from 'prop-types';
import { MAP_OPTIONS } from 'themes/config';

import Gradient from './Gradient';
import Bins from './Bins';

export function MapKey({
  mapSubject,
  maxValue,
  maxBinValue = 0,
}) {
  const stops = maxValue && MAP_OPTIONS.GRADIENT[mapSubject];
  const noStops = maxValue && stops.length;
  const maxFactor = maxValue && maxValue / (noStops - 1);
  return (
    <>
      {!!maxValue && maxValue > maxBinValue && (
        <Gradient
          config={{
            range: [1, maxValue],
            stops: stops.map((color, i) => ({
              value: i * maxFactor,
              color,
            })),
          }}
        />
      )}
      {!!maxValue && maxValue <= maxBinValue && maxValue > 0 && (
        <Bins config={{ range: [1, maxValue], maxValue, stops }} />
      )}
    </>
  );
}

MapKey.propTypes = {
  mapSubject: PropTypes.string,
  maxValue: PropTypes.number,
  maxBinValue: PropTypes.number,
};

export default MapKey;
