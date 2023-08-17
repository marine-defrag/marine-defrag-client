import { List } from 'immutable';

import qe from 'utils/quasi-equals';
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
export const getFiveYearPeriod = (dateString, isUpper = false) => {
  const year = new Date(dateString).getFullYear();
  return isUpper
    ? Math.ceil(year / 5) * 5
    : Math.floor(year / 5) * 5;
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

const includeOffspringRecursive = ({ children, parent, entities }) => {
  let childrenUpdated;
  // console.log('children', children.toJS())
  // console.log('entities', entities.toList().toJS());
  const childrenDirect = entities.toList().filter(
    (child) => qe(parent.get('id'), child.getIn(['attributes', 'parent_id'])),
  );
  if (childrenDirect && childrenDirect.size > 0) {
    // console.log('childrenDirect', childrenDirect.toJS());
    childrenUpdated = childrenDirect.reduce(
      (memo, child) => {
        // console.log('child', child.toJS())
        const grandChildren = includeOffspringRecursive({
          children: List(),
          parent: child,
          entities,
        });
        // console.log('grandChildren', grandChildren.toJS())
        return memo.concat(grandChildren);
      }, childrenDirect,
    );
    // console.log('childrenUpdated', childrenDirect.toJS());
    return childrenUpdated;
  }
  return children;
};

const getActionsWithOffspring = (actions) => {
  let result;
  if (actions) {
    result = actions.reduce((memo, action) => {
      const parentId = action.getIn(['attributes', 'parent_id']);
      const parent = actions.find((child) => qe(child.get('id'), parentId));
      if (!parent) { // does not have parent => is first generation) {
        const children = includeOffspringRecursive({
          children: List(),
          parent: action,
          entities: actions,
        });
        return memo.push(
          children && children.size > 0
            ? action.set('offspring', children)
            : action
        );
      }
      // const ancestors = includeParentRecursive({ parents: List(), entity: action, entities: actions });
      // console.log('action', action && action.toJS())
      return memo;
    }, List());
  }
  return result;
};

const MERGE_THRESHOLD = 3; // px
const mergeOverlappingAncestors = (
  data,
  dx, // ms per px
) => {
  const threshold = dx * MERGE_THRESHOLD;
  const result = data
    .sort((a, b) => a.x < b.x ? -1 : 1)
    .reduce(
      (memo, item) => {
        if (item.isGroup) {
          const ancestorSameDate = memo.find((i) => item.group === i.group && Math.abs(item.x - i.x) < threshold);
          if (ancestorSameDate) {
            return memo.reduce(
              (memo2, i) => {
                if (item.group === i.group && Math.abs(item.x - i.x) < threshold) {
                  const merged = {
                    ...i,
                    merged: i.merged ? [...i.merged, item] : [item],
                  };
                  return [
                    ...memo2,
                    merged,
                  ];
                }
                return [...memo2, i];
              },
              [],
            );
          }
        }
        return [...memo, item];
      },
      [],
    );
  return result;
};

const highlightForCategory = (data, highlightCategory) => {
  const result = data.map(
    (item) => {
      let highlighted = testEntityCategoryValueAssociation(
        item.action,
        'categories',
        highlightCategory,
      );
      // also check if any merged offspring is active
      if (item.merged && !highlighted) {
        highlighted = item.merged.reduce(
          (memo, child) => memo || testEntityCategoryValueAssociation(
            child.action,
            'categories',
            highlightCategory,
          ),
          false,
        );
      }
      let { color } = item;
      if (!highlighted && !item.hoverActive) {
        color = '#d9dbdc';
      }
      return {
        ...item,
        highlighted,
        color,
      };
    }
  );
  return result;
};

const NEXT_ROW_THRESHOLD = 12; // px
export const prepChartData = ({
  actions, // actionsWithOffspring,
  chartWidth, // px
  xMin, // ms
  xMax, // ms
  highlightCategory,
  hoverId,
  hintId,
}) => {
  const actionsWithOffspring = actions && getActionsWithOffspring(actions);
  // ms per px
  const dx = (xMax - xMin) / chartWidth; // in ms
  const nextRowThresholdTime = dx * NEXT_ROW_THRESHOLD; // in ms
  let rowIndexIndividual = 0;
  let rowIndexGroups = 0;
  let maxRowIndex = 0;
  let minRowIndex = 0;
  let xPrevIndividual = 0;
  const color = '#477ad1';
  let data = actionsWithOffspring && actionsWithOffspring.reduce(
    (memo, action) => {
      const date = action.getIn(['attributes', 'date_start']);
      // const isHint = hintId === action.get('id');
      // group
      if (action.get('offspring')) {
        rowIndexGroups += 1;
        maxRowIndex = Math.max(rowIndexGroups, maxRowIndex);
        const group = action.get('offspring').reduce(
          (memoGroup, child) => {
            const dateChild = child.getIn(['attributes', 'date_start']);
            // const isHintChild = hintId === child.get('id');
            return [
              ...memoGroup,
              {
                id: child.get('id'),
                row: rowIndexGroups,
                y: rowIndexGroups,
                isGroup: true,
                group: action.get('id'),
                x: new Date(dateChild).getTime(),
                hoverActive: hoverId === child.get('id') || hintId === child.get('id'),
                color: (hoverId === child.get('id') || hintId === child.get('id')) ? '#DD7803' : color,
                action: child,
                content: {
                  id: child.get('id'),
                  code: child.getIn(['attributes', 'code']),
                  title: child.getIn(['attributes', 'title']),
                  date: child.getIn(['attributes', 'date_start']),
                },
              },
            ];
          },
          [
            {
              id: action.get('id'),
              row: rowIndexGroups,
              y: rowIndexGroups,
              isGroup: true,
              group: action.get('id'),
              isGroupLabel: true,
              isGroupRoot: true,
              label: action.getIn(['attributes', 'code']) || action.getIn(['attributes', 'title']),
              x: new Date(date).getTime(),
              hoverActive: hoverId === action.get('id') || hintId === action.get('id'),
              color: (hoverId === action.get('id') || hintId === action.get('id')) ? '#DD7803' : color,
              content: {
                id: action.get('id'),
                code: action.getIn(['attributes', 'code']),
                title: action.getIn(['attributes', 'title']),
                date: action.getIn(['attributes', 'date_start']),
              },
              action,
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
          isGroup: false,
          x: xCurrent,
          hoverActive: hoverId === action.get('id') || hintId === action.get('id'),
          color: (hoverId === action.get('id') || hintId === action.get('id')) ? '#DD7803' : color,
          content: {
            id: action.get('id'),
            code: action.getIn(['attributes', 'code']),
            title: action.getIn(['attributes', 'title']),
            date: action.getIn(['attributes', 'date_start']),
          },
          action,
        },
      ];
    },
    [],
  );
  data = mergeOverlappingAncestors(data, dx);
  data = highlightCategory
    ? highlightForCategory(data, highlightCategory)
    : data;
  return {
    chartData: data,
    minRow: minRowIndex,
    maxRow: maxRowIndex,
  };
};
export const prepLineChartData = (chartData, highlightCategory) => {
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
    const groupActive = !highlightCategory || groupData.every((point) => point.active);
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
