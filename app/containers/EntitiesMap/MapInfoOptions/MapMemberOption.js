import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { CheckBox } from 'grommet';

const Styled = styled.div`
  padding: 5px 0;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    padding: 10px 0;
  }
`;

export function MapMemberOption({ option }) {
  const { active, onClick, label } = option;
  return (
    <Styled>
      <CheckBox
        checked={active}
        label={label}
        onChange={onClick}
      />
    </Styled>
  );
}

MapMemberOption.propTypes = {
  option: PropTypes.object,
};

export default MapMemberOption;
