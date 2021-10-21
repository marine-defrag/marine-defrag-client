/**
 *
 * App.js
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import ReactModal from 'react-modal';
import GlobalStyle from 'global-styles';

import styled from 'styled-components';
import { palette } from 'styled-theme';
import Header from 'components/Header';
import EntityNew from 'containers/EntityNew';

import { sortEntities } from 'utils/sort';
import { ROUTES, DB } from 'themes/config';

import {
  selectIsSignedIn,
  selectIsUserManager,
  selectSessionUserAttributes,
  selectReady,
  selectActortypes,
  selectEntitiesWhere,
  selectNewEntityModal,
  selectActortypeQuery,
  selectViewActorActortypeId,
} from './selectors';

import {
  validateToken,
  loadEntitiesIfNeeded,
  updatePath,
  updateRouteQuery,
  openNewEntityModal,
} from './actions';

import { DEPENDENCIES } from './constants';

import messages from './messages';

const Main = styled.div`
  position: ${(props) => props.isHome ? 'relative' : 'absolute'};
  top: ${(props) => props.isHome
    ? 0
    : props.theme.sizes.header.banner.heightMobile + props.theme.sizes.header.nav.heightMobile
}px;
  left: 0;
  right: 0;
  bottom:0;
  background-color: ${(props) => props.isHome ? 'transparent' : palette('light', 0)};
  overflow: hidden;

  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    top: ${(props) => props.isHome
    ? 0
    : props.theme.sizes.header.banner.height + props.theme.sizes.header.nav.height
}px;
  }
  @media print {
    background: white;
    position: static;
  }
`;
// overflow: ${(props) => props.isHome ? 'auto' : 'hidden'};

class App extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  UNSAFE_componentWillMount() {
    this.props.validateToken();
    this.props.loadEntitiesIfNeeded();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
  }

  preparePageMenuPages = (pages) => sortEntities(
    pages,
    'asc',
    'order',
    'number'
  )
    .map((page) => ({
      path: `${ROUTES.PAGES}/${page.get('id')}`,
      title: page.getIn(['attributes', 'menu_title']) || page.getIn(['attributes', 'title']),
    }))
    .toArray();

  prepareActortypeOptions = (actortypes, activeId) => {
    const { intl } = this.context;
    const options = Object.values(actortypes.toJS()).map((actortype) => ({
      value: actortype.id,
      label: intl.formatMessage(messages.actortypes[actortype.id]),
      active: activeId === actortype.id,
    }));
    return options.concat({
      value: 'all',
      label: intl.formatMessage(messages.actortypes.all),
      active: (activeId === 'all') || actortypes.size === 0,
    });
  }

  prepareMainMenuItems = (
    isManager,
    isUserSignedIn,
    currentPath,
    currentActortypeId,
    viewActorActortype,
  ) => {
    const { intl } = this.context;
    let navItems = [
      {
        path: ROUTES.OVERVIEW,
        titleSuper: intl.formatMessage(messages.nav.overviewSuper),
        title: intl.formatMessage(messages.nav.overview),
        active:
          currentPath.startsWith(ROUTES.OVERVIEW)
          || currentPath.startsWith(ROUTES.TAXONOMIES)
          || currentPath.startsWith(ROUTES.CATEGORIES),
      },
      {
        path: ROUTES.ACTORS,
        titleSuper: intl.formatMessage(messages.nav.actorsSuper),
        title: intl.formatMessage(messages.actortypeObjectivesShort[currentActortypeId]),
        active: currentPath.startsWith(ROUTES.ACTORS) && (
          !viewActorActortype
          || currentActortypeId === 'all'
          || currentActortypeId === viewActorActortype
        ),
      },
      {
        path: ROUTES.ACTIONS,
        titleSuper: intl.formatMessage(messages.nav.actionsSuper),
        title: intl.formatMessage(messages.nav.actions),
        active: currentPath.startsWith(ROUTES.ACTIONS),
      },
    ];
    if (isManager) {
      navItems = navItems.concat([
        {
          path: ROUTES.PAGES,
          title: intl.formatMessage(messages.nav.pages),
          isAdmin: true,
          active: currentPath === ROUTES.PAGES,
        },
        {
          path: ROUTES.USERS,
          title: intl.formatMessage(messages.nav.users),
          isAdmin: true,
          active: currentPath === ROUTES.USERS,
        },
      ]);
    }
    if (isUserSignedIn) {
      navItems = navItems.concat([
        {
          path: ROUTES.BOOKMARKS,
          title: intl.formatMessage(messages.nav.bookmarks),
          isAdmin: true,
          active: currentPath === ROUTES.BOOKMARKS,
        },
      ]);
    }
    return navItems;
  }

  render() {
    const {
      pages,
      onPageLink,
      isUserSignedIn,
      isManager,
      location,
      newEntityModal,
      currentActortypeId,
      actortypes,
      onSelectActortype,
      viewActorActortype,
      user,
      children,
    } = this.props;
    const { intl } = this.context;
    const title = intl.formatMessage(messages.app.title);
    return (
      <div>
        <Helmet titleTemplate={`${title} - %s`} defaultTitle={title} />
        <Header
          isSignedIn={isUserSignedIn}
          user={user}
          pages={pages && this.preparePageMenuPages(pages)}
          navItems={this.prepareMainMenuItems(
            isUserSignedIn && isManager,
            isUserSignedIn,
            location.pathname,
            currentActortypeId,
            viewActorActortype,
          )}
          search={{
            path: ROUTES.SEARCH,
            title: intl.formatMessage(messages.nav.search),
            active: location.pathname.startsWith(ROUTES.SEARCH),
            icon: 'search',
          }}
          onPageLink={onPageLink}
          isHome={location.pathname === '/'}
          onSelectActortype={onSelectActortype}
          actortypeOptions={this.prepareActortypeOptions(
            actortypes,
            currentActortypeId,
          )}
        />
        <Main isHome={location.pathname === '/'}>
          {React.Children.toArray(children)}
        </Main>
        {newEntityModal
          && (
            <ReactModal
              isOpen
              contentLabel={newEntityModal.get('path')}
              onRequestClose={this.props.onCloseModal}
              className="new-entity-modal"
              overlayClassName="new-entity-modal-overlay"
              style={{
                overlay: { zIndex: 99999999 },
              }}
            >
              <EntityNew
                path={newEntityModal.get('path')}
                attributes={newEntityModal.get('attributes')}
                onSaveSuccess={this.props.onCloseModal}
                onCancel={this.props.onCloseModal}
                inModal
              />
            </ReactModal>
          )
        }
        <GlobalStyle />
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.node,
  isUserSignedIn: PropTypes.bool,
  isManager: PropTypes.bool,
  user: PropTypes.object,
  pages: PropTypes.object,
  validateToken: PropTypes.func,
  loadEntitiesIfNeeded: PropTypes.func,
  onPageLink: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
  newEntityModal: PropTypes.object,
  onCloseModal: PropTypes.func,
  onSelectActortype: PropTypes.func,
  currentActortypeId: PropTypes.string,
  viewActorActortype: PropTypes.string,
  actortypes: PropTypes.object,
};
App.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => ({
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  isManager: selectIsUserManager(state),
  isUserSignedIn: selectIsSignedIn(state),
  user: selectSessionUserAttributes(state),
  pages: selectEntitiesWhere(state, {
    path: DB.PAGES,
    where: { draft: false },
  }),
  newEntityModal: selectNewEntityModal(state),
  currentActortypeId: selectActortypeQuery(state),
  actortypes: selectActortypes(state),
  viewActorActortype: selectViewActorActortypeId(state, props.params.id),
});

export function mapDispatchToProps(dispatch) {
  return {
    validateToken: () => {
      dispatch(validateToken()); // Maybe this could move to routes.js or App wrapper
    },
    loadEntitiesIfNeeded: () => {
      DEPENDENCIES.forEach((path) => dispatch(loadEntitiesIfNeeded(path)));
    },
    onPageLink: (path, args) => {
      dispatch(updatePath(path, args));
    },
    onCloseModal: () => {
      dispatch(openNewEntityModal(null));
    },
    onSelectActortype: (actortype) => {
      dispatch(updateRouteQuery(
        {
          arg: 'actortype',
          value: actortype,
          replace: true,
        }
      ));
    },
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(App);
