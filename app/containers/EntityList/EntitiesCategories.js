import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Box } from 'grommet';

// import { injectIntl, intlShape } from 'react-intl';
import qe from 'utils/quasi-equals';

import ButtonDefault from 'components/buttons/ButtonDefault';

const { Map } = require('immutable');
// import appMessages from 'containers/App/messages';

const ButtonWrapperInner = styled((p) => (
  <Box direction="row" justify="start" wrap gap="small" {...p} />
))`
  overflow-x: auto;
`;
const Styled = styled.div``;
const StyledText = styled.span``;
const TaxonomyGroup = styled.div``;

export function EntitiesCategories({
  taxonomiesWithCats,
  onSetCategory,
  onResetCategory,
  highlightCategory,
}) {
  return (
    <Styled>
      {taxonomiesWithCats.toList().toJS().map((taxonomy) => {
        const { categories } = taxonomy;
        // const groupLabel = intl.formatMessage(appMessages[taxonomy.type][taxonomy.id]);
        const groupLabel = taxonomy.id;
        return (
          <TaxonomyGroup>
            <StyledText>{groupLabel}</StyledText>
            <ButtonWrapperInner>
              {Object.keys(categories).map((categoryID) => {
                const label = categories[categoryID].attributes.title;
                return (
                  <ButtonDefault
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
        );
      })}
    </Styled>
  );
}

EntitiesCategories.propTypes = {
  taxonomiesWithCats: PropTypes.instanceOf(Map),
  highlightCategory: PropTypes.string,
  onSetCategory: PropTypes.func,
  onResetCategory: PropTypes.func,
  // intl: intlShape,
};

export default EntitiesCategories;
