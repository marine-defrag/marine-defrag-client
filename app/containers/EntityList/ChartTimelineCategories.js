import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Box, Text } from 'grommet';

import qe from 'utils/quasi-equals';
import appMessages from 'containers/App/messages';
import { FormattedMessage } from 'react-intl';

import ButtonDefault from 'components/buttons/ButtonDefault';

const ButtonWrapper = styled((p) => (
  <Box direction="row" justify="start" wrap gap="xxsmall" {...p} />
))`
  overflow-x: auto;
`;
const Styled = styled.div``;
const TaxonomyGroupLabel = styled((p) => <Text size="small" {...p} />)`
  margin-bottom: 3px;
`;
const TaxonomyGroup = styled((p) => <Box margin={{ vertical: 'small' }} {...p} />)``;

const CategoryButton = styled((p) => <ButtonDefault {...p} />)`
  margin-bottom: 3px;
  padding: 0.2em 0.5em;
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    padding: 0.3em 0.8em;
  }
`;
const CategoryButtonLabel = styled((p) => <Text size="small" {...p} />)``;

const ChartTimelineCategories = ({
  taxonomiesWithCats,
  onSetCategory,
  onResetCategory,
  highlightCategory,
}) => (
  <Styled>
    {taxonomiesWithCats.map((taxonomy) => (
      <TaxonomyGroup key={taxonomy.id}>
        <TaxonomyGroupLabel>
          <FormattedMessage {...appMessages.entities.taxonomies[taxonomy.id].plural} />
        </TaxonomyGroupLabel>
        <ButtonWrapper>
          {taxonomy.categories.map((category) => {
            const { id, label } = category;
            return (
              <CategoryButton
                key={id}
                inactive={!qe(highlightCategory, id)}
                alt={label}
                onClick={() => {
                  if (qe(highlightCategory, id)) {
                    onResetCategory();
                  } else {
                    onSetCategory(id);
                  }
                }}
              >
                <CategoryButtonLabel>{label}</CategoryButtonLabel>
              </CategoryButton>
            );
          })}
        </ButtonWrapper>
      </TaxonomyGroup>
    ))}
  </Styled>
);


ChartTimelineCategories.propTypes = {
  taxonomiesWithCats: PropTypes.array,
  highlightCategory: PropTypes.string,
  onSetCategory: PropTypes.func,
  onResetCategory: PropTypes.func,
};

export default ChartTimelineCategories;
