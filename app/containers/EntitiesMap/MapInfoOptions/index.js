import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
// import { FormattedMessage, intlShape, injectIntl } from 'react-intl';

import { MAP_OPTIONS } from 'themes/config';

import Gradient from './Gradient';
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

export function MapInfoOptions({ config }) {
  const {
    title, maxValue, subjectOptions, memberOption,
  } = config;
  return (
    <Styled>
      {title && (
        <Title>
          {title}
        </Title>
      )}
      {!!maxValue && (
        <Gradient
          config={{
            range: [1, maxValue],
            stops: [
              {
                value: 1,
                color: MAP_OPTIONS.RANGE[0],
              },
              {
                value: maxValue,
                color: MAP_OPTIONS.RANGE[1],
              },
            ],
          }}
        />
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
};

export default MapInfoOptions;
