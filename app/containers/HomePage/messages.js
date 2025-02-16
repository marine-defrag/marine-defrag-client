/*
 * HomePage Messages
 *
 * This contains all the text for the HomePage component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  pageTitle: {
    id: 'app.containers.HomePage.pageTitle',
    defaultMessage: 'Sadata Home',
  },
  metaDescription: {
    id: 'app.containers.HomePage.metaDescription',
    defaultMessage: 'Home page description',
  },
  introGuest: {
    id: 'app.containers.HomePage.introGuest',
    defaultMessage: 'intro guest',
  },
  // signingIn: {
  //   id: 'app.containers.HomePage.signingIn',
  //   defaultMessage: 'Signing in...',
  // },
  // loading: {
  //   id: 'app.containers.HomePage.loading',
  //   defaultMessage: 'Loading initial data...',
  // },
  notSignedIn: {
    id: 'app.containers.HomePage.notSignedIn',
    defaultMessage: 'Please sign in or register to use this platform',
  },
});
