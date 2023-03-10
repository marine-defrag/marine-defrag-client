import styled from 'styled-components';

const PrintHide = styled.div`
  display: ${({ isPrint, displayProp }) => isPrint ? 'none !important' : (displayProp || 'block')};
  @media print {
    display: none !important;
  }
`;

export default PrintHide;
