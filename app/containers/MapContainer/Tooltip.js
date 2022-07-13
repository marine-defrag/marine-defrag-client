import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Box, Text, Button } from 'grommet';
import { FormNext, FormClose } from 'grommet-icons';
import { ROUTES } from 'themes/config';

const Root = styled.div`
  position: absolute;
  top: ${({ position }) => position ? position.y : 50}px;
  left: 0;
  right: 0;
  z-index: 2501;
  @media (min-width: ${({ theme }) => theme.breakpoints.large}) {
    bottom: auto;
    right: auto;
    top: ${({ position }) => position ? position.y : 10}px;
    right: ${({ position }) => position ? 'auto' : '10px'};
    left: ${({ position }) => position ? position.x : 'auto'};
  }
`;

// prettier-ignore
const Anchor = styled.div``;

// eslint-ebable prefer-template
// border-right-color: ${({ dirLeft }) => (!dirLeft ? 'white' : 'transparent')};

const TTContentWrap = styled((p) => <Box {...p} />)``;
const ButtonWrap = styled((p) => <Box align="end" margin={{ top: 'xsmall' }} {...p} />)``;
const Main = styled.div`
  padding: 0 10px 10px;
  min-height: 100px;
  box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.2);
  display: block;
  background: white;
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  max-height: ${({ h }) => h - 20}px;
  @media (min-width: ${({ theme }) => theme.breakpoints.large}) {
    height: auto;
    min-width: 280px;
    max-width: 300px;
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
    margin={{ top: 'small' }}
    pad={{ top: 'small' }}
    {...p}
  />
))`
  border-top: 1px solid ${({ theme }) => theme.global.colors.border.light};
  &:first-child {
    margin-top: 0px;
    paddding-top: 0px;
    border-top: 0px;
  }
`;

const Tooltip = ({
  position,
  direction,
  features,
  onClose,
  mapRef,
  onFeatureClick,
  isLocationData,
}) => {
  console.log(features);
  return (
    <Root position={position}>
      <Anchor dirLeft={direction && direction.x === 'left'} xy={{ x: 0, y: 0 }}>
        <Main
          dirLeft={direction && direction.x === 'left'}
          h={mapRef && mapRef.current ? mapRef.current.clientHeight : 300}
        >
          <Box>
            {features.map((feature, i) => (
              <Feature key={i}>
                <Box direction="row" justify="between" align="center" margin={{ bottom: 'xsmall' }}>
                  <Box>
                    <TTTitle>{feature.title}</TTTitle>
                  </Box>
                  <Button
                    plain
                    icon={<FormClose size="small" />}
                    onClick={() => onClose(feature.id)}
                  />
                </Box>
                {feature.content && (
                  <TTContentWrap>
                    {feature.content}
                  </TTContentWrap>
                )}
                {onFeatureClick && feature.id && (
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
};

Tooltip.propTypes = {
  isLocationData: PropTypes.bool,
  position: PropTypes.object,
  direction: PropTypes.object, // x, y
  mapRef: PropTypes.object,
  features: PropTypes.array,
  onClose: PropTypes.func,
  onFeatureClick: PropTypes.func,
};

export default Tooltip;
