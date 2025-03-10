import React from 'react';
import PropTypes from 'prop-types';
// import { injectIntl, intlShape } from 'react-intl';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';
import { Box, Text, ResponsiveContext } from 'grommet';

import { isMinSize } from 'utils/responsive';
//
//
import Icon from 'components/Icon';
import Container from 'components/styled/Container';
import ContentSimple from 'components/styled/ContentSimple';
import ButtonHero from 'components/buttons/ButtonHero';
import CardTeaser from 'components/CardTeaser';
import Slider from './Slider';
//
// import Loading from 'components/Loading';

const Styled = styled.div`
  color: ${({ theme }) => theme.global.colors.brand};
  background-color: ${({ theme }) => theme.global.colors.backgroundX};
`;
const Title = styled.h2`
  color: ${({ theme }) => theme.global.colors.brand};
`;


const Markdown = styled(ReactMarkdown)`
  color: ${({ theme }) => theme.global.colors.brand};
  font-size: ${(props) => props.theme.text.large.size};
  line-height: ${(props) => props.theme.text.large.height};
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    font-size: ${(props) => props.theme.text.xlarge.size};
    line-height: ${(props) => props.theme.text.xlarge.height};
  }
  @media print {
    font-size: ${(props) => props.theme.sizes.print.markdown};
  }
`;

const ButtonExplore = styled(ButtonHero)`
  display: inline-flex;
  flex-grow: 0;
  padding: 0.2em 1em;
  min-width: auto;
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    min-width: auto;
    padding: 0.3em 1.2em;
  }
`;


function TeaserSection({
  title,
  teaser,
  cards,
  overviewPath,
  getCardPath,
  onUpdatePath,
  getCardTitle,
  getCardGraphic,
  // intl,
}) {
  const size = React.useContext(ResponsiveContext);
  let cardNumber = 1;
  if (isMinSize(size, 'ms')) cardNumber = 2;
  if (isMinSize(size, 'large')) cardNumber = 3;
  return (
    <Styled>
      <Container>
        <ContentSimple>
          <Box margin={{ bottom: 'small' }}>
            <Title>{title}</Title>
          </Box>
          <Box
            gap="large"
            direction={isMinSize(size, 'medium') ? 'row' : 'column'}
          >
            <Box basis={isMinSize(size, 'medium') ? '1/3' : '1'} gap="medium">
              <Markdown source={teaser} className="react-markdown" />
              <div>
                <ButtonExplore onClick={() => onUpdatePath(overviewPath)}>
                  <Box direction="row" gap="xsmall" justify="center" align="center">
                    <Text size="large">Explore all</Text>
                    <Icon name="arrow" />
                  </Box>
                </ButtonExplore>
              </div>
            </Box>
            {cards && cards.length > 0 && (
              <Box basis={isMinSize(size, 'medium') ? '2/3' : '1'}>
                <Slider cardNumber={cardNumber}>
                  {cards.map((card, id) => (
                    <Box key={id} fill="vertical">
                      <CardTeaser
                        path={getCardPath(card.id)}
                        onClick={(evt) => {
                          if (evt && evt.preventDefault) evt.preventDefault();
                          onUpdatePath(getCardPath(card.id));
                        }}
                        dataReady
                        title={getCardTitle(card)}
                        count={card.count}
                        graphic={getCardGraphic(card.id)}
                        isHome
                      />
                    </Box>
                  ))}
                </Slider>
              </Box>
            )}
          </Box>
        </ContentSimple>
      </Container>
    </Styled>
  );
}

TeaserSection.propTypes = {
  title: PropTypes.string.isRequired,
  teaser: PropTypes.string.isRequired,
  overviewPath: PropTypes.string.isRequired,
  onUpdatePath: PropTypes.func.isRequired,
  getCardPath: PropTypes.func.isRequired,
  getCardTitle: PropTypes.func.isRequired,
  getCardGraphic: PropTypes.func.isRequired,
  cards: PropTypes.array,
  // intl: intlShape,
};

// export default injectIntl(TeaserSection);
export default TeaserSection;
