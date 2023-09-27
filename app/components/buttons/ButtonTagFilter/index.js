import styled from 'styled-components';
import { palette } from 'styled-theme';

import Button from '../Button';

const ButtonTagFilter = styled(Button)`
  color: ${({ isPrint }) => isPrint ? 'black' : palette('text', 2)};
  background-color: ${(props) => props.isPrint ? 'white' : palette(props.palette, props.pIndex || 0)};
  padding: 1px 6px;
  margin-right: 2px;
  border-radius: 3px;
  font-size: 0.85em;
  border: 1px solid ${(props) => props.isPrint ? 'black' : palette(props.palette, props.pIndex || 0)};
  &:hover {
    color: ${palette('text', 2)};
    background-color: ${(props) => palette(props.disabled ? props.paletteHover : props.palette, props.pIndex || 0)};
  }
  @media (min-width: ${({ theme }) => theme.breakpoints.medium}) {
    padding: 1px 6px;
    font-size: 0.85em;
  }
  @media print {
    color: black;
    background: transparent;
    border-radius: 3px;
    border: 1px solid;
    border-color: black;
    padding: 0 4px;
    font-size: ${({ theme }) => theme.sizes.print.smallest};
    line-height: 10pt;
    &:hover {
      color: ${palette('text', 1)};
      background: transparent;
    }
  }
`;

export default ButtonTagFilter;
