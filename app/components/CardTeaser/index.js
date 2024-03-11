import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { injectIntl, intlShape } from 'react-intl';

import { isMinSize } from 'utils/responsive';

import {
  Box, Text, Button, ResponsiveContext,
} from 'grommet';

import NormalImg from 'components/Img';
import Search from './Search';
import BottomButtons from './BottomButtons';

import messages from './messages';

const Styled = styled((p) => <Box {...p} elevation="small" background="white" />)`
  border-radius: 10px;
`;
const CardWrapper = styled.div`
  width:100%;
  height: 100%;
  position: relative;
`;
const CardLink = styled((p) => <Button plain as="a" fill="vertical" {...p} />)`
  padding: ${({ isPrimary }) => isPrimary ? '0px 15px 45px 0px' : '0 15px 35px'};
  min-height: ${({ isPrimary }) => isPrimary ? 180 : 0}px;
  color: ${({ theme }) => theme.global.colors.text.brand};
  &:hover {
    color: ${({ theme }) => theme.global.colors.text.highlight};
  }
`;
const TitleWrap = styled((p) => <Box {...p} />)``;
const Count = styled((p) => <Text {...p} />)``;
const Title = styled((p) => <Text {...p} />)``;
const Description = styled((p) => <Text size="small" {...p} />)``;
const CardGraphic = styled(NormalImg)`
  width:  ${({ isPrimary }) => isPrimary ? '50%' : '100%'};
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
  iconConfig,
  searchOptions,
  onSelectResult,
  graphic,
}) {
  const size = useContext(ResponsiveContext);
  const isPrimaryLayout = isLandscape && isMinSize(size, 'large');
  return (
    <Styled basis={basis || 'full'}>
      <CardWrapper>
        {searchOptions && isMinSize(size, 'large') && (
          <SearchWrapper direction="row" justify="between" fill="horizontal">
            <Box width="100%" />
            <Box direction="row" justify="between" fill="horizontal">
              <Search options={searchOptions} onSelect={onSelectResult} placeholder={intl.formatMessage(messages.searchPlaceholder)} />
            </Box>
          </SearchWrapper>
        )}
        <CardLink
          isPrimary={isPrimaryLayout}
          href={`${path}`}
          onClick={onClick}
        >
          <Box direction={isPrimaryLayout ? 'row' : 'column'} justify="between" fill="vertical">
            {graphic && (
              <CardGraphic
                isPrimary={isPrimaryLayout}
                src={isPrimaryLayout ? graphic.landscape : graphic.square}
                alt={`${title} - ${description}`}
              />
            )}
            <Box justify="end" width={isPrimaryLayout ? '50%' : '100%'}>
              <TitleWrap gap="none" margin={{ bottom: 'medium' }}>
                <Count weight="bold" size={isPrimaryLayout ? 'xxxlarge' : 'xlarge'}>{count}</Count>
                <Title weight="bold" size={isPrimaryLayout ? 'xlarge' : 'normal'}>
                  {title}
                </Title>
              </TitleWrap>
              {description && (
                <Description>
                  {description}
                </Description>
              )}
            </Box>
          </Box>
        </CardLink>
        <BottomButtons primary={isPrimaryLayout} iconConfig={iconConfig} onClick={onClick} />
      </CardWrapper>
    </Styled>
  );
}

CardTeaser.propTypes = {
  intl: intlShape.isRequired,
  isLandscape: PropTypes.bool,
  // dataReady: PropTypes.bool,
  onClick: PropTypes.func,
  path: PropTypes.string,
  count: PropTypes.number,
  title: PropTypes.string,
  description: PropTypes.string,
  basis: PropTypes.string,
  iconConfig: PropTypes.array,
  onSelectResult: PropTypes.func,
  searchOptions: PropTypes.object,
  graphic: PropTypes.object,
  // teaserImage: PropTypes.string,
};

export default injectIntl(CardTeaser);
