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
  Hint,
} from 'react-vis';

import { isMinSize } from 'utils/responsive';
//
import {
  getPlotHeight,
  getTickValuesX,
  getDateForChart,
  prepChartData,
  prepLineChartData,
  getDecade,
  getFiveYearPeriod,
  // mapRowToY,
} from './charts';

import PlotHintWrapper from './PlotHintWrapper';

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
  hoverId,
  setHover,
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

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useLayoutEffect(() => {
    handleResize();
    setHint(null);
  }, []);

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
  const xMin = new Date(`${getFiveYearPeriod(minDate)}-01-01`).getTime();
  const xMax = new Date(`${getFiveYearPeriod(maxDate)}-01-01`).getTime();
  const { chartData, minRow, maxRow } = prepChartData({
    actions: entities,
    chartWidth,
    xMin,
    xMax,
    highlightCategory,
    hoverId,
    hintId: hint ? hint.id : null,
  });
  const linesData = prepLineChartData(chartData, highlightCategory);
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
  // console.log('chartData', chartData);
  // console.log('noRows', noRows)
  // console.log('dataForceXYRange', dataForceXYRange)
  // console.log('hint', hint);
  const chartDataOrdered = (hint || highlightCategory)
    ? chartData.sort(
      (a, b) => {
        if (a.hoverActive && !b.hoverActive) {
          return 1;
        }
        if (b.hoverActive && !a.hoverActive) {
          return -1;
        }
        return a.highlighted && !b.highlighted ? 1 : -1;
      }
    )
    : chartData;

  const dataForceXYRange = [
    { x: xMin, y: minRow - 1 },
    { x: xMax, y: minRow - 1 },
    { x: xMax, y: maxRow + 1 },
    { x: xMin, y: maxRow + 1 },
  ];
  return (
    <div ref={targetRef}>
      <ChartWrapper>
        {chartData && (
          <FlexibleWidthXYPlot
            height={chartHeight}
            xType="time"
            style={{
              fill: 'transparent',
              cursor: 'pointer',
            }}
            margin={{
              bottom: 30,
              top: 20,
              right: 32,
              left: 32,
            }}
            onMouseLeave={() => setHover(null)}
            onClick={() => {
              if (hoverId) {
                const d = chartData.find((item) => item.id === hoverId);
                if (hint && d.id === hint.id) {
                  setHint(null);
                } else {
                  setHint(d);
                }
              }
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
                ticks: { strokeWidth: 1, stroke: ' ' },
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
            <MarkSeries
              data={chartDataOrdered}
              colorType="literal"
              size={8}
              opacity={0.3}
              onNearestXY={(point) => setHover(point.id)}
            />
            {hint && isMinSize(size, 'medium') && (
              <Hint
                value={hint}
                style={{
                  pointerEvents: 'none',
                  margin: '10px 0',
                }}
              >
                <PlotHintWrapper
                  hint={hint}
                  onEntityClick={onEntityClick}
                  onClose={() => setHint(null)}
                />
              </Hint>
            )}
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
  setHover: PropTypes.func,
  hint: PropTypes.object,
  hoverId: PropTypes.string,
  intl: intlShape.isRequired,
  onEntityClick: PropTypes.func,
};

export default injectIntl(ChartTimeline);
