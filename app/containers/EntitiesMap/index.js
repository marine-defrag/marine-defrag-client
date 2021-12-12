/*
 *
 * EntitiesMap
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Map, List } from 'immutable';
import { connect } from 'react-redux';
import styled from 'styled-components';

import * as topojson from 'topojson-client';
// import { FormattedMessage } from 'react-intl';

import countriesTopo from 'data/ne_countries_10m_v5.topo.json';

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
import MapContainer from './MapContainer';
// import messages from './messages';

const LoadingWrap = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background: white;
  z-index: 999;
  pointer-events: none;
  background: none;
`;

export function EntitiesMap({
  dataReady,
  viewOptions,
  config,
  entities,
  actortypes,
  actiontypes,
  typeId,
  mapSubject,
  onSetMapSubject,
  // countries,
  // connections,
  // connectedTaxonomies,
  // locationQuery,
  // taxonomies,
}) {
  // const { intl } = this.context;
  // let { countries } = this.props;
  let type;
  const countriesJSON = topojson.feature(
    countriesTopo,
    Object.values(countriesTopo.objects)[0],
  );
  let countryFeatures;
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
          countryFeatures = countriesJSON.features.map((feature) => {
            const entity = entities.find((e) => qe(e.getIn(['attributes', 'code']), feature.properties.ADM0_A3));
            if (entity) {
              if (mapSubject === 'actors') {
                if (entity.get('actions')) {
                  return {
                    ...feature,
                    values: {
                      count: entity.get('actions').size,
                    },
                  };
                }
              }
              if (mapSubject === 'targets') {
                if (entity.get('targetingActions')) {
                  return {
                    ...feature,
                    values: {
                      count: entity.get('targetingActions').size,
                    },
                  };
                }
              }
            }
            return {
              ...feature,
              values: {
                count: 0,
              },
            };
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
  return (
    <ContainerWrapper hasHeader noOverflow>
      <MapContainer countryFeatures={countryFeatures} />
      {!dataReady && (
        <LoadingWrap>
          <Loading />
        </LoadingWrap>
      )}
      {viewOptions && viewOptions.length > 1 && (
        <EntityListViewOptions options={viewOptions} />
      )}
      {hasByTarget && (
        <MapSubjectOptions options={subjectOptions} />
      )}
    </ContainerWrapper>
  );
}

EntitiesMap.propTypes = {
  config: PropTypes.object,
  entities: PropTypes.instanceOf(List),
  // connections: PropTypes.instanceOf(Map),
  actortypes: PropTypes.instanceOf(Map),
  actiontypes: PropTypes.instanceOf(Map),
  // countries: PropTypes.instanceOf(Map),
  // taxonomies: PropTypes.instanceOf(Map),
  // connectedTaxonomies: PropTypes.instanceOf(Map),
  // locationQuery: PropTypes.instanceOf(Map),
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
