
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Box } from 'grommet';

import Button from 'components/buttons/Button';

const Styled = styled.div`
  position: absolute;
  right: 0px;
  bottom: 0px;
`;

const ViewLinkButton = styled(Button)`
  padding: 0;
  color: #777b7e;
  &:hover {
    color: ${({ theme }) => theme.global.colors.highlight};
  }
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    padding: 0;
  }
`;
const BottomButtons = ({ primary, viewLinks }) => {
  if (!viewLinks || viewLinks.length === 0) {
    return null;
  }
  return (
    <Styled isPrimary={primary}>
      <Box direction="row" align="center" gap="xsmall" margin={{ bottom: 'xsmall', right: '15px' }}>
        {viewLinks.map((viewLink) => (
          <ViewLinkButton key={viewLink.key} onClick={() => viewLink.onClick()}>
            {viewLink.icon}
          </ViewLinkButton>
        ))}
      </Box>
    </Styled>
  );
};

BottomButtons.propTypes = {
  primary: PropTypes.bool,
  viewLinks: PropTypes.array,
};

export default BottomButtons;
