import { isMinSize } from 'utils/responsive';

const randomiseInRange = (min, max) => Math.random() * (max - min + 1) + min;

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
}) => {
  const yMax = 5;
  const yMin = -5;
  return [
    {
      x: new Date(minDate).getTime(),
      y: yMin,
    },
    {
      x: new Date(maxDate).getTime(),
      y: yMax,
    },
  ];
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

export const prepChartData = ({ entities }) => {
  const data = entities.reduce(
    (memo, entity) => {
      const date = entity.getIn(['attributes', 'date_start']);
      return [
        ...memo,
        {
          y: randomiseInRange(-4, 4),
          x: new Date(date).getTime(),
          color: entity.getIn(['attributes', 'color']),
        },
      ];
    },
    [],
  );
  return data;
};
