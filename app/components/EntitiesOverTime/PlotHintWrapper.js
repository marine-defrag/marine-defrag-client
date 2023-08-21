import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import PlotHintContent from './PlotHintContent';

const Styled = styled.div`
pointer-events: none;
margin: 4px 0px;
`;

const PlotHintInner = styled.div`
  max-width: 300px;
  color: ${({ color, theme }) => theme.global.colors[color]};
  background: ${({ theme }) => theme.global.colors.white};
  padding: 5px 10px;
  border-radius: ${({ theme }) => theme.global.edgeSize.xxsmall};
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.2);
  font-weight: 700;
  pointer-events: auto;
`;

const WrapChild = styled.div`
  border-top: 1px solid rgba(136, 150, 160, 0.4);
  margin-top: 5px;
  padding-top: 5px;
`;

const PlotHintWrapper = ({ hint, onEntityClick, onClose }) => (
  <Styled>
    <PlotHintInner>
      <PlotHintContent
        hint={hint}
        onEntityClick={onEntityClick}
        onClose={onClose}
      />
      {hint.merged && hint.merged.map(
        (otherHint) => (
          <WrapChild
            key={otherHint.id}
          >
            <PlotHintContent
              hint={otherHint}
              onEntityClick={onEntityClick}
            />
          </WrapChild>
        )
      )}
    </PlotHintInner>
  </Styled>
);

PlotHintWrapper.propTypes = {
  hint: PropTypes.object.isRequired,
  onEntityClick: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default PlotHintWrapper;
