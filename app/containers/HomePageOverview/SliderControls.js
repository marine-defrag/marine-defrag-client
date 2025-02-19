/**
 *
 * SliderControls
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

import { Box } from 'grommet';

import styled from 'styled-components';

import Icon from 'components/Icon';
import ButtonSimple from 'components/buttons/ButtonSimple';

// prettier-ignore
const StyledButtonIcon = styled(ButtonSimple)`
  color: ${({ theme, disabled }) => disabled ? '#d2d4d6' : theme.global.colors.a};
  opacity: 1;
  &:hover {
    color: ${({ theme, disabled }) => disabled ? '#d2d4d6' : theme.global.colors.brand};
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
          title="Click to show previous navigation options"
          tabIndex={-1}
          onClick={previous}
          disabled={!hasLeft}
          plain
        >
          <Icon name="arrowCircle" rotate={180} />
        </StyledButtonIcon>
      </Box>
      <Box align="center">
        <StyledButtonIcon
          title="Click to show next navigation options"
          tabIndex={-1}
          onClick={next}
          disabled={!hasRight}
        >
          <Icon name="arrowCircle" />
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
