/*
 *
 * EntityListMap
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
// import { Map, List } from 'immutable';
import { Map } from 'immutable';
// import styled from 'styled-components';
// import { FormattedMessage } from 'react-intl';

import ContainerWrapper from 'components/styled/Container/ContainerWrapper';
import Loading from 'components/Loading';
import EntityListViewOptions from 'components/EntityListViewOptions';

// import appMessages from 'containers/App/messages';

// import messages from './messages';

class EntityListMap extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.ScrollContainer = React.createRef();
    this.ScrollTarget = React.createRef();
    this.ScrollReference = React.createRef();
  }

  shouldComponentUpdate(nextProps) {
    return this.props.dataReady !== nextProps.dataReady
      || this.props.locationQuery !== nextProps.locationQuery;
  }

  render() {
    const {
      dataReady,
      viewOptions,
      // config,
      // taxonomies,
      // connections,
      // connectedTaxonomies,
      // locationQuery,
      // entities,
      // actortypes,
    } = this.props;
    // const { intl } = this.context;

    return (
      <ContainerWrapper hasHeader>
        {dataReady && viewOptions && viewOptions.length > 1 && (
          <EntityListViewOptions options={viewOptions} />
        )}
        {!dataReady && <Loading />}
      </ContainerWrapper>
    );
  }
}

EntityListMap.propTypes = {
  // entities: PropTypes.instanceOf(List),
  // config: PropTypes.object,
  // taxonomies: PropTypes.instanceOf(Map),
  // actortypes: PropTypes.instanceOf(Map),
  // connections: PropTypes.instanceOf(Map),
  // connectedTaxonomies: PropTypes.instanceOf(Map),
  locationQuery: PropTypes.instanceOf(Map),
  // object/arrays
  viewOptions: PropTypes.array,
  // primitive
  dataReady: PropTypes.bool,
};

EntityListMap.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default EntityListMap;
