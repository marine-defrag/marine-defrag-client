/*
 *
 * EntitiesOverTime
 *
 */
import React, { useRef } from 'react';
// import React, { useEffect } from 'react';
import { injectIntl, intlShape } from 'react-intl';
import PropTypes from 'prop-types';
import { List } from 'immutable';
import { connect } from 'react-redux';
// import styled from 'styled-components';
import { Box, Text } from 'grommet';

// import {
//   ACTORTYPES,
//   ROUTES,
// } from 'themes/config';

import { sortEntities } from 'utils/sort';

import {
  // selectActors,
  // selectActortypeActors,
  selectActorActionsGroupedByAction,
} from 'containers/App/selectors';

// import { updatePath } from 'containers/App/actions';

import PrintHide from 'components/styled/PrintHide';
import ContainerWrapper from 'components/styled/Container/ContainerWrapper';
import Container from 'components/styled/Container';
import ContentSimple from 'components/styled/ContentSimple';
import HeaderPrint from 'components/Header/HeaderPrint';
import Loading from 'components/Loading';
import EntityListViewOptions from 'components/EntityListViewOptions';

// import appMessages from 'containers/App/messages';
// import qe from 'utils/quasi-equals';
// import messages from './messages';
// import { selectActionsByAncestor } from './selectors';
import { getActionsWithOffspring } from './utils';

// const LoadingWrap = styled.div`
//   position: absolute;
//   top: 0;
//   bottom: 0;
//   right: 0;
//   left: 0;
//   background: white;
//   z-index: 999;
//   pointer-events: none;
//   background: none;
// `;

// const Styled = styled((p) => <ContainerWrapper {...p} />)`
//   background: white;
//   box-shadow: none;
//   padding: 0;
// `;

export function EntitiesOverTime({
  dataReady,
  viewOptions,
  entities,
  isPrintView,
  intl,
  // config,
  // actortypes,
  // actiontypes,
  // typeId,
  // includeActorMembers,
  // includeTargetMembers,
  // countries,
  // actors,
  // actions,
  // actionsWithOffspring,
  // onEntityClick,
  // hasFilters,
  // actionActorsByAction,
  // membershipsByAssociation,
  // actorActionsByAction,
  // countriesWithIndicators,
  // locationsWithIndicators,
  // ffIndicatorId,
  // onSetFFOverlay,
  // onSelectAction,
  // onSetMapLoading,
  // connections,
  // connectedTaxonomies,
  // locationQuery,
  // taxonomies,
}) {
  const scrollContainer = useRef(null);
  const scrollReference = useRef(null);
  const actionsWithOffspring = entities && sortEntities(
    getActionsWithOffspring(
      entities.filter(
        (entity) => entity.getIn(['attributes', 'date_start'])
      )
    ),
    'asc',
    'date_start', // sortBy
    'date', // type
  );

  const actionsGrouped = actionsWithOffspring.groupBy(
    (action) => action.get('offspring') && action.get('offspring').size > 0
      ? 'with'
      : 'without'
  );
  return (
    <ContainerWrapper headerStyle="types" ref={scrollContainer} isPrint={isPrintView}>
      {isPrintView && (
        <HeaderPrint />
      )}
      {viewOptions && viewOptions.length > 1 && !isPrintView && (
        <PrintHide>
          <EntityListViewOptions isPrintView={isPrintView} options={viewOptions} />
        </PrintHide>
      )}
      <Container ref={scrollReference} isPrint={isPrintView}>
        <ContentSimple isPrint={isPrintView}>
          {!dataReady && (<Loading />)}
          {dataReady && (
            <div>
              <Box margin={{ vertical: 'large' }}>
                <Text color="textSecondary" size="large">Actions with Children</Text>
              </Box>
              <Box gap="medium">
                {actionsGrouped
                  && actionsGrouped.get('with')
                  && actionsGrouped.get('with').valueSeq().map(
                    (action) => (
                      <Box key={action.get('id')}>
                        <Box>
                          <Text size="small">
                            {intl.formatDate(new Date(action.getIn(['attributes', 'date_start'])))}
                          </Text>
                          <Text size="small">
                            {action.getIn(['attributes', 'title'])}
                          </Text>
                        </Box>
                        {action.get('offspring') && action.get('offspring').size > 0 && (
                          <Box margin={{ left: 'large', top: 'small' }}>
                            <Box gap="small">
                              {sortEntities(
                                action.get('offspring'),
                                'asc',
                                'date_start', // sortBy
                                'date', // type
                              ).map((child) => (
                                <Box key={child.get('id')}>
                                  <Text size="small">
                                    {intl.formatDate(new Date(child.getIn(['attributes', 'date_start'])))}
                                  </Text>
                                  <Text size="small">
                                    {child.getIn(['attributes', 'title'])}
                                  </Text>
                                </Box>
                              ))}
                            </Box>
                          </Box>
                        )}
                      </Box>
                    )
                  )}
              </Box>
              <Box margin={{ vertical: 'large' }}>
                <Text color="textSecondary" size="large">Actions without Children</Text>
              </Box>
              <Box gap="medium">
                {actionsGrouped
                  && actionsGrouped.get('without')
                  && actionsGrouped.get('without').valueSeq().map(
                    (action) => (
                      <Box key={action.get('id')}>
                        <Box>
                          <Text size="small">
                            {intl.formatDate(new Date(action.getIn(['attributes', 'date_start'])))}
                          </Text>
                          <Text size="small">
                            {action.getIn(['attributes', 'title'])}
                          </Text>
                        </Box>
                      </Box>
                    )
                  )}
              </Box>
            </div>
          )}
        </ContentSimple>
      </Container>
    </ContainerWrapper>
  );
}

EntitiesOverTime.propTypes = {
  entities: PropTypes.instanceOf(List),
  viewOptions: PropTypes.array,
  // config: PropTypes.object,
  // actors: PropTypes.instanceOf(Map),
  // actions: PropTypes.instanceOf(Map),
  // connections: PropTypes.instanceOf(Map),
  // actortypes: PropTypes.instanceOf(Map),
  // actiontypes: PropTypes.instanceOf(Map),
  // primitive
  dataReady: PropTypes.bool,
  isPrintView: PropTypes.bool,
  // typeId: PropTypes.string,
  // hasFilters: PropTypes.bool,
  // onEntityClick: PropTypes.func,
  // onSelectAction: PropTypes.func,
  intl: intlShape.isRequired,
};

const mapStateToProps = (state) => ({
  // countries: selectActortypeActors(state, { type: ACTORTYPES.COUNTRY }),
  // actors: selectActors(state),
  // actions: selectActions(state),
  actorActionsByAction: selectActorActionsGroupedByAction(state), // for figuring out targeted countries
});

// function mapDispatchToProps(dispatch) {
//   return {
//     onSelectAction: (id) => {
//       dispatch(updatePath(`${ROUTES.ACTION}/${id}`));
//     },
//   };
// }

export default connect(mapStateToProps, null)(injectIntl(EntitiesOverTime));
