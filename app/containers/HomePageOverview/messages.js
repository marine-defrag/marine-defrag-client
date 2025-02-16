/*
 * HomePage Messages
 *
 * This contains all the text for the HomePage component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  intro: {
    id: 'app.containers.HomePageOverview.intro',
    defaultMessage: 'intro authenticated',
  },
  goTo: {
    id: 'app.containers.HomePageOverview.goTo',
    defaultMessage: 'Go directly to',
  },
  noRoleAssigned: {
    id: 'app.containers.HomePageOverview.noRoleAssigned',
    defaultMessage: 'You do not have sufficient rights to access the content of this platform. Please contact the platform administrator',
  },
  teaserActions: {
    id: 'app.containers.HomePageOverview.teaserActions',
    defaultMessage: 'Get an overview what **frameworks, strategies and policies** exist globally to combat marine litter and plastic pollution.',
  },
  teaserActors: {
    id: 'app.containers.HomePageOverview.teaserActors',
    defaultMessage: 'Get insights into different **actors** and their **activities and measures** taken to combat marine litter and plastic pollution.',
  },
  teaserFacts: {
    id: 'app.containers.HomePageOverview.teaserFacts',
    defaultMessage: 'Find **publications** and **data sets** available relevant for marine litter and plastic pollution.',
  },
});
