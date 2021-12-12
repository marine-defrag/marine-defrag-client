/*
 *
 * EntitiesMap
 *
 */
import React from 'react';
import { injectIntl, intlShape } from 'react-intl';
import PropTypes from 'prop-types';
import { Map, List } from 'immutable';
import { connect } from 'react-redux';
import styled from 'styled-components';

import * as topojson from 'topojson-client';
// import { FormattedMessage } from 'react-intl';

import countriesTopo from 'data/ne_countries_10m_v5.topo.json';

import { ACTORTYPES, ROUTES } from 'themes/config';

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

import appMessages from 'containers/App/messages';
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
  countries,
  onEntityClick,
  intl,
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
  let indicator = 'actions';
  // let cleanMapSubject = 'actors';
  if (dataReady) {
    if (config.types === 'actortypes') {
      type = actortypes.find((at) => qe(at.get('id'), typeId));
      hasByTarget = type.getIn(['attributes', 'is_target']);
      if (hasByTarget) {
        if (mapSubject === 'targets') {
          indicator = 'targetingActions';
        }
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
              return {
                ...feature,
                id: entity.get('id'),
                attributes: entity.get('attributes').toJS(),
                tooltip: {
                  title: entity.getIn(['attributes', 'title']),
                  typeLabels: {
                    plural: intl.formatMessage(appMessages.entities.actions.plural),
                    single: intl.formatMessage(appMessages.entities.actions.single),
                  },
                },
                values: {
                  actions: entity.get('actions')
                    ? entity.get('actions').size
                    : 0,
                  targetingActions: entity.get('targetingActions')
                    ? entity.get('targetingActions').size
                    : 0,
                },
              };
            }
            return {
              ...feature,
              values: {
                actions: 0,
                targetingActions: 0,
              },
            };
          });
        }
      }
    } else if (config.types === 'actiontypes') {
      type = actiontypes.find((at) => qe(at.get('id'), typeId));
      hasByTarget = type.getIn(['attributes', 'has_target']);
      if (hasByTarget) {
        if (mapSubject === 'targets') {
          indicator = 'targetingActions';
        }
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
      // entities are filtered actions
      const countryCounts = entities.reduce((memo, action) => {
        let updated = memo;
        // get countries
        const actionCountries = action.get('actorsByType')
          && action.getIn(['actorsByType', parseInt(ACTORTYPES.COUNTRY, 10)]);
        if (actionCountries) {
          actionCountries.forEach((cid) => {
            if (memo.get(cid) && memo.getIn([cid, 'actions'])) {
              updated = updated.setIn([cid, 'actions'], memo.getIn([cid, 'actions']) + 1);
            } else {
              updated = updated.setIn([cid, 'actions'], 1);
            }
          });
        }
        if (hasByTarget) {
          const actionCountriesAsTargets = action.get('targetsByType')
            && action.getIn(['targetsByType', parseInt(ACTORTYPES.COUNTRY, 10)]);
          if (actionCountriesAsTargets) {
            actionCountriesAsTargets.forEach((cid) => {
              if (memo.get(cid) && memo.getIn([cid, 'targetingActions'])) {
                updated = updated.setIn([cid, 'targetingActions'], memo.getIn([cid, 'targetingActions']) + 1);
              } else {
                updated = updated.setIn([cid, 'targetingActions'], 1);
              }
            });
          }
        }
        return updated;
      }, Map());
      // console.log('countryCounts', countryCounts && countryCounts.toJS())
      countryFeatures = countriesJSON.features.map((feature) => {
        const country = countries.find((e) => qe(e.getIn(['attributes', 'code']), feature.properties.ADM0_A3));
        const cCounts = country && countryCounts.get(parseInt(country.get('id'), 10));
        if (country) {
          const typeLabels = {
            single: intl.formatMessage(appMessages.entities[`actions_${typeId}`].single),
            plural: intl.formatMessage(appMessages.entities[`actions_${typeId}`].plural),
          };
          return {
            ...feature,
            id: country.get('id'),
            attributes: country.get('attributes').toJS(),
            tooltip: {
              title: country.getIn(['attributes', 'title']),
              typeLabels,
            },
            values: {
              actions: (cCounts && cCounts.get('actions')) || 0,
              targetingActions: (cCounts && cCounts.get('targetingActions')) || 0,
            },
          };
        }
        return {
          ...feature,
          values: {
            actions: 0,
            targetingActions: 0,
          },
        };
      });
    }
  }
  return (
    <ContainerWrapper hasHeader noOverflow>
      <MapContainer
        countryFeatures={countryFeatures}
        indicator={indicator}
        onCountryClick={(id) => onEntityClick(id, ROUTES.ACTOR)}
      />
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
  countries: PropTypes.instanceOf(Map),
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
  onEntityClick: PropTypes.func,
  intl: intlShape.isRequired,
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

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(EntitiesMap));
