import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Box } from 'grommet';

import qe from 'utils/quasi-equals';
import appMessages from 'containers/App/messages';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import ButtonDefault from 'components/buttons/ButtonDefault';
import messages from './messages';

const ButtonWrapper = styled((p) => (
  <Box direction="row" justify="start" wrap gap="small" {...p} />
))`
  overflow-x: auto;
`;
const HighlightCategoryLabel = styled.span`
font-size:12px;
color: #a9abad;
`;
const Styled = styled.div``;
const TaxonomyGroup = styled.div``;

const EntitiesCategories = ({
  taxonomiesWithCats,
  onSetCategory,
  onResetCategory,
  highlightCategory,
  intl,
}) => (
  <Styled>
    {taxonomiesWithCats.map((taxonomy) => (
      <TaxonomyGroup key={taxonomy.id}>
        <HighlightCategoryLabel>
          <FormattedMessage
            {...messages.highlightCategory}
            values={{
              categoryName: intl.formatMessage(appMessages.entities.taxonomies[taxonomy.id].plural),
            }}
          />
        </HighlightCategoryLabel>
        <ButtonWrapper>
          {taxonomy.categories.map((category) => {
            const { id, label } = category;
            return (
              <ButtonDefault
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
                {label}
              </ButtonDefault>
            );
          })}
        </ButtonWrapper>
      </TaxonomyGroup>
    ))}
  </Styled>
);


EntitiesCategories.propTypes = {
  taxonomiesWithCats: PropTypes.array,
  highlightCategory: PropTypes.string,
  onSetCategory: PropTypes.func,
  onResetCategory: PropTypes.func,
  intl: intlShape.isRequired,
};

export default injectIntl(EntitiesCategories);
