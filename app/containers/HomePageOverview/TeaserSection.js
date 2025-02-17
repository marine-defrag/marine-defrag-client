import React from 'react';
import PropTypes from 'prop-types';
// import { injectIntl, intlShape } from 'react-intl';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';
import { Box, ResponsiveContext } from 'grommet';

import { isMinSize } from 'utils/responsive';
//
//
import Container from 'components/styled/Container';
import ContentSimple from 'components/styled/ContentSimple';
import ButtonHero from 'components/buttons/ButtonHero';
import CardTeaser from 'components/CardTeaser';
//
// import Loading from 'components/Loading';

const Styled = styled.div`
  color: ${({ theme }) => theme.global.colors.brand};
  background-color: ${({ theme }) => theme.global.colors.backgroundX};
`;
const Title = styled.h3`
  color: ${({ theme }) => theme.global.colors.brand};
`;


const Markdown = styled(ReactMarkdown)`
  color: ${({ theme }) => theme.global.colors.brand};
  font-size: ${(props) => props.theme.sizes.text.markdownMobile};
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    font-size: ${(props) => props.theme.sizes.text.markdown};
  }
  @media print {
    font-size: ${(props) => props.theme.sizes.print.markdown};
  }
`;

const ButtonExplore = styled(ButtonHero)`
  display: inline-flex;
  flex-grow: 0;
  padding: 0.4em 1.2em;
  min-width: auto;
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    min-width: auto;
    padding: 0.5em 1.5em;
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
  return (
    <Styled>
      <Container>
        <ContentSimple>
          <Box>
            <Title>{title}</Title>
          </Box>
          <Box
            gap="large"
            direction={isMinSize(size, 'large') ? 'row' : 'column'}
          >
            <Box basis={isMinSize(size, 'large') ? '1/3' : '1'}>
              <Markdown source={teaser} className="react-markdown" />
              <div>
                <ButtonExplore onClick={() => onUpdatePath(overviewPath)}>
                  Explore all
                </ButtonExplore>
              </div>
            </Box>
            {cards && cards.length > 0 && isMinSize(size, 'medium') && (
              <Box direction="row" wrap basis={isMinSize(size, 'large') ? '2/3' : '1'}>
                {cards.map((card, id) => (
                  <CardTeaser
                    key={id}
                    path={getCardPath(card.id)}
                    onClick={(evt) => {
                      if (evt && evt.preventDefault) evt.preventDefault();
                      onUpdatePath(getCardPath(card.id));
                    }}
                    dataReady
                    title={getCardTitle(card)}
                    count={card.count}
                    graphic={getCardGraphic(card.id)}
                    basis={isMinSize(size, 'large') ? '1/2' : '1/4'}
                    isHome
                  />
                ))}
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
