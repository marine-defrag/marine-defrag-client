import styled from 'styled-components';

const Container = styled.div`
  margin-right: auto;
  margin-left: auto;
  max-width: 100%;
  padding-bottom: ${({ noPaddingBottom, inModal, isPrint }) => (isPrint || noPaddingBottom || inModal) ? 0 : '3em'};
  padding-left: ${({ inModal }) => inModal ? 0 : 12}px;
  padding-right: ${({ inModal }) => inModal ? 0 : 12}px;
  background-color: ${({ inModal, bg, theme }) => (inModal || bg) ? theme.global.colors.background : 'transparent'};
  margin-top: ${({ isSingle, isPrint }) => {
    if (isPrint) return 0;
    return isSingle ? 50 : 0;
  }}px;
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    padding-right: ${({ inModal, isPrint }) => (isPrint || inModal) ? 0 : 12}px;
    padding-left: ${({ inModal, isPrint }) => (isPrint || inModal) ? 0 : 12}px;
  }
  @media (min-width: ${(props) => props.theme.breakpoints.xlarge}) {
    max-width: ${(props) => props.isNarrow ? '960' : (parseInt(props.theme.breakpoints.xlarge, 10) - 30)}px;
  }
  @media print {
    max-width: 100%;
    width: 100%;
    padding: 0;
    margin: 0;
    background-color: transparent;
  }
`;
export default Container;
