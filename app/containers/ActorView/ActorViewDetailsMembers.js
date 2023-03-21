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
import * as topojson from 'topojson-client';

import {
  getActorConnectionField,
} from 'utils/fields';
import qe from 'utils/quasi-equals';

import { ACTORTYPES, ROUTES } from 'themes/config';
import FieldGroup from 'components/fields/FieldGroup';

import MapControl from 'containers/MapControl/MapWrapperLeaflet';

import { selectMembersByType } from './selectors';

const MapOuterWrapper = styled((p) => <Box {...p} />)`
  z-index: 0;
`;
const MapWrapperLeaflet = styled((p) => <Box margin={{ horizontal: 'medium' }} {...p} />)`
  position: relative;
  height: 400px;
`;

export function ActorViewDetailsMembers(props) {
  const {
    onEntityClick,
    membersByType,
    taxonomies,
    actorConnections,
  } = props;
  const countriesJSON = topojson.feature(
    countriesTopo,
    Object.values(countriesTopo.objects)[0],
  );
  const countries = membersByType && membersByType.get(parseInt(ACTORTYPES.COUNTRY, 10));

  const countryData = countries && countries.size > 0 && countriesJSON.features.reduce(
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

  return (
    <Box>
      {(!membersByType || membersByType.size === 0) && (
        <Box margin={{ vertical: 'small', horizontal: 'medium' }}>
          <Text>
            No members found in database
          </Text>
        </Box>
      )}
      {countries && countries.size > 0 && (
        <MapOuterWrapper hasHeader noOverflow>
          <MapWrapperLeaflet>
            <MapControl
              countryData={countryData}
              countryFeatures={countriesJSON.features}
              styleType="members"
              onActorClick={(id) => onEntityClick(id, ROUTES.ACTOR)}
              fitBoundsToCountryOverlay
              projection="gall-peters"
            />
          </MapWrapperLeaflet>
        </MapOuterWrapper>
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
    </Box>
  );
}

ActorViewDetailsMembers.propTypes = {
  onEntityClick: PropTypes.func,
  membersByType: PropTypes.instanceOf(Map),
  taxonomies: PropTypes.instanceOf(Map),
  actorConnections: PropTypes.instanceOf(Map),
};

const mapStateToProps = (state, { id }) => ({
  membersByType: selectMembersByType(state, id),
});

export default connect(mapStateToProps, null)(ActorViewDetailsMembers);
