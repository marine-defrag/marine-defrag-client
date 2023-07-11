import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Box } from 'grommet';

import qe from 'utils/quasi-equals';

import ButtonDefault from 'components/buttons/ButtonDefault';

const ButtonWrapper = styled((p) => (
  <Box direction="row" justify="start" wrap gap="small" {...p} />
))`
  overflow-x: auto;
`;
const Styled = styled.div``;
const StyledText = styled.span``;
const TaxonomyGroup = styled.div``;

const EntitiesCategories = ({
  taxonomiesWithCats,
  onSetCategory,
  onResetCategory,
  highlightCategory,
}) => (
  <Styled>
    {taxonomiesWithCats.map((taxonomy) => (
      <TaxonomyGroup key={taxonomy.id}>
        <StyledText>{taxonomy.label}</StyledText>
        <ButtonWrapper>
          {taxonomy.categories.map((category) => {
            const { label, id } = category;
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
};

export default EntitiesCategories;
