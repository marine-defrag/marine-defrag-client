/*
 * Overview Messages
 *
 * This contains all the text for the Taxonomies component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  supTitle: {
    id: 'app.containers.Overview.supTitle',
    defaultMessage: 'Explore',
  },
  title: {
    id: 'app.containers.Overview.title',
    defaultMessage: 'The implementation plan and related subjects',
  },
  description: {
    id: 'app.containers.Overview.description',
    defaultMessage: 'Start exploring by selecting a category group from the sidebar or one of the subjects from the diagram below.',
  },
  buttons: {
    draft: {
      id: 'app.containers.Overview.buttons.draft',
      defaultMessage: '({count} draft)',
    },
    actors: {
      id: 'app.containers.Overview.buttons.actors',
      defaultMessage: '{count} {type}',
    },
    actions: {
      id: 'app.containers.Overview.buttons.actions',
      defaultMessage: '{count} Government actions',
    },
  },
  diagram: {
    categorised: {
      id: 'app.containers.Overview.diagram.categorised',
      defaultMessage: 'categorised by',
    },
    addressed: {
      id: 'app.containers.Overview.diagram.addressed',
      defaultMessage: 'addressed by',
    },
    actiond: {
      id: 'app.containers.Overview.diagram.actiond',
      defaultMessage: 'actiond by',
    },
  },
  metaDescription: {
    id: 'app.containers.Overview.metaDescription',
    defaultMessage: 'Overview',
  },
});
