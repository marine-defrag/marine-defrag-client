import styled from 'styled-components';

const Status = styled.div`
  font-weight: bold;
  text-transform: uppercase;
  color: ${({ type, theme }) => {
    if (type === 'warning') {
      return theme.global.colors.warning;
    }
    return theme.global.colors.text.light;
  }};
`;
export default Status;
