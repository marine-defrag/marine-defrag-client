import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Drop } from 'grommet';
import { truncateText } from 'utils/string';

import { ROUTES } from 'themes/config';
import DropEntityList from './DropEntityList';
import Link from './Link';
import Label from './Label';
import LabelTooltip from './LabelTooltip';
import LinkTooltip from './LinkTooltip';

const getActionLink = (action) => `${ROUTES.ACTION}/${action.get('id')}`;

export function CellBodyActions({
  entity,
  align = 'start',
  onEntityClick,
}) {
  const buttonRef = useRef();
  const [showContent, setShowContent] = useState(false);
  return (
    <Box alignContent={align}>
      {entity.single && (
        <Link
          href={getActionLink(entity.single)}
          onClick={(evt) => {
            if (evt) evt.preventDefault();
            onEntityClick(entity.single.get('id'), ROUTES.ACTION);
          }}
          title={entity.value}
          alignSelf={align}
        >
          <Label textAlign={align}>
            {truncateText(entity.value, 25)}
          </Label>
        </Link>
      )}
      {entity.tooltip && (
        <LinkTooltip
          ref={buttonRef}
          alignSelf={align}
          onClick={() => setShowContent(!showContent)}
        >
          <LabelTooltip textAlign={align}>
            {entity.value}
          </LabelTooltip>
        </LinkTooltip>
      )}
      {entity.tooltip && showContent && buttonRef.current && (
        <Drop
          target={buttonRef.current}
          onClickOutside={() => setShowContent(false)}
          align={{
            bottom: 'top',
          }}
          margin={{ horizontal: 'xsmall', vertical: 'xsmall' }}
          background="white"
          elevation="small"
          overflow={{
            vertical: 'auto',
            horizontal: 'hidden',
          }}
        >
          <DropEntityList
            entityType="actions"
            tooltipConfig={entity.tooltip}
            onEntityClick={(id) => {
              setShowContent(false);
              onEntityClick(id, ROUTES.ACTION);
            }}
          />
        </Drop>
      )}
    </Box>
  );
}

CellBodyActions.propTypes = {
  entity: PropTypes.object,
  align: PropTypes.string,
  onEntityClick: PropTypes.func,
};


export default CellBodyActions;
