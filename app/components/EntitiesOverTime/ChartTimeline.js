import React, {
  useEffect, useLayoutEffect, useState, useRef,
} from 'react';
import { injectIntl, intlShape } from 'react-intl';
import PropTypes from 'prop-types';
import { List } from 'immutable';
import styled from 'styled-components';
import { ResponsiveContext } from 'grommet';
import { utcFormat as timeFormat } from 'd3-time-format';

import {
  FlexibleWidthXYPlot,
  LineSeries,
  XAxis,
  VerticalGridLines,
  MarkSeries,
  AreaSeries,
  LabelSeries,
} from 'react-vis';

// import { sortEntities } from 'utils/sort';
//
import {
  getActionsWithOffspring,
  getPlotHeight,
  getTickValuesX,
  getDateForChart,
  prepChartData,
  prepLineChartData,
  getDecade,
  // mapRowToY,
} from './charts';

import PlotHintContent from './PlotHintContent';


const YearLabel = styled.text`
  fill: black;
  font-size: 12px;
  text-anchor: start;
`;
const ChartWrapper = styled.div`
  position: relative;
`;

const myTimeFormat = (value) => {
  const formatted = timeFormat('%Y')(value);
  return <YearLabel dx="2">{formatted}</YearLabel>;
};

export function ChartTimeline({
  entities,
  highlightCategory,
  intl,
  setHint,
  hint,
  onEntityClick,
}) {
  const targetRef = useRef();
  const [chartWidth, setChartWidth] = useState(0);

  const handleResize = () => {
    if (targetRef.current) {
      setChartWidth(targetRef.current.offsetWidth);
    }
  };
  const handleClickOutside = (event) => {
    if (targetRef.current && !targetRef.current.contains(event.target)) {
      setHint(null);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);
  // useLayoutEffect(() => {
  //   if (targetRef.current) {
  //     setChartWidth(targetRef.current.offsetWidth);
  //   }
  // }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useLayoutEffect(() => {
    handleResize();
    setHint(null);
  }, []);
  const actionsWithOffspring = entities && getActionsWithOffspring(entities);

  const minDate = getDateForChart(
    entities.first().getIn(['attributes', 'date_start']),
  );
  const maxDate = getDateForChart(
    entities.last().getIn(['attributes', 'date_start']),
  );
  // show yearly ticks
  const minDecade = getDecade(minDate);
  const maxDecade = getDecade(maxDate, true);
  const tickValuesX = getTickValuesX(
    { minDecade, maxDecade }
  );
  const size = React.useContext(ResponsiveContext);
  const chartHeight = getPlotHeight({ size });

  // console.log('tickValuesX', tickValuesX);
  // console.log('chartWidth', chartWidth);
  // console.log('chartHeight', chartHeight);
  const xMin = new Date(`${minDecade}-01-01`).getTime();
  const xMax = new Date(`${maxDecade}-01-01`).getTime();
  const { chartData, minRow, maxRow } = prepChartData({
    actionsWithOffspring,
    chartWidth,
    xMin,
    xMax,
    highlightCategory,
    hintId: hint ? hint.id : null,
  });

  const dataForceXYRange = [
    { x: xMin, y: minRow - 1 },
    { x: xMax, y: minRow - 1 },
    { x: xMax, y: maxRow + 1 },
    { x: xMin, y: maxRow + 1 },
  ];

  const linesData = prepLineChartData(chartData);
  const labels = chartData.reduce((memo, d) => {
    if (d.isGroupLabel) {
      return [
        ...memo,
        {
          ...d,
          // yOffset: -8,
          xOffset: -15,
          style: {
            fontSize: 12,
            color: '#000000',
            fill: '#000000',
          },
        },
      ];
    }
    return memo;
  }, []);
  // console.log('line data ', linesData);
  console.log('chartData', chartData);
  // console.log('noRows', noRows)
  // console.log('dataForceXYRange', dataForceXYRange)
  // console.log('hint', hint);
  const chartDataOrdered = highlightCategory
    ? chartData.sort((a, b) => a.active && !b.active ? 1 : -1)
    : chartData;

  return (
    <div ref={targetRef}>
      <ChartWrapper>
        {chartData && (
          <FlexibleWidthXYPlot
            height={chartHeight}
            xType="time"
            style={{ fill: 'transparent' }}
            margin={{
              bottom: 30,
              top: 20,
              right: 32,
              left: 32,
            }}
          >
            <AreaSeries
              data={dataForceXYRange}
              style={{ stroke: '#ffffff', fill: '#ffffff' }}
              onSeriesClick={() => setHint(null)}
            />
            <VerticalGridLines
              tickValues={tickValuesX}
              style={{
                stroke: 'rgba(136, 150, 160, 0.4)',
              }}
            />
            {/* tickmarks as vertical gridlines and date */}
            <XAxis
              tickFormat={(val) => myTimeFormat(val, intl)}
              tickSizeInner={0}
              tickSizeOuter={20}
              style={{
                ticks: { strokeWidth: 1, stroke: 'rgba(136, 150, 160, 0.4)' },
              }}
              tickValues={tickValuesX}
              tickPadding={-12}
            />
            <LabelSeries
              data={labels}
              labelAnchorX="end"
              labelAnchorY="middle"
              allowOffsetToBeReversed={false}
            />
            {linesData && linesData.length > 0 && linesData.map(
              (group) => (
                <LineSeries
                  key={group.id}
                  data={group.points}
                  style={{
                    stroke: group.active ? '#477ad1' : '#d9dbdc',
                    strokeWidth: 1,
                  }}
                />
              )
            )}
            <MarkSeries
              data={chartDataOrdered}
              colorType="literal"
              size={4}
              opacity={1}
            />
            {hint && (
              <MarkSeries
                data={[hint]}
                color="#1b4080"
                size={4}
                style={{
                  cursor: 'pointer',
                }}
              />
            )}
            <MarkSeries
              data={chartDataOrdered}
              colorType="literal"
              size={8}
              opacity={0.3}
              onValueClick={(point) => {
                if (!hint || hint.id !== point.id) {
                  setHint(point);
                } else if (hint.id === point.id) {
                  setHint(null);
                }
              }}
              style={{
                cursor: 'pointer',
              }}
            />
            {hint && (
              <MarkSeries
                data={[hint]}
                color="#1b4080"
                size={8}
                opacity={0.3}
                onValueClick={() => setHint(null)}
                style={{
                  cursor: 'pointer',
                }}
              />
            )}
            <PlotHintContent hint={hint} entities={entities} onEntityClick={onEntityClick} />
          </FlexibleWidthXYPlot>
        )}
      </ChartWrapper>
    </div>
  );
}

ChartTimeline.propTypes = {
  entities: PropTypes.instanceOf(List),
  highlightCategory: PropTypes.string,
  setHint: PropTypes.func,
  hint: PropTypes.object,
  intl: intlShape.isRequired,
  onEntityClick: PropTypes.func,
};

export default injectIntl(ChartTimeline);
