import React from 'react';
import PropTypes from 'prop-types';
import { Box } from 'grommet';
import TextPrint from 'components/styled/TextPrint';

export function CellBodyPlain({
  entity,
  column = {},
}) {
  const { align = 'start', primary } = column;
  return (
    <Box>
      <TextPrint
        size="xsmallTight"
        weight={primary ? 500 : 300}
        wordBreak="keep-all"
        textAlign={align}
      >
        {entity.value}
      </TextPrint>
    </Box>
  );
}

CellBodyPlain.propTypes = {
  entity: PropTypes.object,
  column: PropTypes.object,
};

export default CellBodyPlain;
