import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Box, Text, Button } from 'grommet';
import { FormNext, FormClose } from 'grommet-icons';
import { ROUTES } from 'themes/config';

import PrintHide from 'components/styled/PrintHide';

import asArray from 'utils/as-array';
import TooltipContent from './TooltipContent';

const Root = styled.div`
  position: absolute;
  top: ${({ position, isPrint }) => {
    if (isPrint) {
      return 0;
    }
    return position ? position.y : 50;
  }}px;
  left: 0;
  right: 0;
  z-index: 2501;
  pointer-events: none;
  @media (min-width: ${({ theme }) => theme.breakpoints.large}) {
    right: auto;
    bottom: 0;
    top: ${({ position }) => position ? position.y : 0}px;
    right: ${({ position }) => position ? 'auto' : '0px'};
    left: ${({ position }) => position ? position.x : 'auto'};
  }
  @media print {
    left: auto;
  }
`;

// prettier-ignore
const Anchor = styled.div``;

// eslint-ebable prefer-template
// border-right-color: ${({ dirLeft }) => (!dirLeft ? 'white' : 'transparent')};

const ButtonWrap = styled((p) => <Box align="end" margin={{ top: 'xsmall' }} {...p} />)``;
const Main = styled.div`
  pointer-events: all;
  padding: 5px;
  display: block;
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  max-height: ${({ h }) => h}px;
  @media (min-width: ${({ theme }) => theme.breakpoints.large}) {
    height: auto;
    min-width: 290px;
    max-width: 310px;
    pointer-events: all;
  }
`;

const TTTitle = styled.h4`
margin: 0;
font-size: ${({ theme }) => theme.sizes.text.default};
`;

const CountryButton = styled((p) => <Button {...p} />)`
  font-weight: 500;
  font-size: 13px;
  stroke: ${({ theme }) => theme.global.colors.a};
  &:hover {
    stroke: ${({ theme }) => theme.global.colors.aHover};
  }
`;

const Feature = styled((p) => (
  <Box
    pad="small"
    {...p}
  />
))`
  position: relative;
  min-height: 90px;
  box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.2);
  background: white;
  &:first-child {
    margin-top: 0px;
  }
`;

const TTContentWrap = styled((p) => <Box pad={{ vertical: 'xsmall' }} {...p} />)``;
const TTTitleWrap = styled((p) => (
  <Box
    direction="row"
    justify="between"
    align="center"
    margin={{ bottom: 'xsmall' }}
    {...p}
  />
))`
  border-bottom: 1px solid ${({ theme }) => theme.global.colors.border.light};
`;

const TTCloseFloat = styled.div`
  position: absolute;
  right: 10px;
  top: 10px;
`;

const Tooltip = ({
  position,
  direction,
  features,
  onClose,
  onFeatureClick,
  isLocationData,
  isPrintView,
  h,
}) => (
  <Root position={position} isPrint={isPrintView}>
    <Anchor dirLeft={direction && direction.x === 'left'} xy={{ x: 0, y: 0 }}>
      <Main
        dirLeft={direction && direction.x === 'left'}
        h={h}
      >
        <Box gap="xsmall">
          {features.map((feature, i) => (
            <Feature key={i}>
              {feature.title && (
                <TTTitleWrap>
                  <Box>
                    <TTTitle>{feature.title}</TTTitle>
                  </Box>
                  <PrintHide>
                    <Button
                      plain
                      icon={<FormClose size="small" />}
                      onClick={() => onClose(feature.id)}
                    />
                  </PrintHide>
                </TTTitleWrap>
              )}
              {!feature.title && (
                <PrintHide>
                  <TTCloseFloat>
                    <Button
                      plain
                      icon={<FormClose size="small" />}
                      onClick={() => onClose(feature.id)}
                    />
                  </TTCloseFloat>
                </PrintHide>
              )}
              {feature.content && (
                <Box>
                  {asArray(feature.content).map(
                    (c, j) => (
                      <TTContentWrap key={j}>
                        {(c.stats || c.isCount) && (
                          <TooltipContent stats={c.stats} isCount={c.isCount} />
                        )}
                      </TTContentWrap>
                    )
                  )}
                </Box>
              )}
              {onFeatureClick && feature.id && feature.linkActor && (
                <ButtonWrap>
                  <CountryButton
                    as="a"
                    plain
                    href={`${ROUTES.ACTOR}/${feature.id}`}
                    onClick={(evt) => {
                      if (evt && evt.preventDefault) evt.preventDefault();
                      if (evt && evt.stopPropagation) evt.stopPropagation();
                      onFeatureClick(feature.id);
                    }}
                  >
                    <Box direction="row" align="center">
                      <Text size="small">{isLocationData ? 'Location details' : 'Country details'}</Text>
                      <FormNext size="xsmall" style={{ stroke: 'inherit' }} />
                    </Box>
                  </CountryButton>
                </ButtonWrap>
              )}
            </Feature>
          ))}
        </Box>
      </Main>
    </Anchor>
  </Root>
);

Tooltip.propTypes = {
  isLocationData: PropTypes.bool,
  isPrintView: PropTypes.bool,
  position: PropTypes.object,
  direction: PropTypes.object, // x, y
  h: PropTypes.number,
  features: PropTypes.array,
  onClose: PropTypes.func,
  onFeatureClick: PropTypes.func,
};

export default Tooltip;
