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
  actionsWithOffspring,
  chartWidth, // px
  xMin, // ms
  xMax, // ms
  highlightCategory,
  // hintId,
}) => {
  // ms per px
  const dx = (xMax - xMin) / chartWidth; // in ms
  const nextRowThresholdTime = dx * NEXT_ROW_THRESHOLD; // in ms
  let rowIndexIndividual = 0;
  let rowIndexGroups = 0;
  let maxRowIndex = 0;
  let minRowIndex = 0;
  let xPrevIndividual = 0;
  const data = actionsWithOffspring.reduce(
    (memo, action) => {
      const date = action.getIn(['attributes', 'date_start']);
      // const isHint = hintId === action.get('id');
      const active = !highlightCategory
        || testEntityCategoryValueAssociation(
          action,
          'categories',
          highlightCategory,
        );
      const color = active ? '#477ad1' : '#d9dbdc';
      // group
      if (action.get('offspring')) {
        rowIndexGroups += 1;
        maxRowIndex = Math.max(rowIndexGroups, maxRowIndex);
        const group = action.get('offspring').reduce(
          (memoGroup, child) => {
            const dateChild = child.getIn(['attributes', 'date_start']);
            const activeChild = !highlightCategory || testEntityCategoryValueAssociation(child, 'categories', highlightCategory);
            // const isHintChild = hintId === child.get('id');
            const colorChild = activeChild ? '#477ad1' : '#d9dbdc';
            return [
              ...memoGroup,
              {
                id: child.get('id'),
                row: rowIndexGroups,
                y: rowIndexGroups,
                isGroup: true,
                active: activeChild,
                group: action.get('id'),
                x: new Date(dateChild).getTime(),
                color: colorChild,
                title: child.getIn(['attributes', 'title']),
              },
            ];
          },
          [
            {
              id: action.get('id'),
              row: rowIndexGroups,
              y: rowIndexGroups,
              isGroup: true,
              active,
              group: action.get('id'),
              isGroupLabel: true,
              isGroupRoot: true,
              label: action.getIn(['attributes', 'code']) || action.getIn(['attributes', 'title']),
              x: new Date(date).getTime(),
              color,
              title: action.getIn(['attributes', 'title']),
            },
          ]
        );
        return [...memo, ...group];
      }
      // else individual
      const xCurrent = new Date(date).getTime();
      if ((xCurrent - xPrevIndividual) < nextRowThresholdTime) {
        rowIndexIndividual -= 0.5;
      } else {
        rowIndexIndividual = 0;
      }
      xPrevIndividual = xCurrent;
      minRowIndex = Math.min(rowIndexIndividual, minRowIndex);
      return [
        ...memo,
        {
          id: action.get('id'),
          row: rowIndexIndividual,
          y: rowIndexIndividual,
          active,
          isGroup: false,
          x: xCurrent,
          color,
          title: action.getIn(['attributes', 'title']),
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
export const prepLineChartData = (chartData) => {
  const groupRoots = chartData.filter((point) => point.isGroupRoot);
  return groupRoots.reduce((memo, rootPoint) => {
    const groupData = chartData.reduce(
      (memo2, point) => {
        if (point.group === rootPoint.id) {
          return [...memo2, point];
        }
        return memo2;
      }, [rootPoint]
    );
    const groupActive = groupData.every((point) => point.active);
    return [
      ...memo,
      {
        id: rootPoint.id,
        active: groupActive,
        points: groupData,
      },
    ];
  }, []);
};

export const mapRowToY = (
  datum, minRow, maxRow,
) => {
  const noRows = maxRow - minRow;
  const rowHeight = 100 / (noRows);
  const y = rowHeight * (datum.row - minRow);
  return 100 - y;
};
