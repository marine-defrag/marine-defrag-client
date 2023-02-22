import React from 'react';
import styled from 'styled-components';
import { Text } from 'grommet';

const TextPrint = styled((p) => <Text {...p} />)`
  @media print {
    font-size: 10pt;
    ${({ padPrint }) => padPrint && 'padding-right: 5px;'}
  }
`;

export default TextPrint;
