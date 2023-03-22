import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import { Box, Text } from 'grommet';
import ButtonPill from 'components/buttons/ButtonPill';
import qe from 'utils/quasi-equals';
import appMessages from 'containers/App/messages';

const Styled = styled((p) => (
  <Box
    direction="row"
    gap="xxsmall"
    margin={{ top: 'small', horizontal: 'medium', bottom: 'medium' }}
    wrap
    {...p}
  />
))``;
const TypeButton = styled((p) => <ButtonPill {...p} />)`
  margin-bottom: 5px;
`;

export function TypeSelectBox({
  options,
  onSelectType,
  activeOptionId,
  type,
}) {
  return (
    <Styled>
      {options.map(
        (id) => (
          <TypeButton
            key={id}
            onClick={() => onSelectType(id)}
            active={qe(activeOptionId, id) || options.size === 1}
            listItems={options.size}
          >
            <Text size="small">
              {options.size > 4 && (
                <FormattedMessage {...appMessages.entities[`${type}_${id}`].pluralShort} />
              )}
              {options.size <= 4 && (
                <FormattedMessage {...appMessages.entities[`${type}_${id}`].plural} />
              )}
            </Text>
          </TypeButton>
        )
      )}
    </Styled>
  );
}

TypeSelectBox.propTypes = {
  // id: PropTypes.string,
  options: PropTypes.object, // OrderedSet
  onSelectType: PropTypes.func,
  activeOptionId: PropTypes.string,
  type: PropTypes.string,
};

export default TypeSelectBox;
