import styled from 'styled-components';
import { palette } from 'styled-theme';

import { TextInput } from 'grommet';

export default styled(TextInput)`
  font-weight: 600;
  font-size: ${({ theme }) => theme.text.small.size};

  background-color: ${palette('light', 1)};
  color: ${palette('dark', 2)};

  &::placeholder {
    color: ${({ theme }) => theme.global.colors.dark};
    font-weight: 400;
    opacity: 0.8;
  }
  @media (min-width: ${({ theme }) => theme.breakpoints.medium}) {
    font-size: ${({ theme }) => theme.text.medium.size};
  }
`;
