/*
 * Header Messages
 *
 * This contains all the text for the Header container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.CardTeaser';

export default defineMessages({
  search: {
    id: `${scope}.search`,
    defaultMessage: 'Search',
  },
  allSearch: {
    id: `${scope}.allSearch`,
    defaultMessage: 'Search country',
  },
  exampleSearch: {
    id: `${scope}.exampleSearch`,
    defaultMessage: 'e.g. try "Fiji" or "Brazil"',
  },
  countrySearch: {
    id: `${scope}.countrySearch`,
    defaultMessage: 'Search country',
  },
  noResults: {
    id: `${scope}.noResults`,
    defaultMessage: 'We are sorry! Your search did not return any results.',
  },
  optionGroups: {
    overview: {
      id: `${scope}.optionGroups.overview`,
      defaultMessage: 'Overview',
    },
    countries: {
      id: `${scope}.optionGroups.countries`,
      defaultMessage: 'Country profiles',
    },
  },
});
