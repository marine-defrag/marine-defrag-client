import styled from 'styled-components';

export default styled.a`
  text-decoration: none;
  color: white;
  &:hover {
    color: white;
    opacity: ${({ isPrint }) => isPrint ? 1 : 0.9};
  }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.global.colors.highlight};
    outline-offset: 0px;
    border-radius: 1px;
  }
  @media print {
    color: ${({ theme }) => theme.global.colors.text.brand} !important;
  }
  z-index: 110;
  overflow: hidden;

  height: ${(props) => props.theme.sizes.header.banner.heightMobile}px;
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    height: ${(props) => props.theme.sizes.header.banner.height}px;
  }
`;
