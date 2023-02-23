import styled from 'styled-components';

const FieldGroupWrapper = styled.div`
  background-color: transparent;
  border-bottom: ${(props) => props.groupType === 'smartTaxonomy' ? '1px solid' : 0};
  border-bottom-color: ${({ theme }) => theme.global.colors.background};
  padding-top: ${({ theme }) => theme.global.edgeSize.small};
  padding-right: ${({ theme }) => theme.global.edgeSize.small};
  padding-left: ${({ seamless, theme }) => seamless ? 0 : theme.global.edgeSize.small};
  padding-bottom: ${({ seamless, theme }) => seamless ? '10px' : theme.global.edgeSize.small};
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    padding-top: ${({ theme }) => theme.global.edgeSize.medium};
    padding-right: ${({ theme }) => theme.global.edgeSize.medium};
    padding-left: ${({ seamless, theme }) => seamless ? 0 : theme.global.edgeSize.medium};
    padding-bottom: ${({ seamless, theme }) => seamless ? '20px' : theme.global.edgeSize.medium};
  }
  @media print {
    padding: ${({ aside }) => (aside) ? '15px 0 10px 20px' : '15px 20px 10px 0'};
    background-color: transparent;
  }
`;

export default FieldGroupWrapper;
