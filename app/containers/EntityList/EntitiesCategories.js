import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Box } from 'grommet';

import qe from 'utils/quasi-equals';

import ButtonDefault from 'components/buttons/ButtonDefault';

const ButtonWrapperInner = styled((p) => (
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
      <TaxonomyGroup>
        <StyledText>{taxonomy.label}</StyledText>
        <ButtonWrapperInner>
          {taxonomy.categories.map((category) => {
            const categoryID = category.id;
            const { label } = category;
            return (
              <ButtonDefault
                key={categoryID}
                inactive={!qe(highlightCategory, categoryID)}
                alt={label}
                onClick={() => {
                  if (qe(highlightCategory, categoryID)) {
                    onResetCategory();
                  } else {
                    onSetCategory(categoryID);
                  }
                }}
              >
                {label}
              </ButtonDefault>
            );
          })}
        </ButtonWrapperInner>
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
