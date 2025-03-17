import React from 'react';
import PropTypes from 'prop-types';
// import { injectIntl, intlShape } from 'react-intl';
import ReactMarkdown from 'react-markdown';

import styled from 'styled-components';
import { Box, Image } from 'grommet';

import { FOOTER } from 'themes/config';
import Container from 'components/styled/Container';
import ContentSimple from 'components/styled/ContentSimple';

const MarkdownQuote = styled(ReactMarkdown)`
  color: white;
  font-size: ${(props) => props.theme.text.xxlarge.size};
  line-height: ${(props) => props.theme.text.xxlarge.height};
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    font-size: ${(props) => props.theme.text.xxxlarge.size};
    line-height: ${(props) => props.theme.text.xxxlarge.height};
  }
  @media print {
    font-size: ${(props) => props.theme.sizes.print.large};
  }
`;
const MarkdownSource = styled(ReactMarkdown)`
  color: white;
  opacity: 0.85;
  font-size: ${(props) => props.theme.text.xsmall.size};
  line-height: ${(props) => props.theme.text.xsmall.height};
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    font-size: ${(props) => props.theme.text.small.size};
    line-height: ${(props) => props.theme.text.small.height};
  }
  @media print {
    font-size: ${(props) => props.theme.sizes.print.small};
  }
`;

const Styled = styled.div`
  color: ${({ theme }) => theme.global.colors.brand};
  background-color: #183863;
  position: relative;
  padding-bottom: 12%;
`;

const Wrap = styled.div`
  background-color: ${({ theme }) => theme.global.colors.backgroundX};
  padding-top: 10%;
`;

function QuoteSection({ quote, source }) {
  return (
    <Wrap>
      <Styled>
        <svg
          viewBox="0 0 1920 190"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          style={{
            position: 'absolute',
            bottom: '100%',
            left: 0,
            right: 0,
            width: '100%',
          }}
        >
          <path
            fill="#183863"
            d="M1920,88.05S1575.51-29.36,1205.3,6.98c-370.21,36.34-635.98,99.54-833.78,94C173.73,95.44,0,33.7,0,33.7v217.87h1920V88.05Z"
          />
        </svg>
        <Container style={{ paddingBottom: '20px' }}>
          <ContentSimple>
            <Box responsive={false} gap="xsmall">
              <MarkdownQuote source={`“${quote}”`} className="react-markdown-quote" />
              <MarkdownSource source={source} className="react-markdown-quote" />
            </Box>
          </ContentSimple>
        </Container>
        <Box
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
          }}
        >
          <Image src={FOOTER.IMAGE_URLS.home_quote} />
        </Box>
      </Styled>
    </Wrap>
  );
}

QuoteSection.propTypes = {
  quote: PropTypes.string.isRequired,
  source: PropTypes.string.isRequired,
};

// export default injectIntl(TeaserSection);
export default QuoteSection;
