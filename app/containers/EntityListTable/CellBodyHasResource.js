import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Box, Text, Button, Drop,
} from 'grommet';
import { StatusGood, StatusCritical } from 'grommet-icons';
import styled from 'styled-components';
import appMessages from 'containers/App/messages';

import { ROUTES } from 'themes/config';
import LinkTooltip from './LinkTooltip';

const LinkInTooltip = styled((p) => <Button as="a" plain {...p} />)`
  line-height: 13px;
`;
const LabelInTooltip = styled((p) => <Text size="xsmall" wordBreak="keep-all" {...p} />)`
  line-height: 13px;
`;

const getLink = (res) => `${ROUTES.RESOURCE}/${res.get('id')}`;

const getOnClick = (res, onEntityClick) => (evt) => {
  if (evt) evt.preventDefault();
  onEntityClick(res.get('id'), ROUTES.RESOURCE);
};

export function CellBodyHasResource({
  entity,
  column,
  onEntityClick,
}) {
  const { align = 'end' } = column;
  const buttonRef = useRef();
  const [showContent, setShowContent] = useState(false);
  return (
    <Box alignContent={align}>
      {entity.value && (
        <LinkTooltip
          ref={buttonRef}
          alignSelf={align}
          onClick={() => setShowContent(!showContent)}
        >
          <StatusGood size="small" color="dark-2" />
        </LinkTooltip>
      )}
      {!entity.value && (
        <Box fill={false} align="end">
          <StatusCritical size="small" color="light-5" />
        </Box>
      )}
      {entity.value && showContent && buttonRef.current && (
        <Drop
          target={buttonRef.current}
          onClickOutside={() => setShowContent(false)}
          align={{
            bottom: 'top',
            right: 'right',
          }}
          margin={{ horizontal: 'xsmall', vertical: 'xsmall' }}
          background="white"
          elevation="small"
          overflow={{
            vertical: 'auto',
            horizontal: 'hidden',
          }}
        >
          <Box
            style={{
              minWidth: '240px',
              maxWidth: '340px',
            }}
            pad={{
              horizontal: 'small',
              vertical: 'medium',
            }}
            flex={{ shrink: 0 }}
          >
            <Box border="bottom" flex={{ shrink: 0 }} margin={{ bottom: 'small' }}>
              <Text size="small" weight={500}>
                <FormattedMessage {...appMessages.entities[`resources_${entity.resourcetype_id}`].single} />
              </Text>
            </Box>
            <Box flex={{ shrink: 0 }}>
              <LinkInTooltip
                href={getLink(entity.value)}
                onClick={getOnClick(entity.value, onEntityClick)}
                title={entity.value.getIn(['attributes', 'title'])}
              >
                <LabelInTooltip>
                  {entity.value.getIn(['attributes', 'title'])}
                </LabelInTooltip>
              </LinkInTooltip>
            </Box>
          </Box>
        </Drop>
      )}
    </Box>
  );
}

CellBodyHasResource.propTypes = {
  entity: PropTypes.object,
  column: PropTypes.object,
  onEntityClick: PropTypes.func,
};


export default CellBodyHasResource;
