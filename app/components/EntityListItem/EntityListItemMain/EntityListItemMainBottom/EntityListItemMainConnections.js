import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import { Box } from 'grommet';

import ConnectionPopup from './ConnectionPopup';

const ConnectionGroupLabel = styled.span`
  color: ${palette('text', 1)};
  font-size: ${(props) => props.theme.sizes && props.theme.sizes.text.smaller};
  padding-top: 2px;
  @media print {
    font-size: ${(props) => props.theme.sizes.print.smaller};
  }
`;
const Styled = styled((p) => <Box direction="row" wrap gap="medium" {...p} />)``;

export function EntityListItemMainConnections({ connections, wrapper }) {
  return (
    <Styled>
      {connections.map((connection, i) => (
        <Box direction="row" gap="hair" key={i}>
          <ConnectionGroupLabel>
            {`${connection.groupLabel}: `}
          </ConnectionGroupLabel>
          <Box direction="row" gap="xsmall">
            {connection.connectionsByType.map((type, j) => {
              const entitiesTotal = type.entities ? type.entities.length : 0;
              return entitiesTotal > 0 && (
                <ConnectionPopup
                  key={j}
                  entities={type.entities}
                  label={type.option.label(entitiesTotal)}
                  option={type.option}
                  wrapper={wrapper}
                  draft
                />
              );
            })}
          </Box>
        </Box>
      ))}
    </Styled>
  );
}

EntityListItemMainConnections.propTypes = {
  connections: PropTypes.array.isRequired,
  wrapper: PropTypes.object,
};

export default EntityListItemMainConnections;
