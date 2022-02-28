/*
 *
 * Activities
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
// import { FormattedMessage, intlShape, injectIntl } from 'react-intl';
import { Box, Text } from 'grommet';
import { Map } from 'immutable';
import styled from 'styled-components';
import countriesTopo from 'data/ne_countries_10m_v5.topo.json';
import * as topojson from 'topojson-client';

import {
  getActorConnectionField,
} from 'utils/fields';
import qe from 'utils/quasi-equals';

import { ACTORTYPES } from 'themes/config';
import FieldGroup from 'components/fields/FieldGroup';

// import appMessages from 'containers/App/messages';
// import ActorMap from './ActorMap';
import MapContainer from 'containers/EntitiesMap/MapContainer';
// import messages from './messages';

const MapOuterWrapper = styled((p) => <Box {...p} />)`
  z-index: 0;
`;
const MapTitle = styled((p) => <Box margin={{ horizontal: 'medium', vertical: 'xsmall' }} {...p} />)``;
const MapWrapper = styled((p) => <Box margin={{ horizontal: 'medium' }} {...p} />)`
  position: relative;
  height: 400px;
`;

export function Members(props) {
  const {
    // viewEntity,
    // viewSubject,
    onEntityClick,
    membersByType,
    // actiontypes,
    // taxonomies,
    // actionConnections,
    // onSetActiontype,
    // viewActiontypeId,
    // actionsByActiontype,
    // actionsAsTargetByActiontype,
    // actionsAsMemberByActortype,
    // actionsAsTargetAsMemberByActortype,
    // viewActortype,
    // hasMembers,
    // intl,
  } = props;
  const countriesJSON = topojson.feature(
    countriesTopo,
    Object.values(countriesTopo.objects)[0],
  );
  const countries = membersByType && membersByType.get(parseInt(ACTORTYPES.COUNTRY, 10));
  const countryData = countriesJSON.features.reduce(
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
            style: {
              fillOpacity: 0.6,
            },
          },
        ];
      }
      return memo;
    },
    [],
  );
  const mapTitle = 'Member countries';
  return (
    <Box>
      {(!membersByType || membersByType.size === 0) && (
        <Box margin={{ vertical: 'small', horizontal: 'medium' }}>
          <Text>
            No members found in database
          </Text>
        </Box>
      )}
      {membersByType && membersByType.size > 0 && (
        <Box>
          <MapOuterWrapper hasHeader noOverflow>
            {mapTitle && (
              <MapTitle>
                <Text weight={600}>{mapTitle}</Text>
              </MapTitle>
            )}
            <MapWrapper>
              <MapContainer
                countryData={countryData}
                countryFeatures={countriesJSON.features}
                indicator="actions"
                onCountryClick={(id) => onEntityClick(id)}
                mapSubject="actors"
                fitBounds
                projection="gall-peters"
              />
            </MapWrapper>
          </MapOuterWrapper>
        </Box>
      )}
      {membersByType && membersByType.size > 0 && (
        <Box>
          <FieldGroup
            aside
            group={{
              fields: membersByType.reduce(
                (memo, actors, typeid) => memo.concat([
                  getActorConnectionField({
                    actors,
                    onEntityClick,
                    typeid,
                  }),
                ]),
                [],
              ),
            }}
          />
        </Box>
      )}
    </Box>
  );
}

Members.propTypes = {
  onEntityClick: PropTypes.func,
  membersByType: PropTypes.instanceOf(Map),
};


export default Members;
