import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
// import { FormattedMessage, intlShape, injectIntl } from 'react-intl';
import { Box, Text, Button } from 'grommet';

import qe from 'utils/quasi-equals';
import PrintHide from 'components/styled/PrintHide';
import PrintOnly from 'components/styled/PrintOnly';

import CountriesTab from './CountriesTab';
import IndicatorsTab from './IndicatorsTab';

const Styled = styled.div`
  position: absolute;
  z-index: 50;
  background: ${({ isPrint }) => isPrint ? 'white' : 'transparent'};
  bottom: ${({ isPrint }) => isPrint ? 0 : 10}px;
  width: ${({ isPrint }) => isPrint ? 'auto' : '100%'};
  height: ${({ isPrint }) => isPrint ? 'auto' : '250px'};
  min-height: ${({ isPrint }) => isPrint ? '180px' : 'auto'};
  left: 0;
  right: ${({ isPrint }) => isPrint ? 0 : 'auto'};
  max-width: ${({ isPrint }) => isPrint ? '100%' : '380px'};
  border-top: ${({ isPrint }) => isPrint ? '1px solid #f1f0f1' : 'none'};
  @media (min-width: 370px) {
    left: ${({ isPrint }) => isPrint ? 0 : 10}px;
    bottom: ${({ isPrint }) => isPrint ? 0 : 50}px;
  }
  @media print {
    height: auto;
    right: 0;
    left: 0;
    bottom: 0;
    max-width: 100%;
    border-top: 1px solid #f1f0f1;
  }
`;

const Pane = styled((p) => <Box {...p} />)`
  position: absolute;
  z-index: 51;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
`;

const TabButton = styled((p) => <Button plain {...p} />)`
  &:focus-visible {
    color: ${({ theme }) => theme.global.colors.highlight};
    text-decoration: underline;
    box-shadow: none;
  }
`;

// const X = styled((p) => (
//   <Box
//     elevation="small"
//     background="white"
//     pad={{
//       horizontal: 'small',
//       bottom: 'large',
//     }}
//     {...p}
//   />
// ))`
//   position: absolute;
//   z-index: 50;
//   bottom: 10px;
//   width: 100%;
//   height: 200px;
//   left: 0;
//   max-width: 350px;
//   padding: 5px 10px 5px;
//   @media (min-width: 370px) {
//     left: 10px;
//     bottom: 50px;
//   }
// `;

export function MapInfoOptions({
  options,
  countryMapSubject,
  minMaxValues,
  circleLayerConfig,
  isPrintView,
}) {
  if (!options) return null;
  const [tab, setTab] = useState(options[0].id);
  const activeTab = options.find((o) => qe(tab, o.id));
  const renderTabs = (shadow) => options
    && options.map(
      (option) => {
        const active = qe(tab, option.id);
        return (
          <Box
            key={option.id}
            elevation={shadow ? 'medium' : ''}
            style={{ zIndex: active ? 2 : 0 }}
            background={(shadow || active) ? 'white' : ''}
          >
            <TabButton
              tabIndex={shadow ? -1 : 'auto'}
              ariaHidden={!!shadow}
              onClick={() => setTab(option.id)}
            >
              <Box pad={{ vertical: 'xsmall', horizontal: 'small' }}>
                <Text
                  size="small"
                  weight={active ? 500 : 300}
                  style={{
                    opacity: shadow ? 0 : 1,
                    color: 'inherit',
                  }}
                >
                  {option.tabTitle}
                </Text>
              </Box>
            </TabButton>
          </Box>
        );
      }
    );
  return (
    <Styled isPrint={isPrintView}>
      <PrintHide>
        <Pane>
          <Box fill="horizontal" direction="row" style={{ zIndex: 1 }}>
            {renderTabs(true)}
          </Box>
          <Box
            flex={{ grow: 1 }}
            direction="row"
            elevation="medium"
            background="white"
            style={{ zIndex: 2 }}
          />
        </Pane>
      </PrintHide>
      <PrintHide>
        <Pane>
          <Box fill="horizontal" direction="row">
            {renderTabs(false)}
          </Box>
          <Box
            flex={{ grow: 1 }}
            direction="row"
            background="white"
            align="start"
            pad={{
              horizontal: 'small',
              top: 'ms',
            }}
          >
            {activeTab.id === 'indicators' && (
              <IndicatorsTab
                config={activeTab}
                minMaxValues={minMaxValues}
                circleLayerConfig={circleLayerConfig}
              />
            )}
            {activeTab.id === 'countries' && (
              <CountriesTab
                config={activeTab}
                minMaxValues={minMaxValues}
                countryMapSubject={countryMapSubject}
              />
            )}
          </Box>
        </Pane>
      </PrintHide>
      <PrintOnly>
        <Box
          flex={{ grow: 1 }}
          direction="row"
          pad={{ top: 'small' }}
          gap="small"
        >
          {options && options.map(
            (option) => (
              <Box key={option.id} basis="1/2" pad={{ horizontal: 'small' }}>
                {option.id === 'countries' && (
                  <CountriesTab
                    isPrintView
                    config={option}
                    minMaxValues={minMaxValues}
                    countryMapSubject={countryMapSubject}
                  />
                )}
                {option.id === 'indicators' && (
                  <IndicatorsTab
                    isPrintView
                    config={option}
                    minMaxValues={minMaxValues}
                    circleLayerConfig={circleLayerConfig}
                  />
                )}
              </Box>
            )
          )}
        </Box>
      </PrintOnly>
    </Styled>
  );
}

MapInfoOptions.propTypes = {
  options: PropTypes.array,
  minMaxValues: PropTypes.object,
  circleLayerConfig: PropTypes.object,
  countryMapSubject: PropTypes.string,
  isPrintView: PropTypes.bool,
};

export default MapInfoOptions;
