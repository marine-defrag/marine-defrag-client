import React from 'react';
import PropTypes from 'prop-types';
import { Box } from 'grommet';
import styled from 'styled-components';

import SkipContent from 'components/styled/SkipContent';
import PrintHide from 'components/styled/PrintHide';
import TextPrint from 'components/styled/TextPrint';
import Checkbox from 'components/styled/Checkbox';

import Link from './Link';
import Label from './Label';

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
              [DRAFT]
            </TextPrint>
          </Box>
        )}
        {skipTargetId && (
          <SkipContent
            href={skipTargetId}
            title="Skip to next list item or group, continue to list item details"
          >
            Skip to next list item or group, continue to list item details
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
};

export default CellBodyMain;
