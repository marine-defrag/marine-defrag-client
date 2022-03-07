import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
// import { FormattedMessage, intlShape, injectIntl } from 'react-intl';
import { Box, Text } from 'grommet';

import MapKey from './MapKey';
import MapSubjectOptions from './MapSubjectOptions';
import MapMemberOption from './MapMemberOption';

const Title = styled((p) => <Text weight={600} {...p} />)``;
const SubTitle = styled((p) => <Text size="small" {...p} />)``;

const Styled = styled((p) => (
  <Box
    elevation="small"
    background="white"
    pad={{
      horizontal: 'small',
      bottom: 'large',
    }}
    {...p}
  />
))`
  position: absolute;
  left: 10px;
  bottom: 50px;
  width: 350px;
  z-index: 50;
  padding: 15px 20px 5px;
`;

export function MapInfoOptions({
  config, mapSubject,
}) {
  const {
    title, maxValue, subjectOptions, memberOption, subTitle,
  } = config;
  return (
    <Styled>
      <Box gap="xsmall" margin={{ bottom: 'small' }}>
        {title && (
          <Title>{title}</Title>
        )}
        {subTitle && (
          <SubTitle>{subTitle}</SubTitle>
        )}
      </Box>
      <MapKey maxValue={maxValue} mapSubject={mapSubject} />
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
