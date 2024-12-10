import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { Map } from 'immutable';
import { Box, ResponsiveContext } from 'grommet';

import styled from 'styled-components';

import { isMaxSize } from 'utils/responsive';

import appMessages from 'containers/App/messages';
import { usePrint } from 'containers/App/PrintContext';

import { ROUTES, RESOURCETYPE_GROUPS } from 'themes/config';
import { loadEntitiesIfNeeded, updatePath } from 'containers/App/actions';
import { selectReady } from 'containers/App/selectors';
import ContainerWrapper from 'components/styled/Container/ContainerWrapper';
import Container from 'components/styled/Container';
import Content from 'components/styled/ContentSimple';
import CardTeaser from 'components/CardTeaser';
import Footer from 'containers/Footer';

import { selectResourcetypesWithResourceCount } from './selectors';
import { DEPENDENCIES } from './constants';


const Group = styled((p) => <Box margin={{ bottom: 'large', top: 'medium' }} {...p} />)``;
const GroupTitle = styled.h5`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.global.colors.text.brand};
`;
const ViewContainer = styled(Container)`
  min-height: 50vH;
`;
export function ResourcesOverview({
  onLoadData, types, onUpdatePath, intl, dataReady,
}) {
  useEffect(() => {
    // kick off loading of data
    onLoadData();
  }, []);
  const size = React.useContext(ResponsiveContext);
  const isPrint = usePrint();
  return (
    <>
      <ContainerWrapper isStatic bg>
        <ViewContainer isPrint={isPrint}>
          <Content>
            {Object.keys(RESOURCETYPE_GROUPS).map((key) => (
              <Group key={key}>
                <GroupTitle>
                  <FormattedMessage {...appMessages.resourcetypeGroups[key]} />
                </GroupTitle>
                <Box direction={isMaxSize(size, 'medium') ? 'column' : 'row'} gap="small">
                  {RESOURCETYPE_GROUPS[key].types.map((typeId) => {
                    const path = `${ROUTES.RESOURCES}/${typeId}`;
                    const count = types.getIn([typeId, 'count']) ? parseInt(types.getIn([typeId, 'count']), 10) : 0;
                    const { primary } = RESOURCETYPE_GROUPS[key];
                    return (
                      <CardTeaser
                        key={typeId}
                        basis={primary ? '1/2' : '1/4'}
                        primary={primary}
                        path={path}
                        onClick={(evt) => {
                          if (evt && evt.preventDefault) evt.preventDefault();
                          onUpdatePath(path);
                        }}
                        dataReady={dataReady}
                        count={count}
                        title={
                          intl.formatMessage(appMessages.resourcetypes_long[typeId])
                        }
                        description={
                          intl.formatMessage(appMessages.resourcetypes_about[typeId])
                        }
                      />
                    );
                  })}
                </Box>
              </Group>
            ))}
          </Content>
        </ViewContainer>
      </ContainerWrapper>
      <Footer />
    </>
  );
}

ResourcesOverview.propTypes = {
  intl: intlShape.isRequired,
  onLoadData: PropTypes.func.isRequired,
  onUpdatePath: PropTypes.func.isRequired,
  types: PropTypes.instanceOf(Map),
  dataReady: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  dataReady: (state) => selectReady(state, { path: DEPENDENCIES }),
  types: (state) => selectResourcetypesWithResourceCount(state),
});

export function mapDispatchToProps(dispatch) {
  return {
    onLoadData: () => {
      DEPENDENCIES.forEach((path) => dispatch(loadEntitiesIfNeeded(path)));
    },
    onUpdatePath: (path) => {
      dispatch(updatePath(path));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(injectIntl(ResourcesOverview));
