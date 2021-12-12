import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ButtonSecondary from 'components/buttons/ButtonSecondary';
import ButtonClose from 'components/buttons/ButtonClose';

const Root = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 2501;
  @media (min-width: ${({ theme }) => theme.breakpoints.medium}) {
    bottom: auto;
    right: auto;
    top: ${({ position }) => position ? position.y : 10}px;
    right: ${({ position }) => position ? 'auto' : '10px'};
    left: ${({ position }) => position ? position.x : 'auto'};
  }
`;

// const BlockMouse = styled.div`
//   position: absolute;
//   top: -40px;
//   left: ${({ dirLeft }) => (dirLeft ? '-60px' : '0px')};
//   width: 60px;
//   background: transparent];
//   height: 60px;
//   display: block;
// `;

// prettier-ignore
const Anchor = styled.div`
  @media (min-width: ${({ theme }) => theme.breakpoints.medium}) {
    position: absolute;
    top: ${({ xy }) => xy.y}px;
    left: ${({ dirLeft, xy, w }) => dirLeft ? -1 * (xy.x + w) : xy.x}px;
    &::after {
      content: '';
      width: 0;
      height: 0;
      border-style: solid;
      display: inline-block;
      border-width: ${({ dirLeft }) => dirLeft ? '7px 0 7px 10px' : '7px 10px 7px 0'};
      border-color: ${({ dirLeft }) => dirLeft ? 'transparent transparent transparent white' : 'transparent white transparent transparent'};
      position: relative;
      top: -7px;
      left: ${({ dirLeft, w }) => (dirLeft ? w - 10 : 'auto')}${({ dirLeft }) => (dirLeft ? 'px' : '')};
    }
  }
`;

// eslint-ebable prefer-template
// border-right-color: ${({ dirLeft }) => (!dirLeft ? 'white' : 'transparent')};

const Stats = styled.div`
  padding-bottom: 12px;
`;
const ButtonWrap = styled.div`
  margin-left: auto;
  position: absolute;
  bottom: 10px;
  right: 20px;
`;
const Main = styled.div`
  padding: 20px;
  height: 235px;
  box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.2);
  display: block;
  background: white;
  width: 100%;
  overflow: auto;
  @media (min-width: ${({ theme }) => theme.breakpoints.medium}) {
    min-height: 200px;
    max-height: 80vH;
    height: auto;
    overflow: visible;
    position: absolute;
    top: ${({ position }) => position ? -40 : 0}px;
    left: ${({ dirLeft }) => (dirLeft ? -10 : 10)}px;
    width: ${({ w }) => w}px;
    pointer-events: all;
  }
`;
const CloseWrap = styled.div`
  width: 30px;
  height: 30px;
  position: absolute;
  right: 12px;
  top: 10px;
  @media (min-width: ${({ theme }) => theme.breakpoints.medium}) {
    right: -10px;
    top: -10px;
  }
`;

const TTContent = styled.div`
  font-size: ${(props) => props.theme.sizes.text.small};
`;

const TTTitle = styled.h3`
  margin-top: 0;
`;

// const CloseButton = styled.button`
//   border-radius: 9999px;
//   box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.2);
//   background: black;
// `;

const WIDTH = 320;

const Tooltip = ({
  position,
  direction,
  feature,
  onClose,
  onFeatureClick,
}) => (
  // const layer = layerOptions ? layerOptions.layer : null;
  // console.log('feature', feature, position, direction)
  // prettier-ignore
  <Root position={position}>
    <Anchor dirLeft={direction.x === 'left'} w={WIDTH} xy={{ x: 0, y: 0 }}>
      <Main
        dirLeft={direction.x === 'left'}
        w={WIDTH}
      >
        <CloseWrap>
          <ButtonClose onClose={onClose} />
        </CloseWrap>
        <TTTitle>{feature.attributes.title}</TTTitle>
        <Stats>
          {typeof feature.values.actions !== 'undefined' && (
            <TTContent>
              {`Activities: ${feature.values.actions}`}
            </TTContent>
          )}
          {typeof feature.values.targetingActions !== 'undefined' && (
            <TTContent>
              {`As target of activity: ${feature.values.targetingActions}`}
            </TTContent>
          )}
        </Stats>
        <ButtonWrap>
          <ButtonSecondary onClick={onFeatureClick}>
            Details
          </ButtonSecondary>
        </ButtonWrap>
      </Main>
    </Anchor>
  </Root>
);
// };
// <CloseWrap>
// <CloseButton
// onClick={() => onClose()}
// style={{
//   textAlign: 'center',
// }}
// />
// </CloseWrap>

Tooltip.propTypes = {
  position: PropTypes.object,
  direction: PropTypes.object, // x, y
  feature: PropTypes.object,
  onClose: PropTypes.func,
  onFeatureClick: PropTypes.func,
};

export default Tooltip;
