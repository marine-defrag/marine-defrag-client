/*
 * UserRegister Messages
 *
 * This contains all the text for the UserRegister component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  pageTitle: {
    id: 'app.containers.UserRegister.pageTitle',
    defaultMessage: 'Register',
  },
  metaDescription: {
    id: 'app.containers.UserRegister.metaDescription',
    defaultMessage: 'Register User page description',
  },
  header: {
    id: 'app.containers.UserRegister.header',
    defaultMessage: 'Register',
  },
  loginLinkBefore: {
    id: 'app.containers.UserLogin.loginLinkBefore',
    defaultMessage: 'Already have an account? ',
  },
  loginLink: {
    id: 'app.containers.UserLogin.loginLink',
    defaultMessage: 'Sign in here',
  },
  submit: {
    id: 'app.containers.UserRegister.submit',
    defaultMessage: 'Register',
  },
  registerHint: {
    id: 'app.containers.UserRegister.registerHint',
    defaultMessage: 'Once registered and signed in, please contact the administrator to request full access using the contact form (linked on the home page and in the site footer)',
  },
});
