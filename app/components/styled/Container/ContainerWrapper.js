import styled from 'styled-components';

const ContainerWrapper = styled.div`
  position: ${({ isStatic }) => isStatic ? 'static' : 'absolute'};
  top: ${({ headerStyle, theme }) => {
    if (headerStyle === 'types') {
      return theme.sizes.headerList.banner.height;
    }
    return 0;
  }}px;
  bottom: 0;
  left: 0;
  right: 0;
  overflow-x: hidden;
  overflow-y: ${({ noOverflow }) => noOverflow ? 'hidden' : 'auto'};
  z-index: 90;
  background-color: ${({ bg }) => bg ? '#f1f0f1' : 'transparent'};
  @media print {
    position: ${({ printAbsolute }) => printAbsolute ? 'absolute' : 'static'};
    background-color: transparent;
  }
`;
export default ContainerWrapper;
