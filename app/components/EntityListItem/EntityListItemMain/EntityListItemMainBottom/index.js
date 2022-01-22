import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Map } from 'immutable';
import { Box } from 'grommet';
import { palette } from 'styled-theme';

import EntityListItemMainConnections from './EntityListItemMainConnections';
import EntityListItemMainTaxonomies from './EntityListItemMainTaxonomies';

const Styled = styled((p) => <Box direction="row" gap="small" {...p} />)`
  border-top: 1px solid ${palette('light', 1)};
  padding-top: 3px;
`;

function EntityListItemMainBottom({
  connections, wrapper, categories, taxonomies, onEntityClick,
}) {
  return (
    <Styled>
      {categories && categories.size > 0 && (
        <EntityListItemMainTaxonomies
          categories={categories}
          taxonomies={taxonomies}
          onEntityClick={onEntityClick}
        />
      )}
      {connections && connections.length > 0 && (
        <EntityListItemMainConnections
          connections={connections}
          wrapper={wrapper}
        />
      )}
    </Styled>
  );
}

EntityListItemMainBottom.propTypes = {
  connections: PropTypes.array,
  wrapper: PropTypes.object,
  categories: PropTypes.instanceOf(Map), // eslint-disable-line react/no-unused-prop-types
  taxonomies: PropTypes.instanceOf(Map), // eslint-disable-line react/no-unused-prop-types
  onEntityClick: PropTypes.func,
};

export default EntityListItemMainBottom;
