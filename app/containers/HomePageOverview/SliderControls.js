/**
 *
 * SliderControls
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

import { Next, Previous } from 'grommet-icons';
import { Box } from 'grommet';

import styled from 'styled-components';
// import convert from 'color-convert';

import ButtonSimple from 'components/buttons/ButtonSimple';

// prettier-ignore
const StyledButtonIcon = styled(ButtonSimple)`
  border-radius: 9999px;
  border: 2px solid ${({ theme, disabled }) => disabled ? '#d2d4d6' : theme.global.colors.a};
  stroke: ${({ theme, disabled }) => disabled ? '#d2d4d6' : theme.global.colors.a};
  padding: 5px;
  opacity: 1;
  &:hover {
    border-color: ${({ theme, disabled }) => disabled ? '#d2d4d6' : theme.global.colors.brand};
    stroke: ${({ theme, disabled }) => disabled ? '#d2d4d6' : theme.global.colors.brand};
  }
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    padding: 5px;
  }
`;

const SliderControls = ({
  next, previous, carouselState,
}) => {
  const hasRight = carouselState.currentSlide + carouselState.slidesToShow
    < carouselState.totalItems;
  const hasLeft = carouselState.currentSlide > 0;

  return (
    <Box
      direction="row"
      fill="horizontal"
      justify="center"
      gap="small"
      margin={{ top: 'small' }}
    >
      <Box align="center">
        <StyledButtonIcon
          onClick={previous}
          disabled={!hasLeft}
          plain
        >
          <Previous size="small" style={{ stroke: 'inherit' }} />
        </StyledButtonIcon>
      </Box>
      <Box align="center">
        <StyledButtonIcon
          onClick={next}
          disabled={!hasRight}
        >
          <Next size="small" style={{ stroke: 'inherit' }} />
        </StyledButtonIcon>
      </Box>
    </Box>
  );
};

SliderControls.propTypes = {
  next: PropTypes.func,
  previous: PropTypes.func,
  carouselState: PropTypes.object,
};

export default SliderControls;
