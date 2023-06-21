/*
 *
 * EntitiesOverTime
 *
 */
import React, { useRef } from 'react';
// import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { List } from 'immutable';
import { connect } from 'react-redux';
import { ResponsiveContext } from 'grommet';
import styled from 'styled-components';
// import {
//   ACTORTYPES,
//   ROUTES,
// } from 'themes/config';

import { sortEntities } from 'utils/sort';
import { isMaxSize } from 'utils/responsive';

import {
  // selectActors,
  // selectActortypeActors,
  selectActorActionsGroupedByAction,
} from 'containers/App/selectors';
import { CONTENT_LIST } from 'containers/App/constants';
// import { updatePath } from 'containers/App/actions';

import PrintHide from 'components/styled/PrintHide';
import ContainerWrapper from 'components/styled/Container/ContainerWrapper';
import Container from 'components/styled/Container';
import ContentSimple from 'components/styled/ContentSimple';
import ContentHeader from 'containers/ContentHeader';

import HeaderPrint from 'components/Header/HeaderPrint';
import Loading from 'components/Loading';
import EntityListViewOptions from 'components/EntityListViewOptions';


// import appMessages from 'containers/App/messages';
// import qe from 'utils/quasi-equals';

import ChartTimeline from './ChartTimeline';
// import messages from './messages';
// import { selectActionsByAncestor } from './selectors';

const ChartWrapperOuter = styled.div`
  overflow-x: auto;
  direction: ${({ scrollOverflow }) => scrollOverflow ? 'rtl' : 'tlr'};
`;
const ChartWrapperInner = styled.div`
  width: ${({ scrollOverflow }) => scrollOverflow ? '1000px' : 'auto'};
  direction: ltr
`;

export function EntitiesOverTime({
  dataReady,
  viewOptions,
  entities,
  isPrintView,
  entityTitle,
  allEntityCount,
  hasFilters,
  headerOptions,
}) {
  const scrollContainer = useRef(null);
  const scrollReference = useRef(null);

  let headerTitle;
  let headerSubTitle;
  if (entityTitle) {
    headerTitle = entities
      ? `${entities.size} ${entities.size === 1 ? entityTitle.single : entityTitle.plural}`
      : entityTitle.plural;
  }
  if (hasFilters) {
    headerSubTitle = `of ${allEntityCount} total`;
  }
  const size = React.useContext(ResponsiveContext);

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
              <ContentHeader
                type={CONTENT_LIST}
                title={headerTitle}
                subTitle={headerSubTitle}
                hasViewOptions={viewOptions && viewOptions.length > 1}
                info={headerOptions && headerOptions.info}
              />
              <ChartWrapperOuter scrollOverflow={isMaxSize(size, 'ms')}>
                <ChartWrapperInner scrollOverflow={isMaxSize(size, 'ms')}>
                  <ChartTimeline
                    entities={sortEntities(
                      entities.filter(
                        (entity) => entity.getIn(['attributes', 'date_start'])
                      ),
                      'asc',
                      'date_start', // sortBy
                      'date', // type
                    )}
                  />
                </ChartWrapperInner>
              </ChartWrapperOuter>
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
  headerOptions: PropTypes.object, // single/plural
  entityTitle: PropTypes.object, // single/plural
  // primitive
  dataReady: PropTypes.bool,
  isPrintView: PropTypes.bool,
  allEntityCount: PropTypes.number,
  // typeId: PropTypes.string,
  hasFilters: PropTypes.bool,
  // onEntityClick: PropTypes.func,
  // onSelectAction: PropTypes.func,
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

export default connect(mapStateToProps, null)(EntitiesOverTime);
