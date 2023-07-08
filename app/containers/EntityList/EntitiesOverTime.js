/*
 *
 * EntitiesOverTime
 *
 */
import React, { useRef } from 'react';
// import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { List, Map } from 'immutable';
import { connect } from 'react-redux';
import { ResponsiveContext, Box } from 'grommet';
import styled from 'styled-components';
// import {
//   ACTORTYPES,
//   ROUTES,
// } from 'themes/config';

import { sortEntities } from 'utils/sort';
import { isMaxSize } from 'utils/responsive';
import { testEntityCategoryValueAssociation } from 'utils/entities';

import {
  // selectActors,
  // selectActortypeActors,
  selectActorActionsGroupedByAction,
  selectActiontypeTaxonomiesWithCats,
  selectTimelineHighlightCategory,
} from 'containers/App/selectors';
import { CONTENT_LIST } from 'containers/App/constants';
import { setTimelineHighlightCategory } from 'containers/App/actions';
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
import EntitiesCategories from './EntitiesCategories';
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

const prepareEntityOptions = (
  entities, highlightCategory,
) => highlightCategory !== undefined ? entities.map(
  (entity) => {
    const color = entity.get('categories')
      && testEntityCategoryValueAssociation(entity, 'categories', highlightCategory) ? '#FF0000' : '#89CFF0';
    return entity.setIn(['attributes', 'color'], color);
  },
  []
) : entities;
export function EntitiesOverTime({
  dataReady,
  viewOptions,
  entities,
  isPrintView,
  entityTitle,
  allEntityCount,
  hasFilters,
  headerOptions,
  taxonomiesWithCats,
  onSetCategory,
  onResetCategory,
  highlightCategory,
}) {
  console.log('taxonomiesWithCats', taxonomiesWithCats && taxonomiesWithCats.toJS());
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
                    highlightCategory={highlightCategory}
                    entities={prepareEntityOptions(sortEntities(
                      entities.filter(
                        (entity) => entity.getIn(['attributes', 'date_start'])
                      ),
                      'asc',
                      'date_start', // sortBy
                      'date', // type
                    ), highlightCategory)}
                  />
                </ChartWrapperInner>
              </ChartWrapperOuter>
              <Box direction="row" fill={false}>
                {taxonomiesWithCats
                  && (
                    <EntitiesCategories
                      taxonomiesWithCats={taxonomiesWithCats}
                      onSetCategory={onSetCategory}
                      onResetCategory={onResetCategory}
                      highlightCategory={highlightCategory}
                    />
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
  taxonomiesWithCats: PropTypes.instanceOf(Map),
  headerOptions: PropTypes.object, // single/plural
  entityTitle: PropTypes.object, // single/plural
  // primitive
  dataReady: PropTypes.bool,
  isPrintView: PropTypes.bool,
  allEntityCount: PropTypes.number,
  // typeId: PropTypes.string,
  highlightCategory: PropTypes.string,
  hasFilters: PropTypes.bool,
  onSetCategory: PropTypes.func,
  onResetCategory: PropTypes.func,
  // onEntityClick: PropTypes.func,
  // onSelectAction: PropTypes.func,
};

const mapStateToProps = (state, { typeId }) => ({
  // countries: selectActortypeActors(state, { type: ACTORTYPES.COUNTRY }),
  // actors: selectActors(state),
  // actions: selectActions(state),
  actorActionsByAction: selectActorActionsGroupedByAction(state), // for figuring out targeted countries
  taxonomiesWithCats: selectActiontypeTaxonomiesWithCats(state, { type: typeId }),
  highlightCategory: selectTimelineHighlightCategory(state),
});

function mapDispatchToProps(dispatch) {
  return {
    onSetCategory: (catId) => {
      dispatch(setTimelineHighlightCategory(catId));
    },
    onResetCategory: () => {
      dispatch(setTimelineHighlightCategory());
    },
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(EntitiesOverTime);
