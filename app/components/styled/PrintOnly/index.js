import styled from 'styled-components';

const PrintOnly = styled.div`
  display: ${({ isPrint, displayProp }) => isPrint ? (displayProp || 'block') : 'none'};
  @media print {
    display: ${({ displayProp }) => displayProp || 'block'};
  }
`;

export default PrintOnly;
