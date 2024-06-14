import React from 'react';
import PropTypes from 'prop-types';
import { Box } from 'grommet';
import styled from 'styled-components';
import { FormattedMessage, intlShape, injectIntl } from 'react-intl';

import { upperCase } from 'utils/string';

import SkipContent from 'components/styled/SkipContent';
import PrintHide from 'components/styled/PrintHide';
import TextPrint from 'components/styled/TextPrint';
import Checkbox from 'components/styled/Checkbox';

import appMessages from 'containers/App/messages';

import Link from './Link';
import Label from './Label';
import messages from './messages';

const Select = styled(PrintHide)`
  width: 20px;
  text-align: center;
  padding-right: 6px;
`;

export function CellBodyMain({
  entity,
  // column,
  canEdit,
  skipTargetId,
  intl,
}) {
  return (
    <Box direction="row" align="center" justify="start">
      {canEdit && (
        <PrintHide>
          <Select>
            <Checkbox
              checked={entity.selected}
              onChange={(evt) => entity.onSelect(evt.target.checked)}
            />
          </Select>
        </PrintHide>
      )}
      <Box>
        {Object.keys(entity.values).map((key) => (
          <Box key={key}>
            {(key === 'title' || key === 'name') && (
              <Link
                href={entity.href}
                onClick={entity.onClick}
                title={entity.values.title}
              >
                <Label>
                  {entity.values[key]}
                </Label>
              </Link>
            )}
            {key !== 'title' && key !== 'name' && (
              <Label
                color="dark-5"
                size="xxsmall"
              >
                {entity.values[key]}
              </Label>
            )}
          </Box>
        ))}
        {entity.draft && (
          <Box>
            <TextPrint color="dark-5" size="xxsmall">
              {`[${upperCase(intl.formatMessage(appMessages.ui.publishStatuses.draft))}]`}
            </TextPrint>
          </Box>
        )}
        {entity.isArchived && (
          <Box>
            <TextPrint color="warning" size="xxsmall">
              {`[${upperCase(intl.formatMessage(appMessages.ui.userStatuses.archived))}]`}
            </TextPrint>
          </Box>
        )}
        {skipTargetId && (
          <SkipContent
            href={skipTargetId}
            title={intl.formatMessage(messages.skipNext)}
          >
            <FormattedMessage {...messages.skipNext} />
          </SkipContent>
        )}
      </Box>
    </Box>
  );
}

CellBodyMain.propTypes = {
  entity: PropTypes.object,
  // column: PropTypes.object,
  canEdit: PropTypes.bool,
  skipTargetId: PropTypes.string,
  intl: intlShape,
};

export default injectIntl(CellBodyMain);
