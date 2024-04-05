import React from 'react';
import styled from 'styled-components';
import { Button } from 'grommet';
import { usePrint } from 'containers/App/PrintContext';

/* eslint-disable react/no-multi-comp */
const Styled = styled(
  React.forwardRef((p, ref) => <Button plain {...p} ref={ref} />)
)`
  text-align: ${({ align }) => align === 'end' ? 'right' : 'left'};
  line-height: ${({ isPrint, theme, size = 'xsmallTight' }) => isPrint ? theme.textPrint[size].height : theme.text[size].height}};

  &:focus-visible {
    box-shadow: none;
    color: ${({ theme }) => theme.global.colors.highlight};
    outline: 2px solid ${({ theme }) => theme.global.colors.highlight};
    border-radius: 2px;
  }
  @media print {
    line-height: ${({ theme, size = 'xsmallTight' }) => theme.textPrint[size].height};
  }
`;

const LinkTT = React.forwardRef((props, ref) => {
  const isPrint = usePrint();
  return <Styled isPrint={isPrint} {...props} ref={ref} />;
});

export default LinkTT;
