import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Drop } from 'grommet';

import { truncateText } from 'utils/string';

import { ROUTES } from 'themes/config';
import DropEntityList from './DropEntityList';
import Link from './Link';
import LinkTooltip from './LinkTooltip';
import Label from './Label';
import LabelTooltip from './LabelTooltip';

const getActorLink = (actor) => `${ROUTES.ACTOR}/${actor.get('id')}`;

const getActorOnClick = (actor, onEntityClick, setShowContent) => (evt) => {
  if (evt) evt.preventDefault();
  if (setShowContent) setShowContent(false);
  onEntityClick(actor.get('id'), ROUTES.ACTOR);
};

export function CellBodyActors({
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
          href={getActorLink(entity.single)}
          onClick={getActorOnClick(entity.single, onEntityClick)}
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
            entityType="actors"
            tooltipConfig={entity.tooltip}
            onEntityClick={(id) => {
              setShowContent(false);
              onEntityClick(id, ROUTES.ACTOR);
            }}
            footnote="Implementing Partner"
          />
        </Drop>
      )}
    </Box>
  );
}

CellBodyActors.propTypes = {
  entity: PropTypes.object,
  align: PropTypes.string,
  onEntityClick: PropTypes.func,
};


export default CellBodyActors;
