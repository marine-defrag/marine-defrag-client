import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { Map } from 'immutable';
import { Box, ResponsiveContext, ThemeContext } from 'grommet';
import { Globe, List } from 'grommet-icons';

import styled from 'styled-components';

import appMessages from 'containers/App/messages';

import { ROUTES, ACTORTYPE_GROUPS, ACTORTYPES } from 'themes/config';
import { CONFIG } from 'containers/ActorList/constants';
import { loadEntitiesIfNeeded, updatePath, setView } from 'containers/App/actions';
import { selectReady, selectIsUserManager, selectActortypeActors } from 'containers/App/selectors';

import HeaderExplore from 'containers/HeaderExplore';
import ContainerWrapper from 'components/styled/Container/ContainerWrapper';
import Container from 'components/styled/Container';
import Content from 'components/styled/ContentSimple';
import CardTeaser from 'components/CardTeaser';
import Footer from 'containers/Footer';

import { isMaxSize } from 'utils/responsive';
import qe from 'utils/quasi-equals';
import { selectActortypesWithActorCount } from './selectors';
import { DEPENDENCIES } from './constants';

const Group = styled((p) => <Box margin={{ bottom: 'large', top: 'medium' }} {...p} />)``;
const GroupTitle = styled.h5`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.global.colors.text.brand};
`;
const ViewContainer = styled(Container)`
  min-height: 70vH;
  @media print {
    min-height: 50vH;
  }
`;
export function ActorsOverview({
  onLoadData,
  types,
  onUpdatePath,
  intl,
  dataReady,
  isUserManager,
  countries,
  onSelectActor,
  onSetView,
}) {
  useEffect(() => {
    // kick off loading of data
    onLoadData();
  }, []);
  const theme = React.useContext(ThemeContext);
  const size = React.useContext(ResponsiveContext);
  const groupIds = Object.keys(ACTORTYPE_GROUPS).filter(
    (key) => ACTORTYPE_GROUPS[key].managerOnly
      ? isUserManager
      : true
  );

  return (
    <ContainerWrapper bg>
      <HeaderExplore />
      <ViewContainer>
        <Content>
          {groupIds.map((key) => {
            const isLandscape = qe(key, 1);
            return (
              <Group key={key}>
                <GroupTitle>
                  <FormattedMessage {...appMessages.actortypeGroups[key]} />
                </GroupTitle>
                <Box direction={isMaxSize(size, 'medium') ? 'column' : 'row'} gap="small">
                  {ACTORTYPE_GROUPS[key].types.map((typeId) => {
                    const path = `${ROUTES.ACTORS}/${typeId}`;
                    const count = types.getIn([typeId, 'count']) ? parseInt(types.getIn([typeId, 'count']), 10) : 0;
                    const iconConfig = [{
                      type: 'list',
                      hasView: CONFIG.views && !!CONFIG.views.list,
                      icon: List,
                      onClick: () => {
                        onSetView('list');
                        onUpdatePath(path, false);
                      },
                    },
                    {
                      type: 'map',
                      hasView: typeId
                        && CONFIG.views
                        && CONFIG.views.map
                        && CONFIG.views.map.types
                        && CONFIG.views.map.types.indexOf(typeId) > -1,
                      icon: Globe,
                      onClick: () => {
                        onSetView('map');
                        onUpdatePath(path, false);
                      },
                    }];
                    return (
                      <CardTeaser
                        key={typeId}
                        basis={isLandscape ? 'full' : '1/4'}
                        isLandscape={isLandscape}
                        path={path}
                        onClick={(evt) => {
                          if (evt && evt.preventDefault) evt.preventDefault();
                          onUpdatePath(path);
                        }}
                        dataReady={dataReady}
                        count={count}
                        title={
                          intl.formatMessage(appMessages.actortypes_long[typeId])
                        }
                        description={
                          intl.formatMessage(appMessages.actortypes_about[typeId])
                        }
                        iconConfig={iconConfig}
                        searchOptions={typeId === ACTORTYPES.COUNTRY ? countries : null}
                        onSelectResult={(actorId) => onSelectActor(actorId)}
                        graphic={theme.media.navCard.actors[typeId]}
                      />
                    );
                  })}
                </Box>
              </Group>
            );
          })}
        </Content>
      </ViewContainer>
      <Footer />
    </ContainerWrapper>
  );
}

ActorsOverview.propTypes = {
  intl: intlShape.isRequired,
  dataReady: PropTypes.bool,
  isUserManager: PropTypes.bool,
  onLoadData: PropTypes.func.isRequired,
  onUpdatePath: PropTypes.func.isRequired,
  onSetView: PropTypes.func.isRequired,
  onSelectActor: PropTypes.func.isRequired,
  types: PropTypes.instanceOf(Map),
  countries: PropTypes.instanceOf(Map),
};

const mapStateToProps = createStructuredSelector({
  dataReady: (state) => selectReady(state, DEPENDENCIES),
  types: (state) => selectActortypesWithActorCount(state),
  isUserManager: (state) => selectIsUserManager(state),
  countries: (state) => selectActortypeActors(state, { type: ACTORTYPES.COUNTRY }),

});

export function mapDispatchToProps(dispatch) {
  return {
    onLoadData: () => {
      DEPENDENCIES.forEach((path) => dispatch(loadEntitiesIfNeeded(path)));
    },
    onUpdatePath: (path, dropQuery = true) => {
      dispatch(updatePath(path, { dropQuery }));
    },
    onSelectActor: (actorId) => {
      dispatch(updatePath(`${ROUTES.ACTOR}/${actorId}`, { replace: true }));
    },
    onSetView: (view) => {
      dispatch(setView(view));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(injectIntl(ActorsOverview));
