/*
 *
 * EntitiesMap
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Map, List } from 'immutable';
import { connect } from 'react-redux';
// import styled from 'styled-components';
// import { FormattedMessage } from 'react-intl';

import { ACTORTYPES } from 'themes/config';

import {
  selectMapSubjectQuery,
  selectActortypeActors,
} from 'containers/App/selectors';

import {
  setMapSubject,
} from 'containers/App/actions';

import ContainerWrapper from 'components/styled/Container/ContainerWrapper';
import Loading from 'components/Loading';
import EntityListViewOptions from 'components/EntityListViewOptions';

// import appMessages from 'containers/App/messages';
import qe from 'utils/quasi-equals';
import MapSubjectOptions from './MapSubjectOptions';
// import messages from './messages';

class EntitiesMap extends React.Component { // eslint-disable-line react/prefer-stateless-function
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
      config,
      entities,
      // connections,
      actortypes,
      actiontypes,
      typeId,
      // taxonomies,
      // connectedTaxonomies,
      // locationQuery,
      mapSubject,
      onSetMapSubject,
    } = this.props;
    // const { intl } = this.context;
    let { countries } = this.props;
    let type;
    let hasByTarget;
    let subjectOptions;
    // let cleanMapSubject = 'actors';
    if (dataReady) {
      if (config.types === 'actortypes') {
        type = actortypes.find((at) => qe(at.get('id'), typeId));
        hasByTarget = type.getIn(['attributes', 'is_target']);
        if (hasByTarget) {
          // cleanMapSubject = mapSubject;
          subjectOptions = [
            {
              type: 'secondary',
              title: 'As actors',
              onClick: () => onSetMapSubject('actors'),
              active: mapSubject === 'actors',
              disabled: mapSubject === 'actors',
            },
            {
              type: 'secondary',
              title: 'As targets',
              onClick: () => onSetMapSubject('targets'),
              active: mapSubject === 'targets',
              disabled: mapSubject === 'targets',
            },
          ];
          if (typeId === ACTORTYPES.COUNTRY) {
            // entities are filtered countries
            countries = countries.map((country) => {
              const entity = entities.find((e) => qe(e.get('id'), country.get('id')));
              if (entity) {
                if (mapSubject === 'actors') {
                  if (entity.get('actions')) {
                    return country.setIn(['mapvalues', 'count'], entity.get('actions').size);
                  }
                }
                if (mapSubject === 'targets') {
                  if (entity.get('targetingActions')) {
                    return country.setIn(['mapvalues', 'count'], entity.get('targetingActions').size);
                  }
                }
              }
              return country.setIn(['mapvalues', 'count'], 0);
            });
          }
        }
      } else if (config.types === 'actiontypes') {
        type = actiontypes.find((at) => qe(at.get('id'), typeId));
        hasByTarget = type.getIn(['attributes', 'has_target']);
        if (hasByTarget) {
          // cleanMapSubject = mapSubject;
          subjectOptions = [
            {
              type: 'secondary',
              title: 'By actor',
              onClick: () => onSetMapSubject('actors'),
              active: mapSubject === 'actors',
              disabled: mapSubject === 'actors',
            },
            {
              type: 'secondary',
              title: 'By target',
              onClick: () => onSetMapSubject('targets'),
              active: mapSubject === 'targets',
              disabled: mapSubject === 'targets',
            },
          ];
        }
      }
    }
    console.log(countries && countries.toJS());
    return (
      <ContainerWrapper hasHeader>
        {!dataReady && <Loading />}
        {viewOptions && viewOptions.length > 1 && (
          <EntityListViewOptions options={viewOptions} />
        )}
        {hasByTarget && (
          <MapSubjectOptions options={subjectOptions} />
        )}
      </ContainerWrapper>
    );
  }
}

EntitiesMap.propTypes = {
  config: PropTypes.object,
  entities: PropTypes.instanceOf(List),
  // connections: PropTypes.instanceOf(Map),
  actortypes: PropTypes.instanceOf(Map),
  actiontypes: PropTypes.instanceOf(Map),
  countries: PropTypes.instanceOf(Map),
  // taxonomies: PropTypes.instanceOf(Map),
  // connectedTaxonomies: PropTypes.instanceOf(Map),
  locationQuery: PropTypes.instanceOf(Map),
  // object/arrays
  viewOptions: PropTypes.array,
  // primitive
  dataReady: PropTypes.bool,
  typeId: PropTypes.string,
  mapSubject: PropTypes.string,
  onSetMapSubject: PropTypes.func,
};

EntitiesMap.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  mapSubject: selectMapSubjectQuery(state),
  countries: selectActortypeActors(state, { type: ACTORTYPES.COUNTRY }),
});
function mapDispatchToProps(dispatch) {
  return {
    onSetMapSubject: (subject) => {
      dispatch(setMapSubject(subject));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EntitiesMap);
