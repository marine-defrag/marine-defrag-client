import React from 'react';
import styled from 'styled-components';
import {
  LineSeries,
  MarkSeries,
  XYPlot,
} from 'react-vis';
import { FormattedMessage } from 'react-intl';

import messages from './messages';

const Styled = styled.div`
position:relative;
`;
const Label = styled.span`
  color: #787A7D;
  font-size: 12px;
  position: absolute;
  top: 21%;
  left: ${({ left }) => left}px;
  transform: translate(50%, -50%);
`;

const commitmentMarkerProps = {
  data: [{ x: 0, y: 20 }, { x: 90, y: 20 }, { x: 110, y: 20 }],
  colorType: 'literal',
  color: '#477ad1',
};
const lineMarkerProps = {
  data: [{ x: 90, y: 20 }, { x: 110, y: 20 }],
};

const ChartTimelineLegend = () => (
  <Styled>
    <XYPlot
      width={200}
      height={50}
    >
      <MarkSeries
        {...commitmentMarkerProps}
        key="commitment-marker-larger"
        size={8}
        opacity={0.3}
      />
      <MarkSeries
        {...commitmentMarkerProps}
        key="commitment-marker-smaller"
        size={4}
        opacity={1}
      />
      <LineSeries {...lineMarkerProps} style={{ stroke: '#477ad1', strokeWidth: 1 }} />
    </XYPlot>
    <Label left={13}><FormattedMessage {...messages.legend.commitments} /></Label>
    <Label left={140}><FormattedMessage {...messages.legend.relatedCommitments} /></Label>
  </Styled>
);

export default ChartTimelineLegend;
