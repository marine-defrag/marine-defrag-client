import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { injectIntl, intlShape } from 'react-intl';
import { Map, List } from 'immutable';
import {
  Box, Button, ResponsiveContext, ThemeContext,
} from 'grommet';

import styled from 'styled-components';

import appMessages from 'containers/App/messages';
import qe from 'utils/quasi-equals';
import { isMinSize } from 'utils/responsive';

import { ROUTES, FF_ACTIONTYPE } from 'themes/config';
import { updatePath } from 'containers/App/actions';

import HeaderExplore from 'containers/HeaderExplore';
import ContainerWrapper from 'components/styled/Container/ContainerWrapper';
import Container from 'components/styled/Container';
import Content from 'components/styled/ContentSimple';
import CardTeaser from 'components/CardTeaser';
import Loading from 'components/Loading';
import Footer from 'containers/Footer';
import ButtonFactory from 'components/buttons/ButtonFactory';

const Group = styled((p) => <Box margin={{ bottom: 'large', top: 'medium' }} {...p} />)``;
const GroupTitle = styled.h5`
  font-size: 14px;
  font-weight: 500;
  margin-top: 0;
  margin-bottom: 0;
`;
const GroupTitleLabel = styled(GroupTitle)`
  color: ${({ theme }) => theme.global.colors.text.brand};
`;
const ViewContainer = styled(Container)`
  @media print {
    min-height: 50vH;
  }
`;

const ResourceButton = styled((p) => <Button plain {...p} />)`
  &:focus-visible {
    outline: none;
    border-radius: 2px;
    border-bottom: 2px solid ${({ theme }) => theme.global.colors.highlight};
  }
`;

export function ActionsFactsOverview({
  entities, intl, dataReady, handleNew, isManager, connections, onUpdatePath,
}) {
  const typeId = FF_ACTIONTYPE;
  const type = `actions_${typeId}`;

  const optionNew = dataReady && isManager && {
    type: 'add',
    title: [
      intl.formatMessage(appMessages.buttons.add),
      {
        title: intl.formatMessage(appMessages.entities[type].single),
        hiddenSmall: true,
      },
    ],
    onClick: () => handleNew(typeId),
  };
  const indicatorsByResourceId = entities.groupBy(
    (entity) => {
      if (entity.get('resources')) {
        return entity.get('resources').toList().first();
      }
      return 'without';
    }
  );
  const theme = React.useContext(ThemeContext);
  const size = React.useContext(ResponsiveContext);
  return (
    <>
      <ContainerWrapper isStatic bg>
        <HeaderExplore />
        <ViewContainer>
          <Content>
            {optionNew && (
              <Box align="end" margin={{ top: 'small' }}>
                <ButtonFactory button={optionNew} />
              </Box>
            )}
            {!dataReady && (
              <Box margin={{ top: 'large' }}>
                <Loading />
              </Box>
            )}
            {dataReady && (
              <Box>
                {indicatorsByResourceId && indicatorsByResourceId.keySeq().map(
                  (resourceId) => {
                    const resource = !qe(resourceId, 'without')
                      && connections
                      && connections.getIn(['resources', resourceId.toString()]);
                    const resourceIndicators = indicatorsByResourceId.get(resourceId);
                    const isLandscape = isMinSize(size, 'large') && resourceIndicators && resourceIndicators.size < 3;
                    return (
                      <Group key={`res-${resourceId}`}>
                        {resource && (
                          <Box
                            pad={{ top: 'medium', bottom: 'small' }}
                            direction={isMinSize(size, 'ms') ? 'row' : 'column'}
                            gap="xsmall"
                          >
                            <Box>
                              <GroupTitleLabel>
                                Publication
                              </GroupTitleLabel>
                            </Box>
                            <Box>
                              <ResourceButton
                                as="a"
                                href={`${ROUTES.RESOURCE}/${resourceId}`}
                                onClick={(e) => {
                                  if (e) e.preventDefault();
                                  onUpdatePath(`${ROUTES.RESOURCE}/${resourceId}`);
                                }}
                              >
                                <GroupTitle>
                                  {resource.getIn(['attributes', 'title'])}
                                </GroupTitle>
                              </ResourceButton>
                            </Box>
                          </Box>
                        )}
                        {!resource && (
                          <GroupTitle>
                            Without resource
                          </GroupTitle>
                        )}
                        <Box
                          direction="row"
                          wrap
                          margin={{ horizontal: '-6px' }}
                        >
                          {resourceIndicators && resourceIndicators.map((indicator) => {
                            const path = `${ROUTES.ACTION}/${indicator.get('id')}`;
                            const [lead] = indicator.getIn(['attributes', 'description']).split('\n');
                            let basis = 'full';
                            if (isMinSize(size, 'medium')) {
                              basis = '1/2';
                            }
                            if (!isLandscape && isMinSize(size, 'large')) {
                              basis = '1/4';
                            }
                            return (
                              <CardTeaser
                                key={indicator.get('id')}
                                basis={basis}
                                path={path}
                                onClick={(evt) => {
                                  if (evt && evt.preventDefault) evt.preventDefault();
                                  onUpdatePath(path);
                                }}
                                dataReady={dataReady}
                                title={
                                  indicator.getIn(['attributes', 'title'])
                                }
                                description={lead}
                                isLandscape={isLandscape}
                                graphic={theme.media.navCard.indicators[indicator.get('id')]}
                              />
                            );
                          })}
                        </Box>
                      </Group>
                    );
                  }
                )}
              </Box>
            )}
          </Content>
        </ViewContainer>
      </ContainerWrapper>
      <Footer backgroundImage="footer_facts" backgroundColor="#f1f0f1" />
    </>
  );
}

ActionsFactsOverview.propTypes = {
  intl: intlShape.isRequired,
  dataReady: PropTypes.bool,
  onUpdatePath: PropTypes.func.isRequired,
  handleNew: PropTypes.func,
  entities: PropTypes.instanceOf(List).isRequired,
  connections: PropTypes.instanceOf(Map),
  isManager: PropTypes.bool,
};

export function mapDispatchToProps(dispatch) {
  return {
    onUpdatePath: (path) => {
      dispatch(updatePath(path));
    },
    handleNew: (typeId) => {
      dispatch(updatePath(`${ROUTES.ACTIONS}/${typeId}${ROUTES.NEW}`, { replace: true }));
    },
  };
}

const withConnect = connect(
  null,
  mapDispatchToProps,
);

export default compose(withConnect)(injectIntl(ActionsFactsOverview));
