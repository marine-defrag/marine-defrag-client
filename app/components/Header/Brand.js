import styled from 'styled-components';
import { palette } from 'styled-theme';

export default styled.a`
  text-decoration: none;
  color: ${palette('headerBrand', 0)};

  &:hover {
    color: ${palette('headerBrandHover', 0)};
    background-color:${palette('headerNavPagesItemHover', 3)};
  }

  z-index: 110;
  overflow: hidden;

  height: ${(props) => props.theme.sizes.header.banner.heightMobile}px;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    height: ${(props) => props.theme.sizes.header.banner.height}px;
  }
`;
