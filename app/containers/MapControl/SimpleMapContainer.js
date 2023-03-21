import React from 'react';
import styled, { css } from 'styled-components';
import { usePrint } from 'containers/App/PrintContext';
import { Box } from 'grommet';

const Styled = styled((p) => <Box margin={{ horizontal: 'medium' }} {...p} />)`
  ${({ isPrint }) => isPrint && css`margin-left: 0;`}
  position: relative;
  background: #F9F9FA;
  overflow: hidden;
  padding-top: ${({ isPrint, orient }) => (isPrint && orient) === 'landscape' ? '50%' : '56.25%'};
  @media print {
    margin-left: 0;
    display: block;
    page-break-inside: avoid;
    break-inside: avoid;
  }
`;

export function MapContainer(props) {
  const isPrint = usePrint();
  return <Styled isPrint={isPrint} {...props} />;
}

export default MapContainer;
