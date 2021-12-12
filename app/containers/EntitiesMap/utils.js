export const getRange = (allFeatures, attribute) => allFeatures.reduce(
  (range, f) => {
    const val = f.properties && parseFloat(f.properties[attribute]);
    return {
      min: range.min ? Math.min(range.min, val) : val,
      max: range.min ? Math.max(range.max, val) : val,
    };
  },
  {
    min: null,
    max: null,
  },
);
