import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FormattedDate, FormattedMessage } from 'react-intl';
import { Box, Text, Button } from 'grommet';
import { FormNext, FormClose } from 'grommet-icons';
import { ROUTES } from 'themes/config';

import PrintHide from 'components/styled/PrintHide';

import messages from './messages';

const Styled = styled(Box)`
  position: relative;
`;
const PlotHintMetaLabel = styled((p) => <Text size="xxsmall" {...p} />)`
  color: ${({ theme }) => theme.global.colors.textSecondary};
`;

const PlotHintTitleLabel = styled((p) => <Text size="small" {...p} />)``;
const ButtonWrap = styled((p) => <Box align="end" margin={{ top: 'xsmall' }} {...p} />)``;
const ActionButton = styled((p) => <Button {...p} />)`
  font-weight: 500;
  font-size: 13px;
  stroke: ${({ theme }) => theme.global.colors.a};
  &:hover {
    stroke: ${({ theme }) => theme.global.colors.aHover};
  }
`;

const TTTitleWrap = styled((p) => (
  <Box
    direction="row"
    justify="between"
    align="center"
    margin={{ bottom: 'xsmall' }}
    {...p}
  />
))``;


const PlotHintContent = ({ hint, onEntityClick, onClose }) => (
  <Styled>
    <TTTitleWrap>
      <Box direction="row" gap="xsmall" margin={{ vertical: 'xsmall' }}>
        {hint.content.code && (
          <Box>
            <PlotHintMetaLabel>{hint.content.code}</PlotHintMetaLabel>
          </Box>
        )}
        {hint.content.code && (
          <Box>
            <PlotHintMetaLabel>|</PlotHintMetaLabel>
          </Box>
        )}
        <PlotHintMetaLabel>
          <FormattedDate
            value={new Date(hint.content.date)}
            year="numeric"
            month="long"
            day="numeric"
          />
        </PlotHintMetaLabel>
      </Box>
      {onClose && (
        <PrintHide>
          <Button
            plain
            icon={<FormClose size="small" />}
            onClick={() => onClose()}
          />
        </PrintHide>
      )}
    </TTTitleWrap>
    <PlotHintTitleLabel>{hint.content.title}</PlotHintTitleLabel>
    <ButtonWrap>
      <ActionButton
        as="a"
        plain
        href={`${ROUTES.ACTION}/${hint.content.id}`}
        onClick={(evt) => {
          // if (evt && evt.preventDefault) evt.preventDefault();
          if (evt && evt.stopPropagation) evt.stopPropagation();
          onEntityClick(hint.content.id, ROUTES.ACTION);
        }}
      >
        <Box direction="row" align="center">
          <Text size="small"><FormattedMessage {...messages.actionDetails} /></Text>
          <FormNext size="xsmall" style={{ stroke: 'inherit' }} />
        </Box>
      </ActionButton>
    </ButtonWrap>
  </Styled>
);

PlotHintContent.propTypes = {
  hint: PropTypes.object.isRequired,
  onEntityClick: PropTypes.func,
  onClose: PropTypes.func,
};

export default PlotHintContent;
