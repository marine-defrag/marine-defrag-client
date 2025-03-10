/**
 *
 * Overview
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

import SliderControls from './SliderControls';

// prettier-ignore
const SliderWrapper = styled.div`
  position: relative;
  margin: 0;
  width: 100%;
`;

export function Slider({
  // stretch,
  children,
  cardNumber,
}) {
  // prettier-ignore
  const responsive = {
    all: {
      breakpoint: {
        min: 0,
        max: 9999,
      },
      items: cardNumber,
    },
  };
  return (
    <SliderWrapper>
      <Carousel
        responsive={responsive}
        swipeable
        draggable={false}
        slidesToSlide={cardNumber}
        arrows={false}
        customButtonGroup={
          <SliderControls />
        }
        renderButtonGroupOutside
      >
        {children}
      </Carousel>
    </SliderWrapper>
  );
}

Slider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  // stretch: PropTypes.bool,
  cardNumber: PropTypes.number,
};

export default Slider;
