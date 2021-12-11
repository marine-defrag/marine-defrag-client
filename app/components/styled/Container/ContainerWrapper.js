import styled from 'styled-components';

const ContainerWrapper = styled.div`
position: ${({ isStatic }) => isStatic ? 'static' : 'absolute'};
top: ${({ hasHeader, theme }) => hasHeader ? theme.sizes.headerList.banner.height : 0}px;
bottom: 0;
left: 0;
right: 0;
overflow-y: auto;
@media print {
  position: static;
}
`;
export default ContainerWrapper;
