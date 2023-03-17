import React from 'react';
import styled from 'styled-components';
import { Text } from 'grommet';

const TextPrint = styled((p) => <Text {...p} />)`
  @media print {
    font-size: ${({ theme, size = 'medium' }) => theme.sizes.print[size]};
    ${({ padPrint }) => padPrint && 'padding-right: 5px;'}
  }
`;

export default TextPrint;
