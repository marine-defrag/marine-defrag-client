import styled from 'styled-components';

export default styled.a`
  text-decoration: none;
  color: white;
  z-index: 110;
  overflow: hidden;
  height: ${(props) => props.theme.sizes.header.banner.heightMobile}px;

  &:hover {
    color: white;
    opacity: ${({ isPrint }) => isPrint ? 1 : 0.9};
  }
  &:focus-visible {
    outline-color: transparent;
    border-color: none;
    box-shadow: none;
    background-color:${({ theme }) => theme.global.colors.highlightHover};
    outline-offset: 0;
  }
  @media print {
    color: ${({ theme }) => theme.global.colors.text.brand} !important;
  }
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    height: ${(props) => props.theme.sizes.header.banner.height}px;
  }
`;
