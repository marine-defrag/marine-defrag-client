import styled from 'styled-components';
import { palette } from 'styled-theme';

import Section from './Section';

const Main = styled(Section)`
  border-color: ${palette('light', 1)};
  border-width: 1px;
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    border-right-style: ${(props) => props.hasAside ? 'solid' : 'none'};
    display: table-cell;
    width: ${(props) => props.hasAside ? '70%' : '100%'};
  }
  @media print {
    display: ${({ hasAside }) => hasAside ? 'table-cell' : 'block'};
    width: ${({ hasAside }) => hasAside ? '70%' : '100%'};
    border-right-style: ${(props) => props.hasAside ? 'solid' : 'none'};
  }
`;

export default Main;
