import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import PlotHintSimpleContent from './PlotHintSimpleContent';

const Styled = styled.div`
pointer-events: none;
margin: 2px 0px;
`;

const PlotHintInner = styled.div`
  max-width: 300px;
  color: ${({ color, theme }) => theme.global.colors[color]};
  background: ${({ theme }) => theme.global.colors.white};
  padding: 5px 10px;
  border-radius: ${({ theme }) => theme.global.edgeSize.xxsmall};
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.3);
  font-weight: 700;
`;

const PlotHintSimpleWrapper = ({ hint }) => (
  <Styled>
    <PlotHintInner>
      <PlotHintSimpleContent
        hint={hint}
        more={hint.merged && hint.merged.length}
      />
    </PlotHintInner>
  </Styled>
);

PlotHintSimpleWrapper.propTypes = {
  hint: PropTypes.object.isRequired,
};

export default PlotHintSimpleWrapper;
