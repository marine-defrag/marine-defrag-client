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
import Icon from 'components/Icon';
import { ROUTES, ACTIONTYPE_GROUPS } from 'themes/config';
import { loadEntitiesIfNeeded, updatePath } from 'containers/App/actions';
import { selectReady } from 'containers/App/selectors';
import { CONFIG } from 'containers/ActionList/constants';

import HeaderExplore from 'containers/HeaderExplore';
import ContainerWrapper from 'components/styled/Container/ContainerWrapper';
import Container from 'components/styled/Container';
import Content from 'components/styled/ContentSimple';
import CardTeaser from 'components/CardTeaser';
import Footer from 'containers/Footer';

import qe from 'utils/quasi-equals';
import { isMinSize } from 'utils/responsive';

import { selectActiontypesWithActionCount } from './selectors';
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
export function ActionsOverview({
  onLoadData,
  types,
  onUpdatePath,
  intl,
  dataReady,
}) {
  useEffect(() => {
    // kick off loading of data
    onLoadData();
  }, []);
  const theme = React.useContext(ThemeContext);
  const size = React.useContext(ResponsiveContext);

  return (
    <ContainerWrapper bg>
      <HeaderExplore />
      <ViewContainer>
        <Content>
          {Object.keys(ACTIONTYPE_GROUPS).map((key) => {
            const isLandscape = qe(key, 1);
            return (
              <Group key={key}>
                <GroupTitle>
                  <FormattedMessage {...appMessages.actiontypeGroups[key]} />
                </GroupTitle>
                <Box
                  direction="row"
                  wrap
                  margin={{ horizontal: '-6px' }}
                >
                  {ACTIONTYPE_GROUPS[key].types.map((typeId) => {
                    const path = `${ROUTES.ACTIONS}/${typeId}`;
                    const count = types.getIn([typeId, 'count']) ? parseInt(types.getIn([typeId, 'count']), 10) : 0;
                    let viewLinks = [];
                    if (CONFIG.views
                      && CONFIG.views.map
                      && CONFIG.views.map.types
                      && CONFIG.views.map.types.indexOf(typeId) > -1) {
                      viewLinks = [
                        ...viewLinks,
                        {
                          key: 'map',
                          icon: <Icon name="mapView" />,
                          onClick: () => onUpdatePath(path, 'map'),
                          title: 'Go to map view',
                        },
                      ];
                    }
                    if (CONFIG.views
                      && CONFIG.views.timeline
                      && CONFIG.views.timeline.types
                      && CONFIG.views.timeline.types.indexOf(typeId) > -1) {
                      viewLinks = [
                        ...viewLinks,
                        {
                          key: 'timeline',
                          icon: <Icon name="timelineView" />,
                          onClick: () => onUpdatePath(path, 'time'),
                          title: 'Go to timeline view',
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
                          title: 'Go to list view',
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
                        path={path}
                        basis={basis}
                        onClick={(evt) => {
                          if (evt && evt.preventDefault) evt.preventDefault();
                          onUpdatePath(path);
                        }}
                        dataReady={dataReady}
                        count={count}
                        title={
                          intl.formatMessage(appMessages.actiontypes_long[typeId])
                        }
                        description={
                          intl.formatMessage(appMessages.actiontypes_about[typeId])
                        }
                        viewLinks={viewLinks}
                        isLandscape={isLandscape}
                        graphic={theme.media.navCard.activities[typeId]}
                      />
                    );
                  })}
                </Box>
              </Group>
            );
          })}
        </Content>
      </ViewContainer>
      <Footer backgroundImage="footer_actions" />
    </ContainerWrapper>
  );
}

ActionsOverview.propTypes = {
  intl: intlShape.isRequired,
  dataReady: PropTypes.bool,
  onLoadData: PropTypes.func.isRequired,
  onUpdatePath: PropTypes.func.isRequired,
  types: PropTypes.instanceOf(Map),
};

const mapStateToProps = createStructuredSelector({
  dataReady: (state) => selectReady(state, DEPENDENCIES),
  types: (state) => selectActiontypesWithActionCount(state),
});

export function mapDispatchToProps(dispatch) {
  return {
    onLoadData: () => {
      DEPENDENCIES.forEach((path) => dispatch(loadEntitiesIfNeeded(path)));
    },
    onUpdatePath: (path, view) => {
      dispatch(updatePath(path, { view }));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(injectIntl(ActionsOverview));
