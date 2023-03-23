import React from 'react';
import styled from 'styled-components';
import { usePrint } from 'containers/App/PrintContext';
import TextPrint from 'components/styled/TextPrint';

const Styled = styled((p) => <TextPrint size="xsmall" wordBreak="keep-all" {...p} />)`
  text-align: ${({ align }) => align === 'end' ? 'right' : 'left'};
`;


export function Label(props) {
  const isPrint = usePrint();
  return <Styled isPrint={isPrint} {...props} />;
}

export default Label;
