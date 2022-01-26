import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
// import { FormattedMessage, intlShape, injectIntl } from 'react-intl';

import { MAP_OPTIONS } from 'themes/config';

import Gradient from './Gradient';
import Bins from './Bins';
import MapSubjectOptions from './MapSubjectOptions';
import MapMemberOption from './MapMemberOption';

const Title = styled.div`
  margin-bottom: 15px;
  font-weight: 600;
`;
const Styled = styled.div`
  position: absolute;
  left: 10px;
  bottom: 50px;
  background: white;
  width: 350px;
  z-index: 50;
  box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.2);
  padding: 15px 20px 5px;
`;

export function MapInfoOptions({ config, mapSubject }) {
  const {
    title, maxValue, subjectOptions, memberOption,
  } = config;
  const stops = MAP_OPTIONS.GRADIENT[mapSubject];
  const noStops = stops.length;
  const maxFactor = maxValue / (noStops - 1);
  return (
    <Styled>
      {title && (
        <Title>
          {title}
        </Title>
      )}
      {!!maxValue && maxValue > 16 && (
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
      {!!maxValue && maxValue <= 16 && maxValue > 0 && (
        <Bins config={{ range: [1, maxValue], maxValue, stops }} />
      )}
      {subjectOptions && (
        <MapSubjectOptions options={subjectOptions} />
      )}
      {memberOption && (
        <MapMemberOption option={memberOption} />
      )}
    </Styled>
  );
}

MapInfoOptions.propTypes = {
  config: PropTypes.object,
  mapSubject: PropTypes.string,
};

export default MapInfoOptions;
