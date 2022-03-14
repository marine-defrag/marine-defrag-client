import styled from 'styled-components';

export default styled.div`
  display: none;
  padding: 2px 5px 0 0;
  font-family: ${(props) => props.theme.fonts.claim};
  font-size: ${(props) => props.theme.sizes.header.text.claim};
  background-color: transparent;
  line-height: 1.1;
  color: white;
  font-weight: 500;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    display: block;
    width: 60px;
  }
  @media print {
    background: transparent;
    font-size: ${(props) => props.theme.sizes.header.print.claim};
    padding: 0;
  }
`;
