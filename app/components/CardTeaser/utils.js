import {
  cleanupSearchTarget,
  startsWith,
  regExMultipleWords,
  lowerCase,
} from 'utils/string';

export const prepCountries = (countries, search) => countries
  && countries
    .map((country) => ({
      code: country.getIn(['attributes', 'code']),
      label: country.getIn(['attributes', 'title']),
      typeId: country.get('id'),
    }))
    .filter((country) => filterCountry(country, search))
    .sort((a, b) => (a.label < b.label ? -1 : 1));

export const filterCountry = (country, search) => {
  if (!search || search.length < 2) return true;
  try {
    const regex = new RegExp(regExMultipleWords(search), 'i');
    return (
      startsWith(lowerCase(country.code), lowerCase(search))
      || regex.test(cleanupSearchTarget(country.label))
    );
  } catch (e) {
    return true;
  }
};
