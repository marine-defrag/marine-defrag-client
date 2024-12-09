import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
// import styled, { keyframes, css } from 'styled-components';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';

import { isMinSize } from 'utils/responsive';

import {
  Box, Text, Button, ResponsiveContext,
} from 'grommet';

import NormalImg from 'components/Img';
import Icon from 'components/Icon';
import Loading from 'components/Loading';

import Search from './Search';
import BottomButtons from './BottomButtons';

import messages from './messages';

// const pulsateOpacity = keyframes`
//   0% {
//     opacity: 1;
//   }
//   50% {
//     opacity: 0.6;
//   }
//   100% {
//     opacity: 1;
//   }
// `;
//
//   opacity: 1;
//   ${({ isLoading }) => isLoading && css`
//     animation: ${pulsateOpacity} 1.5s infinite;
//     pointer-events: none;
//   `}


const ArrowIcon = styled(Icon)`
  font-weight: bold;
`;
const ExploreText = styled((p) => <Text weight="bold" {...p} />)``;


const Styled = styled((p) => (
  <Box pad="xsmall" responsive={false} {...p} />
))``;
const CardWrapper = styled((p) => <Box {...p} />)`
  width:100%;
  height: 100%;
  position: relative;
`;
const CardLink = styled((p) => <Button plain as="a" fill="vertical" {...p} />)`
  border-radius: 10px;
  padding: 0px 15px;
  min-height: ${({ isPrimary }) => isPrimary ? 180 : 0}px;
  box-shadow: 0px 2px 4px rgba(0,0,0,0.20);
  color: ${({ theme }) => theme.global.colors.brand};
  background: white;
  &:hover, &:focus-visible {
    box-shadow: 0px 2px 8px rgba(0,0,0,0.33);
    color: ${({ theme }) => theme.global.colors.highlight};
  }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.global.colors.highlight};
    border-radius: 10px;
    box-shadow: none;
  }
`;
const TitleWrap = styled((p) => <Box {...p} />)``;
const Count = styled((p) => <Text {...p} />)``;
const Title = styled((p) => <Text {...p} />)``;
const Description = styled((p) => <Text size="small" {...p} />)``;
const CardGraphic = styled(NormalImg)`
  margin: ${({ isPrimary }) => isPrimary ? 0 : '0px -15px'};
`;
const SearchWrapper = styled((p) => <Box {...p} />)`
  position:absolute;
  top: ${({ theme }) => theme.sizes.navCardSearch.padding}px;
`;

export function CardTeaser({
  intl,
  isLandscape,
  onClick,
  path,
  count,
  title,
  description,
  basis,
  viewLinks,
  searchOptions,
  onSelectResult,
  graphic,
  dataReady,
}) {
  const size = useContext(ResponsiveContext);
  const isPrimaryLayout = isLandscape && isMinSize(size, 'ms');
  return (
    <Styled
      basis={basis || 'full'}
      isLoading={!dataReady}
    >
      <CardWrapper>
        {searchOptions && isMinSize(size, 'large') && (
          <SearchWrapper direction="row" justify="end" fill="horizontal" style={{ pointerEvents: 'none' }}>
            <Box basis="1/2" style={{ pointerEvents: 'all' }}>
              <Search options={searchOptions} onSelect={onSelectResult} placeholder={intl.formatMessage(messages.searchPlaceholder)} />
            </Box>
          </SearchWrapper>
        )}
        <CardLink
          isPrimary={isPrimaryLayout}
          href={`${path}`}
          onClick={onClick}
        >
          <Box
            direction={isPrimaryLayout ? 'row' : 'column'}
            justify="between"
            fill="vertical"
          >
            {graphic && (
              <Box
                basis={isPrimaryLayout ? '1/2' : 'auto'}
                fill={isPrimaryLayout ? 'vertical' : 'horizontal'}
                justify={isPrimaryLayout ? 'end' : 'start'}
              >
                <CardGraphic
                  src={isPrimaryLayout ? graphic.landscape : graphic.square}
                  alt={`${title} - ${description}`}
                  isPrimary={isPrimaryLayout}
                />
              </Box>
            )}
            <Box
              margin={graphic && !isPrimaryLayout ? 'none' : { top: 'small' }}
              justify="end"
              basis={isPrimaryLayout ? '1/2' : 'auto'}
            >
              <TitleWrap gap="none" margin={{ bottom: 'small' }}>
                {!dataReady && (
                  <Box
                    margin={{ vertical: 'small' }}
                    style={{ maxWidth: isPrimaryLayout ? '120px' : '60px' }}
                  >
                    <Loading />
                  </Box>
                )}
                {dataReady && (
                  <Count
                    weight="bold"
                    size={isPrimaryLayout ? 'xxxlarge' : 'xlarge'}
                  >
                    {count}
                  </Count>
                )}
                <Title weight="bold" size={isPrimaryLayout ? 'xlarge' : 'normal'}>
                  {title}
                </Title>
              </TitleWrap>
              {description && (
                <Description>
                  {description}
                </Description>
              )}
              <Box
                margin={{ top: 'medium', bottom: 'small' }}
                pad="none"
                direction="row"
                align="center"
                gap="xsmall"
              >
                <ExploreText>
                  <FormattedMessage {...messages.explore} />
                </ExploreText>
                <ArrowIcon name="arrowRight" size="0.5em" />
              </Box>
            </Box>
          </Box>
        </CardLink>
        {viewLinks && viewLinks.length > 0 && (
          <BottomButtons viewLinks={viewLinks} />
        )}
      </CardWrapper>
    </Styled>
  );
}

CardTeaser.propTypes = {
  intl: intlShape.isRequired,
  isLandscape: PropTypes.bool,
  dataReady: PropTypes.bool,
  onClick: PropTypes.func,
  path: PropTypes.string,
  count: PropTypes.number,
  title: PropTypes.string,
  description: PropTypes.string,
  basis: PropTypes.string,
  viewLinks: PropTypes.array,
  onSelectResult: PropTypes.func,
  searchOptions: PropTypes.object,
  graphic: PropTypes.object,
  // teaserImage: PropTypes.string,
};

export default injectIntl(CardTeaser);
