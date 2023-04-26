import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Box, Text } from 'grommet';
import {
  Add, Edit, Multiple,
} from 'grommet-icons';

const StyledText = styled((p) => <Text color="dark-3" size="small" {...p} />)`
  position: relative;
  top: 1px;
`;

function ButtonOptionsLabelWithIcon({ icon, title }) {
  return (
    <Box direction="row" gap="small" align="center">
      <Box>
        {icon === 'edit' && (
          <Edit color="dark-3" size="xxsmall" />
        )}
        {icon === 'add' && (
          <Add color="dark-3" size="xxsmall" />
        )}
        {icon === 'import' && (
          <Multiple color="dark-3" size="xxsmall" />
        )}
      </Box>
      <Box>
        <StyledText>{title}</StyledText>
      </Box>
    </Box>
  );
}

ButtonOptionsLabelWithIcon.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.string,
};

export default ButtonOptionsLabelWithIcon;
