import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
// import { FormattedMessage, intlShape, injectIntl } from 'react-intl';

import Gradient from './Gradient';

const Title = styled.div`
  margin-bottom: 15px;
  font-weight: 600;
`;
const Styled = styled.div`
  position: absolute;
  left: 10px;
  bottom: 50px;
  background: white;
  width: 300px;
  z-index: 50;
  box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.2);
  padding: 15px 20px 30px;
`;

export function Key({ config }) {
  return (
    <Styled>
      {config.title && (
        <Title>
          {config.title}
        </Title>
      )}
      <Gradient config={config} />
    </Styled>
  );
}

Key.propTypes = {
  config: PropTypes.object,
};

export default Key;
