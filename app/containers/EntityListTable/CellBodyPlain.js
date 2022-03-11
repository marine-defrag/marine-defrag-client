import React from 'react';
import PropTypes from 'prop-types';
import { Box, Text } from 'grommet';

export function CellBodyPlain({
  entity,
  align = 'start',
}) {
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
  align: PropTypes.string,
};

export default CellBodyPlain;
