import styled from 'styled-components';

const ContentSimple = styled.div`
  @media (min-width: ${(props) => props.theme.breakpoints.large}) {
    padding: 0 16px;
  }
  @media (min-width: ${(props) => props.theme.breakpoints.xlarge}) {
    padding: 0 32px;
  }
  @media print {
    padding: 0;
  }
`;
export default ContentSimple;
