import React from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import styled from 'styled-components';
import { Box } from 'grommet';

import ButtonTagCategory from 'components/buttons/ButtonTagCategory';
import ButtonTagCategoryInverse from 'components/buttons/ButtonTagCategoryInverse';

import { truncateText } from 'utils/string';
import { TEXT_TRUNCATE } from 'themes/config';

const Styled = styled((p) => <Box direction="row" gap="hair" {...p} />)``;
// border-top-color:;

class EntityListItemMainTaxonomies extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  getEntityTags = (categories, taxonomies, onClick) => {
    const tags = [];
    if (categories) {
      taxonomies
        .filter((tax) => !tax.getIn(['attributes', 'is_smart']))
        .forEach((tax) => {
          tax
            .get('categories')
            .sortBy((category) => category.getIn(['attributes', 'draft']))
            .forEach((category, catId) => {
              if (categories.includes(parseInt(catId, 10))) {
                const label = (category.getIn(['attributes', 'short_title']) && category.getIn(['attributes', 'short_title']).trim().length > 0
                  ? category.getIn(['attributes', 'short_title'])
                  : category.getIn(['attributes', 'title']));
                tags.push({
                  taxId: tax.get('id'),
                  title: category.getIn(['attributes', 'title']),
                  label: truncateText(label, TEXT_TRUNCATE.ENTITY_TAG, categories.size < 5),
                  onClick: () => onClick(catId, 'category'),
                });
              }
            });
        });
    }
    return tags;
  };

  render() {
    const { categories, taxonomies, onEntityClick } = this.props;
    const entityTags = this.getEntityTags(categories, taxonomies, onEntityClick);

    return (
      <Styled>
        { entityTags.map((tag, i) => tag.inverse
          ? (
            <ButtonTagCategoryInverse
              key={i}
              onClick={tag.onClick}
              taxId={parseInt(tag.taxId, 10)}
              disabled={!tag.onClick}
              title={tag.title}
            >
              {tag.label}
            </ButtonTagCategoryInverse>
          )
          : (
            <ButtonTagCategory
              key={i}
              onClick={tag.onClick}
              taxId={parseInt(tag.taxId, 10)}
              disabled={!tag.onClick}
              title={tag.title}
            >
              {tag.label}
            </ButtonTagCategory>
          ))}
      </Styled>
    );
  }
}

EntityListItemMainTaxonomies.propTypes = {
  categories: PropTypes.instanceOf(Map), // eslint-disable-line react/no-unused-prop-types
  taxonomies: PropTypes.instanceOf(Map), // eslint-disable-line react/no-unused-prop-types
  onEntityClick: PropTypes.func,
};

EntityListItemMainTaxonomies.contextTypes = {
  intl: PropTypes.object,
};

export default EntityListItemMainTaxonomies;
