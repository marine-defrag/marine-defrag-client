import { isMinSize } from 'utils/responsive';
import { testEntityCategoryValueAssociation } from 'utils/entities';

export const getDateForChart = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const day = `0${date.getDate()}`.slice(-2);
  return `${year}-${month}-${day}`;
};
export const getDecade = (dateString, isUpper = false) => {
  const year = new Date(dateString).getFullYear();
  return isUpper
    ? Math.ceil(year / 10) * 10
    : Math.floor(year / 10) * 10;
};
export const getXYRange = ({
  minDate,
  maxDate,
}) => ([
  {
    x: new Date(minDate).getTime(),
    y: -5,
  },
  {
    x: new Date(maxDate).getTime(),
    y: 105,
  },
]);

export const getTickValuesX = ({ maxDecade, minDecade }) => {
  const values = [];
  for (let y = minDecade; y <= maxDecade; y += 10) {
    values.push(new Date(y.toString()).getTime());
  }
  return values;
};

export const getPlotHeight = ({ size }) => {
  if (isMinSize(size, 'large')) return 420;
  if (isMinSize(size, 'medium')) return 400;
  return 300;
};

const NEXT_ROW_THRESHOLD = 12; // px
export const prepChartData = ({
  entities,
  chartWidth, // px
  xMin, // ms
  xMax, // ms
  highlightCategory,
}) => {
  // ms per px
  const dx = (xMax - xMin) / chartWidth; // in ms
  const nextRowThresholdTime = dx * NEXT_ROW_THRESHOLD; // in ms
  let rowIndex = 0;
  let maxRowIndex = 0;
  let minRowIndex = 0;
  let rowIndexGroups = 0;
  let xPrevIndividual = 0;
  const data = entities.reduce(
    (memo, entity) => {
      const date = entity.getIn(['attributes', 'date_start']);
      const active = !highlightCategory || testEntityCategoryValueAssociation(entity, 'categories', highlightCategory);
      const color = active ? '#477ad1' : '#EDEFF0';
      // group
      if (entity.get('offspring')) {
        rowIndexGroups -= 1;
        minRowIndex = Math.min(rowIndexGroups, minRowIndex);
        const group = entity.get('offspring').reduce(
          (memoGroup, child) => {
            const dateChild = child.getIn(['attributes', 'date_start']);
            const activeChild = !highlightCategory || testEntityCategoryValueAssociation(child, 'categories', highlightCategory);
            const colorChild = active ? '#477ad1' : '#EDEFF0';
            return [
              ...memoGroup,
              {
                row: rowIndexGroups,
                isGroup: true,
                active: activeChild,
                group: entity.get('id'),
                x: new Date(dateChild).getTime(),
                color: colorChild,
              },
            ];
          },
          [
            {
              row: rowIndexGroups,
              isGroup: true,
              active,
              group: entity.get('id'),
              x: new Date(date).getTime(),
              color,
            },
          ]
        );
        return [...memo, ...group];
      }
      // else individual
      const xCurrent = new Date(date).getTime();
      if ((xCurrent - xPrevIndividual) < nextRowThresholdTime) {
        rowIndex += 1;
      } else {
        rowIndex = 0;
      }
      xPrevIndividual = xCurrent;
      maxRowIndex = Math.max(rowIndex, maxRowIndex);
      return [
        ...memo,
        {
          row: rowIndex,
          active,
          isGroup: false,
          x: xCurrent,
          color,
        },
      ];
    },
    [],
  );
  return {
    chartData: data,
    minRow: minRowIndex,
    maxRow: maxRowIndex,
  };
};
export const mapRowToY = (
  datum, minRow, maxRow,
) => {
  const noRows = maxRow - minRow;
  const rowHeight = 100 / (noRows);
  const y = rowHeight * (datum.row - minRow);
  return 100 - y;
};
