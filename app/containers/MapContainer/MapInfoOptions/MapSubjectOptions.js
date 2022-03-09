import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Box, Text, Button } from 'grommet';

// import ButtonFactory from 'components/buttons/ButtonFactory';

const Styled = styled.div`
  padding-bottom: 10px;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    padding-bottom: 15px;
  }
`;
const TypeButton = styled((p) => <Button plain {...p} />)`
  padding: 2px 4px;
  border-bottom: 2px solid;
  border-bottom-color: ${({ active }) => active ? 'brand' : 'transparent'};
  background: none;
`;

class MapSubjectOptions extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { options } = this.props;
    return (
      <Styled>
        {options && (
          <Box direction="row" gap="small">
            {
              options.map((option, i) => option && (
                <Box key={i}>
                  <TypeButton active={option.active} onClick={option.onClick}>
                    <Text size="large">
                      {option.title}
                    </Text>
                  </TypeButton>
                </Box>
              ))
            }
          </Box>
        )}
      </Styled>
    );
  }
}

MapSubjectOptions.propTypes = {
  options: PropTypes.array,
};

export default MapSubjectOptions;
