import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import NormalImg from 'components/Img';
import {
  Box, Text, Button, ResponsiveContext, ThemeContext,
} from 'grommet';

import styled from 'styled-components';

import { isMinSize } from 'utils/responsive';

const Styled = styled((p) => <Box {...p} />)`
  border-radius: 10px;
`;
const CardLink = styled((p) => <Button plain as="a" fill="vertical" {...p} />)`
  padding: 20px 15px;
  min-height: ${({ prim }) => prim ? 180 : 0}px;
  color: ${({ theme }) => theme.global.colors.text.brand};
  &:hover {
    color: ${({ theme }) => theme.global.colors.text.highlight};
  }
`;
const TitleWrap = styled((p) => <Box margin={{ bottom: 'medium' }} {...p} />)``;
const Count = styled((p) => <Text size="xlarge" weight="bold" {...p} />)`
`;
const Title = styled((p) => <Text weight="bold" {...p} />)`
`;
const Description = styled((p) => <Text size="small" {...p} />)`
`;

const CardGraphic = styled(NormalImg)`
`;
export function CardTeaser({
  primary,
  onClick,
  path,
  count,
  title,
  // dataReady
  description,
  basis,
}) {
  const theme = useContext(ThemeContext);
  const size = useContext(ResponsiveContext);

  return (
    <Styled elevation="small" background="white" basis={basis || 'full'}>
      <CardLink
        prim={primary && isMinSize(size, 'large')}
        href={`${path}`}
        onClick={onClick}
      >
        <Box direction="column" justify="between" fill="vertical">
          <CardGraphic src={primary ? theme.media.navCardLarge : theme.media.navCardSmall} alt="Nav card" />
          <TitleWrap
            direction={(primary && isMinSize(size, 'medium')) ? 'row' : 'column'}
            gap={(primary && isMinSize(size, 'medium')) ? 'small' : 'none'}
          >
            <Count>{count}</Count>
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
      </CardLink>
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
  // teaserImage: PropTypes.string,
};

export default CardTeaser;
