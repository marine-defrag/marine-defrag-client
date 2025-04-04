/*
 * Footer Messages
 *
 * This contains all the text for the HomePage component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  disclaimer: {
    id: 'app.containers.Footer.disclaimer',
    defaultMessage: 'Every care has been taken to ensure the accuracy of this data and information. Please send any feedback to ',
  },
  contactHint: {
    id: 'app.containers.Footer.contactHint',
    defaultMessage: 'Every care has been taken to ensure the accuracy of this data and information. Please send any feedback to ',
  },
  contactUs: {
    id: 'app.containers.Footer.contactUs',
    defaultMessage: 'Contact us',
  },
  responsible: {
    text: {
      id: 'app.containers.Footer.responsible.text',
      defaultMessage: 'Publisher\'s note, eg please visit our website to learn more about human rights',
    },
    textWithInternalLink: {
      id: 'app.containers.Footer.responsible.textWithInternalLink',
      defaultMessage: 'Publisher\'s note, eg please visit {internalLink} to learn more about human rights.',
    },
    url: {
      id: 'app.containers.Footer.responsible.url',
      defaultMessage: 'https://www.publisher.org/',
    },
    anchor: {
      id: 'app.containers.Footer.responsible.anchor',
      defaultMessage: 'www.publisher.org',
    },
  },
  project: {
    text: {
      id: 'app.containers.Footer.project.text',
      defaultMessage: '[Project] is powered by ',
    },
    url: {
      id: 'app.containers.Footer.project.url',
      defaultMessage: 'http://impactoss.org',
    },
    anchor: {
      id: 'app.containers.Footer.project.anchor',
      defaultMessage: 'IMPACT OSS',
    },
  },
  imageCredit: {
    footer_actions: {
      id: 'app.containers.Footer.imageCredit.footer_actions',
      defaultMessage: 'Photo by Nathan Anderson on Unsplash',
    },
    footer_actors: {
      id: 'app.containers.Footer.imageCredit.footer_actors',
      defaultMessage: 'Photo by Claudio Schwarz on Unsplash',
    },
    footer_facts: {
      id: 'app.containers.Footer.imageCredit.footer_facts',
      defaultMessage: 'Photo by Bernd Dittrich on Unsplash',
    },
    footer_home: {
      id: 'app.containers.Footer.imageCredit.footer_home',
      defaultMessage: 'Photos by Person One, Person Two and Person Three on Unsplash',
    },
    footer_home_overview: {
      id: 'app.containers.Footer.imageCredit.footer_home_overview',
      defaultMessage: 'Photos by Person One, Person Two and Person Three on Unsplash',
    },
  },
});
