import React from 'react';
import PropTypes from 'prop-types';
import { Box, Text } from 'grommet';

export function CellBodyPlain({
  entity,
  column = {},
}) {
  const { align = 'start' } = column;
  return (
    <Box>
      <Text size="xsmall" weight={500} wordBreak="keep-all" textAlign={align}>
        {entity.value}
      </Text>
    </Box>
  );
}

CellBodyPlain.propTypes = {
  entity: PropTypes.object,
  column: PropTypes.object,
};

export default CellBodyPlain;
