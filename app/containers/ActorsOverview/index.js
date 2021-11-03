import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
// import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { injectIntl } from 'react-intl';

// import styled from 'styled-components';

// import rootMessages from 'messages';
import { loadEntitiesIfNeeded } from 'containers/App/actions';
import { selectReady } from 'containers/App/selectors';

import { DEPENDENCIES } from './constants';

export function ActorsOverview({ onLoadData }) {
  useEffect(() => {
    // kick off loading of data
    onLoadData();
  }, []);

  return (
    <div>
      ActorsOverview
    </div>
  );
}

ActorsOverview.propTypes = {
  // intl: intlShape.isRequired,
  onLoadData: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  dataReady: (state) => selectReady(state, DEPENDENCIES),
});

export function mapDispatchToProps(dispatch) {
  return {
    onLoadData: () => {
      DEPENDENCIES.forEach((path) => dispatch(loadEntitiesIfNeeded(path)));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(injectIntl(ActorsOverview));
