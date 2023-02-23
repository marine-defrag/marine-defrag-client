import styled from 'styled-components';

const Field = styled.div`
  display: ${({ nested }) => nested ? 'inline-block' : 'block'};
  padding-bottom: ${({ nested, noPadding, labelledGroup }) => {
    if (nested || noPadding) {
      return 0;
    }
    if (labelledGroup) {
      return 7;
    }
    return 15;
  }}px;
  @media (min-width: ${({ theme }) => theme.breakpoints.medium}) {
    padding-bottom: ${({ nested, noPadding, labelledGroup }) => {
    if (nested || noPadding) {
      return 0;
    }
    if (labelledGroup) {
      return 15;
    }
    return 30;
  }}px;
  }
  @media print {
    display: ${({ nested, printHide }) => {
    if (printHide) return 'none !important';
    return nested ? 'inline-block' : 'block';
  }};
  }
`;

export default Field;
