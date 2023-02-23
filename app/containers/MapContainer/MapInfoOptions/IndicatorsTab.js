import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
// import { FormattedMessage, intlShape, injectIntl } from 'react-intl';
import { Box, Text, Button } from 'grommet';
import InfoOverlay from 'components/InfoOverlay';
import BoxPrint from 'components/styled/BoxPrint';
import PrintOnly from 'components/styled/PrintOnly';
import PrintHide from 'components/styled/PrintHide';
import qe from 'utils/quasi-equals';

import MapKey from './MapKey';
import SelectIndicators from './SelectIndicators';

const Title = styled((p) => <Text weight={500} {...p} />)`
  margin-right: ${({ hasInfo }) => hasInfo ? 8 : 0}px;
  @media print {
    font-size: 11pt;
  }
`;
const SubTitle = styled((p) => <Text size="small" {...p} />)``;

const IndicatorButton = styled((p) => <Button plain {...p} />)`
    color: #0077d8;
    &:hover {
      color: #0063b5;
    }
`;

export function IndicatorsTab({
  config,
  minMaxValues,
  circleLayerConfig,
}) {
  const {
    ffOptions,
    ffActiveOptionId,
  } = config;
  const activeIndicatorOption = ffOptions.find(
    (o) => qe(o.value, ffActiveOptionId || '0')
  );
  const showIndicatorInfo = activeIndicatorOption
  && activeIndicatorOption.value !== '0'
  && circleLayerConfig
  && minMaxValues
  && minMaxValues.points;
  return (
    <BoxPrint fill="horizontal" hidePrint={!showIndicatorInfo}>
      <PrintOnly>
        <Text size="small">
          {config.tabTitle}
        </Text>
        <Box gap="xsmall" margin={{ top: 'xsmall' }}>
          <Title>
            {activeIndicatorOption.title}
          </Title>
        </Box>
      </PrintOnly>
      <PrintHide>
        <SelectIndicators config={config} />
      </PrintHide>
      {showIndicatorInfo && (
        <Box pad={{ top: 'medium' }} gap="medium">
          <MapKey
            maxValue={minMaxValues.points.max}
            minValue={minMaxValues.points.min}
            isIndicator
            type="circles"
            circleLayerConfig={circleLayerConfig}
          />
          {activeIndicatorOption.title && (
            <PrintHide>
              {activeIndicatorOption.onClick && (
                <IndicatorButton
                  as={activeIndicatorOption.href ? 'a' : 'button'}
                  href={activeIndicatorOption.href}
                  onClick={(evt) => {
                    if (evt) evt.preventDefault();
                    activeIndicatorOption.onClick();
                  }}
                >
                  <Title hasInfo={!!activeIndicatorOption.info}>
                    {activeIndicatorOption.title}
                  </Title>
                </IndicatorButton>
              )}
              {!activeIndicatorOption.onClick && (
                <Title hasInfo={!!activeIndicatorOption.info}>
                  {activeIndicatorOption.title}
                </Title>
              )}
              {activeIndicatorOption.info && (
                <InfoOverlay
                  title={activeIndicatorOption.title}
                  content={activeIndicatorOption.info}
                  tooltip
                  inline
                />
              )}
            </PrintHide>
          )}
        </Box>
      )}
      {!showIndicatorInfo && (
        <Box pad={{ top: 'medium' }}>
          <SubTitle>Select an indicator to add it to the map</SubTitle>
        </Box>
      )}
    </BoxPrint>
  );
}

IndicatorsTab.propTypes = {
  config: PropTypes.object,
  minMaxValues: PropTypes.object,
  circleLayerConfig: PropTypes.object,
};

export default IndicatorsTab;
