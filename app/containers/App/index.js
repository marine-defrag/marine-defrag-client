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
import Header from 'components/Header';
import EntityNew from 'containers/EntityNew';
import PrintModal from 'containers/PrintModal';

import { sortEntities } from 'utils/sort';
import { ROUTES, API } from 'themes/config';

import {
  selectIsSignedIn,
  selectIsUserManager,
  selectIsUserAnalyst,
  selectSessionUserAttributes,
  selectReady,
  selectEntitiesWhere,
  selectNewEntityModal,
  selectPrintQuery,
  selectPrintModal,
} from './selectors';

import {
  validateToken,
  loadEntitiesIfNeeded,
  updatePath,
  openNewEntityModal,
  setPrintModal,
} from './actions';

import { DEPENDENCIES } from './constants';

import messages from './messages';

const Main = styled.div`
  position: ${({ isHome, isPrintView }) => {
    if (isPrintView) {
      return 'absolute';
    }
    if (isHome) {
      return 'relative';
    }
    return 'absolute';
  }};
  top: ${({ isHome, theme }) => isHome
    ? 0
    : theme.sizes.header.banner.heightMobile
}px;
  left: 0;
  right: 0;
  bottom:0;
  overflow: hidden;
  width: ${({ isPrintView }) => (isPrintView ? '520pt' : 'auto')};
  @media (min-width: ${({ theme }) => theme.breakpoints.medium}) {
    top: ${({ isHome, theme }) => isHome
    ? 0
    : theme.sizes.header.banner.height
}px;
  }
  @media print {
    background: transparent;
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

  preparePageMenuPages = (pages, currentPath) => sortEntities(
    pages,
    'asc',
    'order',
    'number'
  )
    .map((page) => ({
      path: `${ROUTES.PAGES}/${page.get('id')}`,
      title: page.getIn(['attributes', 'menu_title']) || page.getIn(['attributes', 'title']),
      active: currentPath === `${ROUTES.PAGES}/${page.get('id')}`,
    }))
    .toArray();

  prepareMainMenuItems = (
    isManager,
    isAnalyst,
    currentPath,
  ) => {
    const { intl } = this.context;
    let navItems = [];
    if (isAnalyst) {
      navItems = navItems.concat([
        {
          path: ROUTES.RESOURCES,
          title: intl.formatMessage(messages.nav.resources),
          active: currentPath && currentPath.startsWith(ROUTES.RESOURCE),
        },
      ]);
    }
    if (isManager) {
      navItems = navItems.concat([
        {
          path: ROUTES.PAGES,
          title: intl.formatMessage(messages.nav.pages),
          isAdmin: true,
          active: currentPath === ROUTES.PAGES,
        },
        {
          path: ROUTES.TAXONOMIES,
          title: intl.formatMessage(messages.nav.taxonomies),
          isAdmin: true,
          active: currentPath.startsWith(ROUTES.CATEGORY)
          || currentPath.startsWith(ROUTES.TAXONOMIES),
        },
        {
          path: ROUTES.USERS,
          title: intl.formatMessage(messages.nav.users),
          isAdmin: true,
          active: currentPath === ROUTES.USERS,
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
      isAnalyst,
      location,
      newEntityModal,
      user,
      children,
      isPrintView,
      onCloseModal,
      onClosePrintModal,
      printModal,
    } = this.props;
    const { intl } = this.context;
    const title = intl.formatMessage(messages.app.title);
    const isHome = location.pathname === '/';
    const isAuth = location.pathname.startsWith(ROUTES.LOGIN)
      || location.pathname.startsWith(ROUTES.REGISTER)
      || location.pathname.startsWith(ROUTES.LOGOUT)
      || location.pathname.startsWith(ROUTES.UNAUTHORISED);
    const isHomeOrAuth = isHome || isAuth;
    return (
      <div id="app-inner">
        <Helmet titleTemplate={`%s - ${title}`} defaultTitle={title} />
        {!isHome && (
          <Header
            isSignedIn={isUserSignedIn}
            isAnalyst={isAnalyst}
            user={user}
            pages={pages && this.preparePageMenuPages(pages, location.pathname)}
            navItems={this.prepareMainMenuItems(
              isUserSignedIn && isManager,
              isUserSignedIn && isAnalyst,
              location.pathname,
            )}
            search={!isUserSignedIn
              ? null
              : {
                path: ROUTES.SEARCH,
                title: intl.formatMessage(messages.nav.search),
                active: location.pathname.startsWith(ROUTES.SEARCH),
                icon: 'search',
              }
            }
            onPageLink={onPageLink}
            isAuth={isAuth}
            currentPath={location.pathname}
          />
        )}
        <Main isHome={isHomeOrAuth} isPrintView={isPrintView}>
          {React.Children.toArray(children)}
        </Main>
        {newEntityModal && (
          <ReactModal
            isOpen
            contentLabel={newEntityModal.get('path')}
            onRequestClose={onCloseModal}
            className="new-entity-modal"
            overlayClassName="new-entity-modal-overlay"
            style={{
              overlay: { zIndex: 99999999 },
            }}
            appElement={document.getElementById('app')}
          >
            <EntityNew
              path={newEntityModal.get('path')}
              attributes={newEntityModal.get('attributes')}
              onSaveSuccess={onCloseModal}
              onCancel={onCloseModal}
              inModal
            />
          </ReactModal>
        )}
        {printModal && (
          <ReactModal
            isOpen
            contentLabel="Print"
            onRequestClose={onClosePrintModal}
            className="print-modal"
            overlayClassName="print-modal-overlay"
            style={{
              overlay: { zIndex: 99999999 },
            }}
            appElement={document.getElementById('app')}
          >
            <PrintModal
              args={printModal}
              location={location}
              close={onClosePrintModal}
            />
          </ReactModal>
        )}
        <GlobalStyle />
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.node,
  isUserSignedIn: PropTypes.bool,
  isManager: PropTypes.bool,
  isAnalyst: PropTypes.bool,
  isPrintView: PropTypes.bool,
  user: PropTypes.object,
  pages: PropTypes.object,
  validateToken: PropTypes.func,
  loadEntitiesIfNeeded: PropTypes.func,
  onPageLink: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
  newEntityModal: PropTypes.object,
  onCloseModal: PropTypes.func,
  printModal: PropTypes.object,
  onClosePrintModal: PropTypes.func,
};
App.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  isManager: selectIsUserManager(state),
  isAnalyst: selectIsUserAnalyst(state),
  isUserSignedIn: selectIsSignedIn(state),
  user: selectSessionUserAttributes(state),
  isPrintView: selectPrintQuery(state),
  pages: selectEntitiesWhere(state, {
    path: API.PAGES,
    where: { draft: false },
  }),
  newEntityModal: selectNewEntityModal(state),
  printModal: selectPrintModal(state),
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
    onClosePrintModal: () => {
      dispatch(setPrintModal(null));
    },
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(App);
