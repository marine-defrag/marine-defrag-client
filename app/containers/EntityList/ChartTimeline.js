import React from 'react';
// import React, { useEffect } from 'react';
import { injectIntl, intlShape } from 'react-intl';
import PropTypes from 'prop-types';
import { List } from 'immutable';
import styled from 'styled-components';
import { ResponsiveContext } from 'grommet';
import { utcFormat as timeFormat } from 'd3-time-format';

import {
  FlexibleWidthXYPlot,
  // LineSeries,
  XAxis,
  VerticalGridLines,
  MarkSeries,
  AreaSeries,
  // Hint,
} from 'react-vis';

// import { sortEntities } from 'utils/sort';
//
// import { getActionsWithOffspring } from './utils';
import {
  getPlotHeight,
  getTickValuesX,
  getDateForChart,
  getXYRange,
  prepChartData,
  getDecade,
} from './charts';

const YearLabel = styled.text`
  fill: black;
  font-size: 12px;
  text-anchor: start;
`;

const myTimeFormat = (value) => {
  const formatted = timeFormat('%Y')(value);
  return <YearLabel dx="2">{formatted}</YearLabel>;
};

export function ChartTimeline({
  entities,
  intl,
}) {
  // const actionsWithOffspring = entities && getActionsWithOffspring(entities);
  //
  // const actionsGrouped = actionsWithOffspring.groupBy(
  //   (action) => action.get('offspring') && action.get('offspring').size > 0
  //     ? 'with'
  //     : 'without'
  // );
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
  const dataForceXYRange = getXYRange(
    { minDate: `${minDecade}-01-01`, maxDate: `${maxDecade}-01-01` }
  );
  const size = React.useContext(ResponsiveContext);
  const chartHeight = getPlotHeight({ size });
  // console.log('tickValuesX', tickValuesX);

  const chartData = prepChartData({
    entities,
  });
  // console.log('chartData', chartData)
  return (
    <div style={{ position: 'relative' }}>
      {chartData && (
        <FlexibleWidthXYPlot
          height={chartHeight}
          xType="time"
          style={{ fill: 'transparent' }}
          margin={{
            bottom: 30,
            top: 0,
            right: 32,
            left: 32,
          }}
        >
          <AreaSeries data={dataForceXYRange} style={{ opacity: 0 }} />
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
          <MarkSeries
            data={chartData}
            colorType="literal"
            size={5}
          />
        </FlexibleWidthXYPlot>
      )}
    </div>
  );
}
//
// <Box margin={{ vertical: 'large' }}>
//   <Text color="textSecondary" size="large">Actions with Children</Text>
// </Box>
// <Box gap="medium">
//   {actionsGrouped
//     && actionsGrouped.get('with')
//     && actionsGrouped.get('with').valueSeq().map(
//       (action) => (
//         <Box key={action.get('id')}>
//           <Box>
//             <Text size="small">
//               {intl.formatDate(new Date(action.getIn(['attributes', 'date_start'])))}
//             </Text>
//             <Box direction="row" gap="small">
//               {action.getIn(['attributes', 'code']) && (
//                 <Text size="small" color="textSecondary">
//                   {action.getIn(['attributes', 'code'])}
//                 </Text>
//               )}
//               <Text size="small">
//                 {action.getIn(['attributes', 'title'])}
//               </Text>
//             </Box>
//           </Box>
//           {action.get('offspring') && action.get('offspring').size > 0 && (
//             <Box margin={{ left: 'large', top: 'small' }}>
//               <Box gap="small">
//                 {sortEntities(
//                   action.get('offspring'),
//                   'asc',
//                   'date_start', // sortBy
//                   'date', // type
//                 ).map((child) => (
//                   <Box key={child.get('id')}>
//                     <Text size="small">
//                       {intl.formatDate(new Date(child.getIn(['attributes', 'date_start'])))}
//                     </Text>
//                     <Text size="small">
//                       {child.getIn(['attributes', 'title'])}
//                     </Text>
//                   </Box>
//                 ))}
//               </Box>
//             </Box>
//           )}
//         </Box>
//       )
//     )}
// </Box>
// <Box margin={{ vertical: 'large' }}>
//   <Text color="textSecondary" size="large">Actions without Children</Text>
// </Box>
// <Box gap="medium">
//   {actionsGrouped
//     && actionsGrouped.get('without')
//     && actionsGrouped.get('without').valueSeq().map(
//       (action) => (
//         <Box key={action.get('id')}>
//           <Box>
//             <Text size="small">
//               {intl.formatDate(new Date(action.getIn(['attributes', 'date_start'])))}
//             </Text>
//             <Text size="small">
//               {action.getIn(['attributes', 'title'])}
//             </Text>
//           </Box>
//         </Box>
//       )
//     )}
// </Box>

ChartTimeline.propTypes = {
  entities: PropTypes.instanceOf(List),
  intl: intlShape.isRequired,
};

export default injectIntl(ChartTimeline);
