/*
 *
 * PageList
 *
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { injectIntl, intlShape } from 'react-intl';
import { Map } from 'immutable';

import {
  loadEntitiesIfNeeded,
  updatePath,
} from 'containers/App/actions';
import {
  selectReady,
  selectEntities,
} from 'containers/App/selectors';

import appMessages from 'containers/App/messages';
import { ROUTES, API } from 'themes/config';

import EntityList from 'containers/EntityList';

import { CONFIG, DEPENDENCIES } from './constants';
import messages from './messages';

function PageList({
  intl,
  handleNew,
  dataReady,
  onLoadEntitiesIfNeeded,
  entities,
}) {
  useEffect(() => {
    if (!dataReady) onLoadEntitiesIfNeeded();
  }, [dataReady]);

  const headerOptions = {
    supTitle: intl.formatMessage(messages.pageTitle),
    icon: 'pages',
    actions: [{
      type: 'text',
      title: 'Create new',
      onClick: () => handleNew(),
      icon: 'add',
      isManager: true,
    }],
  };
  return (
    <>
      <Helmet
        title={intl.formatMessage(messages.pageTitle)}
        meta={[
          { name: 'description', content: intl.formatMessage(messages.metaDescription) },
        ]}
      />
      <EntityList
        entities={entities && entities.toList()}
        config={CONFIG}
        headerOptions={headerOptions}
        dataReady={dataReady}
        includeHeader={false}
        headerStyle="simple"
        canEdit={false}
        entityTitle={{
          single: intl.formatMessage(appMessages.entities.pages.single),
          plural: intl.formatMessage(appMessages.entities.pages.plural),
        }}
      />
    </>
  );
}

PageList.propTypes = {
  onLoadEntitiesIfNeeded: PropTypes.func,
  handleNew: PropTypes.func,
  dataReady: PropTypes.bool,
  entities: PropTypes.instanceOf(Map).isRequired,
  intl: intlShape.isRequired,
};

const mapStateToProps = (state) => ({
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  entities: selectEntities(state, API.PAGES),
});
function mapDispatchToProps(dispatch) {
  return {
    onLoadEntitiesIfNeeded: () => {
      DEPENDENCIES.forEach((path) => dispatch(loadEntitiesIfNeeded(path)));
    },
    handleNew: () => {
      dispatch(updatePath(`${ROUTES.PAGES}${ROUTES.NEW}`, { replace: true }));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(PageList));
