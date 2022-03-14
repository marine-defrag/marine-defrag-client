import React from 'react';
import styled from 'styled-components';
import { Heading } from 'grommet';

export default styled((p) => <Heading level={1} {...p} />)`
  margin: 0;
  padding-left: 10px;
  font-family: ${(props) => props.theme.fonts.title};
  font-size: ${(props) => props.theme.sizes.header.text.titleMobile};
  font-weight: 500;
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    padding: 0;
    font-size: ${(props) => props.theme.sizes.header.text.title};
    line-height: ${(props) => props.theme.sizes.header.text.title};
  }
  @media print {
    font-size: ${(props) => props.theme.sizes.header.print.title};
  }
`;
