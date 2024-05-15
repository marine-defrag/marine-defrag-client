/*
 *
 * UserView
 *
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';

import {
  getTitleField,
  getRoleField,
  getMetaField,
  getEmailField,
  getTaxonomyFields,
  getHighestUserRoleId,
  getUserStatusField,
} from 'utils/fields';
import { getEntityTitle } from 'utils/entities';
import { keydownHandlerPrint } from 'utils/print';

import {
  loadEntitiesIfNeeded,
  updatePath,
  closeEntity,
  printView,
} from 'containers/App/actions';

import { PRINT_TYPES } from 'containers/App/constants';
import { USER_ROLES, ROUTES } from 'themes/config';

import Loading from 'components/Loading';
import Content from 'components/Content';
import EntityView from 'components/EntityView';

import {
  selectReady,
  selectSessionUserId,
  selectSessionUserHighestRoleId,
} from 'containers/App/selectors';

import appMessages from 'containers/App/messages';
import messages from './messages';

import {
  selectViewEntity,
  selectTaxonomies,
} from './selectors';

import { DEPENDENCIES } from './constants';

const getHeaderMainFields = (entity, isManager) => ([{ // fieldGroup
  fields: [getTitleField(entity, isManager, 'name', appMessages.attributes.name)],
}]);

const getHeaderAsideFields = (entity) => ([{
  fields: [
    getUserStatusField(entity),
    getRoleField(entity),
    getMetaField(entity),
  ],
}]);

const getBodyMainFields = (entity) => ([{
  fields: [getEmailField(entity)],
}]);

const getBodyAsideFields = (taxonomies) => ([
  { // fieldGroup
    fields: getTaxonomyFields(taxonomies),
  },
]);

function UserView({
  user,
  dataReady,
  sessionUserHighestRoleId,
  taxonomies,
  intl,
  params,
  sessionUserId,
  handleEditPassword,
  handleEdit,
  handleClose,
  onLoadEntitiesIfNeeded,
  onSetPrintView,
}) {
  useEffect(() => {
    // kick off loading of data
    onLoadEntitiesIfNeeded();
  }, []);
  const mySetPrintView = () => onSetPrintView({
    printType: PRINT_TYPES.SINGLE,
    printOrientation: 'portrait',
    printSize: 'A4',
  });
  const keydownHandler = (e) => {
    keydownHandlerPrint(e, mySetPrintView);
  };
  useEffect(() => {
    document.addEventListener('keydown', keydownHandler);
    return () => {
      document.removeEventListener('keydown', keydownHandler);
    };
  }, []);
  const isManager = sessionUserHighestRoleId <= USER_ROLES.MANAGER.value;

  const pageTitle = intl.formatMessage(messages.pageTitle);
  const metaTitle = user
    ? `${pageTitle}: ${getEntityTitle(user)}`
    : `${pageTitle} ${params.id}`;
  const buttons = [];
  if (user) {
    const userId = user.get('id') || user.getIn(['attributes', 'id']);
    if (dataReady) {
      buttons.push({
        type: 'icon',
        onClick: mySetPrintView,
        title: 'Print',
        icon: 'print',
      });
    }
    if (userId === sessionUserId) {
      buttons.push({
        type: 'edit',
        title: intl.formatMessage(messages.editPassword),
        onClick: () => handleEditPassword(userId),
      });
    }
    if (sessionUserHighestRoleId === USER_ROLES.ADMIN.value // is admin
      || userId === sessionUserId // own profile
      || sessionUserHighestRoleId < getHighestUserRoleId(user.get('roles'))
    ) {
      buttons.push({
        type: 'edit',
        onClick: () => handleEdit(userId),
      });
    }
  }

  return (
    <div>
      <Helmet
        title={metaTitle}
        meta={[
          { name: 'description', content: intl.formatMessage(messages.metaDescription) },
        ]}
      />
      <Content isSingle>
        {!user && !dataReady && <Loading />}
        {!user && dataReady && (
          <div>
            <FormattedMessage {...messages.notFound} />
          </div>
        )}
        {user && dataReady && (
          <EntityView
            header={{
              title: pageTitle,
              onClose: handleClose,
              buttons,
            }}
            fields={{
              header: {
                main: getHeaderMainFields(user, isManager),
                aside: isManager && getHeaderAsideFields(user),
              },
              body: {
                main: getBodyMainFields(user),
                aside: isManager && getBodyAsideFields(taxonomies),
              },
            }}
          />
        )}
      </Content>
    </div>
  );
}

UserView.propTypes = {
  onLoadEntitiesIfNeeded: PropTypes.func,
  handleEdit: PropTypes.func,
  handleEditPassword: PropTypes.func,
  handleClose: PropTypes.func,
  onSetPrintView: PropTypes.func,
  user: PropTypes.object,
  taxonomies: PropTypes.object,
  dataReady: PropTypes.bool,
  sessionUserHighestRoleId: PropTypes.number,
  params: PropTypes.object,
  sessionUserId: PropTypes.string,
  intl: intlShape.isRequired,
};

const mapStateToProps = (state, props) => ({
  sessionUserHighestRoleId: selectSessionUserHighestRoleId(state),
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  sessionUserId: selectSessionUserId(state),
  user: selectViewEntity(state, props.params.id),
  // all connected categories for all user-taggable taxonomies
  taxonomies: selectTaxonomies(state, props.params.id),
});

function mapDispatchToProps(dispatch) {
  return {
    onLoadEntitiesIfNeeded: () => {
      DEPENDENCIES.forEach((path) => dispatch(loadEntitiesIfNeeded(path)));
    },
    handleEdit: (userId) => {
      dispatch(updatePath(`${ROUTES.USERS}${ROUTES.EDIT}/${userId}`, { replace: true }));
    },
    handleEditPassword: (userId) => {
      dispatch(updatePath(`${ROUTES.USERS}${ROUTES.PASSWORD}/${userId}`, { replace: true }));
    },
    handleClose: () => {
      dispatch(closeEntity(ROUTES.USERS));
    },
    onSetPrintView: (config) => {
      dispatch(printView(config));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(UserView));
