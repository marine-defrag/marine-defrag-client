import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
// import ReactMarkdown from 'react-markdown';
import { Map, OrderedMap } from 'immutable';

// import styled, { withTheme } from 'styled-components';
// import { Box, ResponsiveContext } from 'grommet';
//
// import { isMinSize } from 'utils/responsive';
//
// import Container from 'components/styled/Container';
// import ContentSimple from 'components/styled/ContentSimple';
// import ButtonHero from 'components/buttons/ButtonHero';
//
// import Loading from 'components/Loading';

function TeaserSection({
  title,
  teaser,
  type,
  cards,
  intl,
}) {
  console.log('title', title);
  console.log('teaser', teaser);
  console.log('type', type);
  console.log('cards', cards && cards.toJS());
  return intl && (
    <div>
      <h3>
        {title}
      </h3>
      <p>
        {teaser}
      </p>
    </div>
  );
}

TeaserSection.propTypes = {
  title: PropTypes.string,
  teaser: PropTypes.string,
  type: PropTypes.string,
  cards: PropTypes.oneOfType([
    PropTypes.instanceOf(OrderedMap),
    PropTypes.instanceOf(Map),
  ]),
  intl: intlShape,
};

export default injectIntl(TeaserSection);
