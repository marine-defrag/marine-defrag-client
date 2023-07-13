import React from 'react';
import styled from 'styled-components';
import {
  LineSeries,
  MarkSeries,
  XYPlot,
} from 'react-vis';

const Styled = styled.div`
position:relative;
`;

const Label = styled.span`
  position: absolute;
  top: 45%;
  left: ${({ left }) => left};
  transform: translate(50%, -50%);
  color: #787A7D;
`;
const dataPoints = [{ x: 4, y: 5 }, { x: 13, y: 5 }, { x: 16, y: 5 }];
const ChartTimelineLegend = () => (
  <Styled>
    <XYPlot
      width={300}
      height={25}
    >
      <LineSeries key="timline-legend-line-1" data={[{ x: 13, y: 5 }, { x: 16, y: 5 }]} style={{ stroke: '#477ad1', strokeWidth: 1 }} />
      <MarkSeries
        data={dataPoints}
        key="timline-legend-markseries-1"
        color="#477ad1"
        colorType="literal"
        size={8}
        opacity={0.3}
      />
      <MarkSeries
        data={dataPoints}
        key="timeline-legend-markseries-2"
        color="#477ad1"
        colorType="literal"
        size={4}
        opacity={1}
      />
    </XYPlot>
    <Label left="-7px">Committments</Label>
    <Label left="210px">Related Committments</Label>
  </Styled>
);


export default ChartTimelineLegend;
