import React from 'react';
import styled, { css } from 'styled-components';
import { usePrint } from 'containers/App/PrintContext';
import { Box } from 'grommet';

const Styled = styled((p) => <Box margin={{ horizontal: 'medium' }} {...p} />)`
  ${({ isPrint }) => isPrint && css`margin-left: 0;`}
  ${({ isPrint }) => isPrint && css`margin-right: 0;`}
  position: relative;
  background: ${({ nobg }) => nobg ? 'transparent' : '#F9F9FA'};
  overflow: hidden;
  padding-top: ${({ isPrint, orient }) => (isPrint && orient) === 'landscape' ? '50%' : '56.25%'};
  border: 1px solid #f6f7f9;

  @media print {
    margin-left: 0;
    margin-right: 0;
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
