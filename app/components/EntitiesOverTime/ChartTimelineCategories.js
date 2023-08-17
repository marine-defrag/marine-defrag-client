import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Box, Text } from 'grommet';

import qe from 'utils/quasi-equals';
import { lowerCase } from 'utils/string';
import appMessages from 'containers/App/messages';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';

import ButtonDefault from 'components/buttons/ButtonDefault';
import messages from './messages';

const Styled = styled.div``;

const ButtonWrapper = styled((p) => (
  <Box direction="row" justify="start" wrap gap="xxsmall" {...p} />
))``;

const TaxonomyGroup = styled((p) => <Box margin={{ vertical: 'medium' }} gap="xsmall" {...p} />)``;

const TaxonomyGroupLabel = styled((p) => <Text size="xsmall" {...p} />)`
margin-bottom: 3px;
`;

const CategoryButton = styled((p) => <ButtonDefault {...p} />)`
  margin-bottom: 4px;
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
  intl,
}) => (
  <Styled>
    {taxonomiesWithCats.map((taxonomy) => (
      <TaxonomyGroup key={taxonomy.id}>
        <TaxonomyGroupLabel>
          <FormattedMessage
            {...messages.highlightCategory}
            values={{
              categoryName: lowerCase(intl.formatMessage(appMessages.entities.taxonomies[taxonomy.id].single)),
            }}
          />
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
  intl: intlShape,
};

export default injectIntl(ChartTimelineCategories);
