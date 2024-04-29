
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { palette } from 'styled-theme';

import ButtonClose from 'components/buttons/ButtonClose';
import Keyboard from 'containers/Keyboard';
import { Box } from 'grommet';

import appMessages from 'containers/App/messages';
import { setFocusById } from 'utils/accessibility';

const StyledBox = styled((p) => <Box {...p} />)`
  background: white;
  margin: auto;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  &:focus-visible { 
    outline: 2px solid ${palette('primary', 0)};
    outline-offset: 0px;
    border-radius: 3px;
  }
`;
const DisableVisOverlay = styled.div`
  width: 100%;
  height: 100%;
  z-index: 102;
  background-color: rgba(0,0,0,0.2);
  position: absolute;
  @media (min-width: ${({ theme }) => theme.breakpoints.large}) {
    z-index: 99;
  }
`;

const DisableView = ({ onEsc, onEnter }) => {
  // on component load, give focus
  useEffect(() => {
    setFocusById('screen-reader-overlay');
  }, []);

  return (
    <DisableVisOverlay>
      <Keyboard
        onEnter={onEnter}
        onEsc={onEsc}
      >
        <StyledBox
          pad="medium"
          gap="small"
          width="medium"
          tabIndex={0}
          id="screen-reader-overlay"
        >
          <ButtonClose
            onClose={onEsc}
          />
          <FormattedMessage {...appMessages.screenreader.disabledMapView} />
        </StyledBox>
      </Keyboard>
    </DisableVisOverlay>
  );
};

DisableView.propTypes = {
  onEsc: PropTypes.func,
  onEnter: PropTypes.func,
};
export default DisableView;
