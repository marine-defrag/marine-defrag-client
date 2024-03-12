import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { Map } from 'immutable';
import { Box, ResponsiveContext, ThemeContext } from 'grommet';

import styled from 'styled-components';

import appMessages from 'containers/App/messages';

import { ROUTES, ACTORTYPE_GROUPS, ACTORTYPES } from 'themes/config';
import { CONFIG } from 'containers/ActorList/constants';
import { loadEntitiesIfNeeded, updatePath } from 'containers/App/actions';
import { selectReady, selectIsUserManager, selectActortypeActors } from 'containers/App/selectors';

import Icon from 'components/Icon';

import HeaderExplore from 'containers/HeaderExplore';
import ContainerWrapper from 'components/styled/Container/ContainerWrapper';
import Container from 'components/styled/Container';
import Content from 'components/styled/ContentSimple';
import CardTeaser from 'components/CardTeaser';
import Footer from 'containers/Footer';

import { isMinSize } from 'utils/responsive';
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
                <Box
                  direction="row"
                  wrap
                  margin={{ horizontal: '-6px' }}
                >
                  {ACTORTYPE_GROUPS[key].types.map((typeId) => {
                    const path = `${ROUTES.ACTORS}/${typeId}`;
                    const count = types.getIn([typeId, 'count']) ? parseInt(types.getIn([typeId, 'count']), 10) : 0;
                    let viewLinks = [];

                    if (CONFIG.views
                      && CONFIG.views.map
                      && CONFIG.views.map.types
                      && CONFIG.views.map.types.indexOf(typeId) > -1
                    ) {
                      viewLinks = [
                        ...viewLinks,
                        {
                          key: 'map',
                          icon: <Icon name="mapView" />,
                          onClick: () => onUpdatePath(path, 'map'),
                        },
                      ];
                    }
                    if (CONFIG.views && !!CONFIG.views.list) {
                      viewLinks = [
                        ...viewLinks,
                        {
                          key: 'list',
                          icon: <Icon name="listView" />,
                          onClick: () => onUpdatePath(path, 'list'),
                        },
                      ];
                    }
                    let basis = 'full';
                    if (!isLandscape && isMinSize(size, 'medium')) {
                      basis = '1/2';
                    }
                    if (!isLandscape && isMinSize(size, 'large')) {
                      basis = '1/4';
                    }
                    return (
                      <CardTeaser
                        key={typeId}
                        basis={basis}
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
                        viewLinks={viewLinks}
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
      <Footer backgroundImage="landscape_1" />
    </ContainerWrapper>
  );
}

ActorsOverview.propTypes = {
  intl: intlShape.isRequired,
  dataReady: PropTypes.bool,
  isUserManager: PropTypes.bool,
  onLoadData: PropTypes.func.isRequired,
  onUpdatePath: PropTypes.func.isRequired,
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
    onUpdatePath: (path, view) => {
      dispatch(updatePath(path, { view }));
    },
    onSelectActor: (actorId) => {
      dispatch(updatePath(`${ROUTES.ACTOR}/${actorId}`, { replace: true }));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(injectIntl(ActorsOverview));
