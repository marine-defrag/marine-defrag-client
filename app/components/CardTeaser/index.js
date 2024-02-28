import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import NormalImg from 'components/Img';

import {
  Box, Text, Button, ResponsiveContext, ThemeContext,
} from 'grommet';
import Icon from 'components/Icon';
import DebounceInput from 'react-debounce-input';

import styled from 'styled-components';
import { palette } from 'styled-theme';

import { isMinSize } from 'utils/responsive';

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
const Count = styled((p) => <Text size="xxxlarge" weight="bold" {...p} />)`
`;
const Title = styled((p) => <Text weight="bold" {...p} />)`
`;
const Description = styled((p) => <Text size="small" {...p} />)`
`;
const CardGraphic = styled(NormalImg)`
  width:  ${({ isPrimary }) => isPrimary ? '50%' : '100%'};
`;
const ExploreText = styled((p) => <Text weight="bold" {...p} />)`
`;
const ExploreButton = styled((p) => <Button {...p} />)`
  color: ${({ theme }) => theme.global.colors.text.brand};
  &:hover {
    color: ${({ theme }) => theme.global.colors.text.highlight};
  }
`;
const ExploreWrapper = styled((p) => <Box {...p} justify="between" direction="row" margin={{ right: 'small', left: 'small' }} />)`
  width:  ${({ isPrimary }) => isPrimary ? '50%' : '100%'};
  position: absolute;
  right: 0px;
  bottom: 0px;
  padding: ${({ isPrimary }) => isPrimary ? '0px' : '0px 15px 0px 25px'};
`;
const SearchInput = styled(DebounceInput)`
  &:focus {
    outline: none;
  }
  flex: 1;
  font-size: 0.85em;
  @media print {
    display: none;
  }
`;
const Search = styled.div`
  position:absolute;
  width: 50%;
  height: 45px;
  right: 10px;
  top: 10px;
  border-radius: 50px;
  background-color: ${palette('light', 1)};
  color: ${palette('dark', 2)};
  padding: 2px 7px;
  border: 1px solid ${({ active }) => active ? palette('light', 4) : palette('light', 2)};
  box-shadow: 0 0 3px 0 ${({ active }) => active ? palette('dark', 2) : 'transparent'};
  min-height: ${({ small }) => small ? 30 : 36}px;
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
  // dataReady
  description,
  basis,
  iconNames,
  hasSearchField = false,
}) {
  // const [activeSearchInput, setActiveSearchInput] = useState(false);
  const theme = useContext(ThemeContext);
  const size = useContext(ResponsiveContext);

  return (
    <Styled basis={basis || 'full'}>
      <CardWrapper>
        {hasSearchField
          && (
            <Search>
              <SearchInput
                id="search-input"
                minLength={1}
                debounceTimeout={500}
                value=""
                // active={activeSearchInput}
                // onChange={(e) => onSearch(e.target.value)}
                // onFocus={() => setActiveSearchInput(true)}
                // onBlur={() => setActiveSearchInput(false)}
                placeholder="Search for a country"
              />
            </Search>
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
        <ExploreWrapper isPrimary={primary}>
          <ExploreButton size="medium" margin="none" onClick={onClick}>
            <Box pad="none" direction="row" align="center" gap="small">
              <ExploreText>Explore</ExploreText>
              <ArrowIcon name="arrowRight" size="0.5em" />
            </Box>
          </ExploreButton>
          {iconNames && renderIcons(iconNames)}
        </ExploreWrapper>
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
  // teaserImage: PropTypes.string,
};

export default CardTeaser;
