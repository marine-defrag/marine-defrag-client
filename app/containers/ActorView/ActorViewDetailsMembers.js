/*
 *
 * Activities
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { FormattedMessage, intlShape, injectIntl } from 'react-intl';
import { Box, Text } from 'grommet';
import { Map } from 'immutable';
import styled from 'styled-components';
import countriesTopo from 'data/ne_countries_10m_v5.topo.json';
import countryPointJSON from 'data/country-points.json';
import * as topojson from 'topojson-client';

import { usePrint } from 'containers/App/PrintContext';

import {
  getActorConnectionField,
} from 'utils/fields';
import qe from 'utils/quasi-equals';
import {
  selectPrintConfig,
} from 'containers/App/selectors';
import { ACTORTYPES, ROUTES } from 'themes/config';
import FieldGroup from 'components/fields/FieldGroup';

import MapWrapperLeaflet from 'containers/MapControl/MapWrapperLeaflet';
import SimpleMapContainer from 'containers/MapControl/SimpleMapContainer';

import { selectMembersByType } from './selectors';

const Styled = styled((p) => <Box {...p} />)`
  z-index: 0;
  position: relative;
  @media print {
    page-break-inside: avoid;
    break-inside: avoid;
  }
`;
const reduceCountryData = ({ features, countries }) => features.reduce(
  (memo, feature) => {
    const country = countries && countries.find(
      (e) => qe(e.getIn(['attributes', 'code']), feature.properties.ADM0_A3)
    );
    if (country) {
      return [
        ...memo,
        {
          ...feature,
          id: country.get('id'),
          attributes: country.get('attributes').toJS(),
          tooltip: {
            title: country.getIn(['attributes', 'title']),
          },
          values: {
            actions: 1,
          },
        },
      ];
    }
    return memo;
  },
  [],
);
export function ActorViewDetailsMembers({
  onEntityClick,
  membersByType,
  taxonomies,
  actorConnections,
  printArgs,
}) {
  const [mapTooltips, setMapTooltips] = React.useState([]);
  const [mapView, setMapView] = React.useState(null);
  const countriesJSON = topojson.feature(
    countriesTopo,
    Object.values(countriesTopo.objects)[0],
  );
  const countries = membersByType && membersByType.get(parseInt(ACTORTYPES.COUNTRY, 10));

  let countryData; let
    countryPointData;
  if (countries && countries.size > 0) {
    countryData = reduceCountryData({ features: countriesJSON.features, countries });
    countryPointData = reduceCountryData({ features: countryPointJSON.features, countries });
  }

  const isPrintView = usePrint();

  return (
    <Styled>
      {(!membersByType || membersByType.size === 0) && (
        <Box margin={{ vertical: 'small', horizontal: 'medium' }}>
          <Text>
            No members found in database
          </Text>
        </Box>
      )}
      {countries && countries.size > 0 && (
        <SimpleMapContainer
          orient={printArgs && printArgs.printOrientation}
        >
          <MapWrapperLeaflet
            mapId="ll-map-actor-members"
            printArgs={printArgs}
            isPrintView={isPrintView}
            countryData={countryData}
            countryPointData={countryPointData}
            countryFeatures={countriesJSON.features}
            indicator="actions"
            styleType="members"
            onActorClick={(id) => onEntityClick(id, ROUTES.ACTOR)}
            fitBoundsToCountryOverlay
            projection="gall-peters"
            mapTooltips={mapTooltips}
            setMapTooltips={setMapTooltips}
            mapView={mapView}
            onSetMapView={setMapView}
          />
        </SimpleMapContainer>
      )}
      {membersByType && membersByType.size > 0 && (
        <Box>
          <FieldGroup
            group={{
              fields: membersByType.reduce(
                (memo, actors, typeid) => memo.concat([
                  getActorConnectionField({
                    actors,
                    onEntityClick,
                    typeid,
                    taxonomies,
                    connections: actorConnections,
                    columns: [
                      {
                        id: 'main',
                        type: 'main',
                        sort: 'title',
                        attributes: ['code', 'title'],
                      },
                      {
                        id: 'actorActions',
                        type: 'actorActions',
                        subject: 'actors',
                        actions: 'actions',
                      },
                      {
                        id: 'actorActionsTargets',
                        type: 'actorActions',
                        subject: 'targets',
                        actions: 'targetingActions',
                      },
                    ],
                  }),
                ]),
                [],
              ),
            }}
          />
        </Box>
      )}
    </Styled>
  );
}

ActorViewDetailsMembers.propTypes = {
  onEntityClick: PropTypes.func,
  membersByType: PropTypes.instanceOf(Map),
  taxonomies: PropTypes.instanceOf(Map),
  actorConnections: PropTypes.instanceOf(Map),
  printArgs: PropTypes.object,
};

const mapStateToProps = (state, { id }) => ({
  membersByType: selectMembersByType(state, id),
  printArgs: selectPrintConfig(state),
});

export default connect(mapStateToProps, null)(ActorViewDetailsMembers);
