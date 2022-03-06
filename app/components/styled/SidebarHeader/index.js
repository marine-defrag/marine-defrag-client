import styled from 'styled-components';
import { palette } from 'styled-theme';

import { SHOW_SIDEBAR_HEADER_PATTERN } from 'themes/config';

export default styled.div`
  min-height: ${(props) => (props.taxonomies || props.hasButtons) ? 0 : props.theme.sizes.aside.header.height}px;
  background-image: ${(props) => (SHOW_SIDEBAR_HEADER_PATTERN && props.theme.backgroundImages.asideHeader)
    ? props.theme.backgroundImages.asideHeader
    : 'none'
};
  background-repeat: repeat;
  padding: 1em 12px;
  background-color: ${palette('asideHeader', 0)};

  @media (min-width: ${(props) => props.theme.breakpoints.large}) {
    min-height:${(props) => props.taxonomies ? 0 : props.theme.sizes.aside.header.height}px;
    padding: 1em 16px;
`;
