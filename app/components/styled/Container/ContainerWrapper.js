import styled from 'styled-components';

const ContainerWrapper = styled.div`
  position: ${({ isStatic, isPrint }) => (isPrint || isStatic) ? 'static' : 'absolute'};
  top: ${({ headerStyle, theme }) => {
    if (headerStyle === 'types') {
      return theme.sizes.headerList.banner.height;
    }
    return 0;
  }}px;
  bottom: ${({ isPrint }) => isPrint ? 'auto' : 0};
  left: 0;
  right: 0;
  overflow-x: hidden;
  overflow-y: ${({ noOverflow }) => noOverflow ? 'hidden' : 'auto'};
  z-index: 90;
  background-color: ${({ bg, isPrint }) => (bg && !isPrint) ? '#f1f0f1' : 'transparent'};
  @media print {
    box-shadow: none;
    position: ${({ printAbsolute }) => printAbsolute ? 'absolute' : 'static'};
    background-color: transparent;
    padding: 0;
  }
`;
export default ContainerWrapper;
// box-shadow: ${({ isPrint }) => isPrint ? '0px 0px 5px 0px rgb(0 0 0 / 50%)' : 'none'};
