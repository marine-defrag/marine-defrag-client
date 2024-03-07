import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';

import { isMinSize } from 'utils/responsive';
import { ACTORTYPES, ROUTES } from 'themes/config';

import { updatePath } from 'containers/App/actions';
import { selectActortypeActors } from 'containers/App/selectors';

import {
  Box, Text, Button, ResponsiveContext, ThemeContext,
} from 'grommet';

import NormalImg from 'components/Img';
import Icon from 'components/Icon';
import Search from './Search';

const Styled = styled((p) => <Box {...p} elevation="small" background="white" pad={{ top: 'small', bottom: 'small' }} />)`
  border-radius: 10px;
`;
const CardWrapper = styled.div`
  width:100%;
  height: 100%;
  position: relative;
`;
const CardLink = styled((p) => <Button plain as="a" fill="vertical" {...p} />)`
  padding: ${({ isPrimary }) => isPrimary ? '0px 15px 30px 0px' : '30px 15px'};
  min-height: ${({ isPrimary }) => isPrimary ? 180 : 0}px;
  color: ${({ theme }) => theme.global.colors.text.brand};
  &:hover {
    color: ${({ theme }) => theme.global.colors.text.highlight};
  }
`;
const TitleWrap = styled((p) => <Box gap="none" margin={{ bottom: 'medium' }} {...p} />)``;
const Count = styled((p) => <Text size="xxxlarge" weight="bold" {...p} />)``;
const Title = styled((p) => <Text weight="bold" {...p} />)``;
const Description = styled((p) => <Text size="small" {...p} />)``;
const CardGraphic = styled(NormalImg)`
  width:  ${({ isPrimary }) => isPrimary ? '50%' : '100%'};
`;
const ExploreText = styled((p) => <Text weight="bold" {...p} />)`
  color: ${({ theme }) => theme.global.colors.text.brand};
  &:hover {
    color: ${({ theme }) => theme.global.colors.text.highlight};
  }
`;
const BottomButtons = styled((p) => <Box {...p} />)`
  padding: ${({ isPrimary }) => isPrimary ? '0px 15px 0px 0px' : '0px 15px'};
  position: absolute;
  right: 0px;
  bottom: 0px;
`;
const SearchWrapper = styled((p) => <Box {...p} />)`
  position:absolute;
  top: 10px;
`;
const ArrowIcon = styled(Icon)`
  font-weight: bold;
`;

function renderIcons(icons) {
  return (
    <Box direction="row" align="center">
      {icons.map((icon, index) => <Icon name={icon} key={index} />)}
    </Box>
  );
}

export function CardTeaser({
  primary,
  onClick,
  path,
  count,
  title,
  description,
  basis,
  iconNames,
  hasSearchField = false,
  countries,
  onSelectCountry,
}) {
  const theme = useContext(ThemeContext);
  const size = useContext(ResponsiveContext);

  return (
    <Styled basis={basis || 'full'}>
      <CardWrapper>
        {hasSearchField
          && (
            <SearchWrapper direction="row" justify="between" fill="horizontal">
              <Box width="100%" />
              <Box direction="row" justify="between" fill="horizontal">
                <Search options={countries} onSelect={onSelectCountry} placeholder="Quick select country" />
              </Box>
            </SearchWrapper>
          )
        }
        <CardLink
          isPrimary={primary && isMinSize(size, 'large')}
          href={`${path}`}
          onClick={onClick}
        >
          <Box direction={primary ? 'row' : 'column'} justify="between" fill="vertical">
            <CardGraphic
              isPrimary={primary}
              src={primary ? theme.media.navCardLarge : theme.media.navCardSmall}
              alt="Nav card"
            />
            <Box justify="end" width={primary ? '50%' : '100%'}>
              <TitleWrap>
                <Count size={primary ? 'xxxlarge' : 'xlarge'}>{count}</Count>
                <Title size={primary ? 'xlarge' : 'normal'}>
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
        <BottomButtons isPrimary={primary} direction="row" justify="between" fill="horizontal">
          {primary && <Box width="100%" />}
          <Box direction="row" justify="between" fill="horizontal">
            <Button onClick={onClick}>
              <Box pad="none" direction="row" align="center" gap="xsmall">
                <ExploreText>Explore</ExploreText>
                <ArrowIcon name="arrowRight" size="0.5em" />
              </Box>
            </Button>
            {iconNames && renderIcons(iconNames)}
          </Box>
        </BottomButtons>
      </CardWrapper>
    </Styled>
  );
}

CardTeaser.propTypes = {
  // intl: intlShape.isRequired,
  primary: PropTypes.bool,
  // dataReady: PropTypes.bool,
  onClick: PropTypes.func,
  path: PropTypes.string,
  count: PropTypes.number,
  title: PropTypes.string,
  description: PropTypes.string,
  basis: PropTypes.string,
  iconNames: PropTypes.array,
  hasSearchField: PropTypes.bool,
  onSelectCountry: PropTypes.func,
  countries: PropTypes.object,
  // teaserImage: PropTypes.string,
};

export function mapDispatchToProps(dispatch) {
  return {
    onSelectCountry: (typeId) => dispatch(updatePath(`${ROUTES.ACTOR}/${typeId}`, { replace: true })),
  };
}

const mapStateToProps = (state) => ({
  countries: selectActortypeActors(state, { type: ACTORTYPES.COUNTRY }),
});

export default connect(mapStateToProps, mapDispatchToProps)(CardTeaser);
