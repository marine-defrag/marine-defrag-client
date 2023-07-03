import React from 'react';
import styled from 'styled-components';
import { Button } from 'grommet';
import { usePrint } from 'containers/App/PrintContext';

const Styled = styled((p) => <Button as="a" plain {...p} />)`
  text-align: ${({ align }) => align === 'end' ? 'right' : 'left'};
  line-height: ${({ isPrint, theme, size = 'xsmallTight' }) => isPrint ? theme.textPrint[size].height : theme.text[size].height}};
  @media print {
    line-height: ${({ theme, size = 'xsmallTight' }) => theme.textPrint[size].height};
  }
`;

export function Link(props) {
  const isPrint = usePrint();
  return <Styled isPrint={isPrint} {...props} />;
}

export default Link;
