import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { Box, Text, Drop } from 'grommet';
import styled from 'styled-components';
import { truncateText } from 'utils/string';

import appMessages from 'containers/App/messages';
import Label from './Label';
import LabelTooltip from './LabelTooltip';
import LinkTooltip from './LinkTooltip';

const LabelInTooltip = styled((p) => <Text size="xsmall" wordBreak="keep-all" {...p} />)`
  line-height: 13px;
`;

export function CellBodyCategories({
  entity,
  align = 'start',
  intl,
}) {
  const buttonRef = useRef();
  const [showContent, setShowContent] = useState(false);
  return (
    <Box alignContent={align}>
      {entity.single && (
        <Label textAlign={align}>
          {truncateText(entity.value, 25)}
        </Label>
      )}
      {entity.tooltip && (
        <LinkTooltip
          ref={buttonRef}
          alignSelf={align}
          onClick={() => setShowContent(!showContent)}
          active={showContent}
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
          <Box
            style={{ minWidth: '240px' }}
            pad={{
              horizontal: 'small',
              vertical: 'medium',
            }}
            flex={{ shrink: 0 }}
          >
            <Box border="bottom" flex={{ shrink: 0 }} margin={{ bottom: 'small' }}>
              <Text size="small" weight={500}>
                {`${entity.tooltip.size} ${intl.formatMessage(appMessages.entities.taxonomies[entity.taxonomy_id][entity.tooltip.size === 1 ? 'shortSingle' : 'shortPlural'])}`}
              </Text>
            </Box>
            <Box flex={{ shrink: 0 }} gap="xsmall">
              {entity.tooltip.toList()
                .sort(
                  (a, b) => a.getIn(['attributes', 'title'])
                    > b.getIn(['attributes', 'title'])
                    ? 1
                    : -1
                ).map(
                  (category) => (
                    <Box key={category.get('id')} flex={{ shrink: 0 }}>
                      <LabelInTooltip>
                        {truncateText(category.getIn(['attributes', 'title']), 30)}
                      </LabelInTooltip>
                    </Box>
                  )
                )
              }
            </Box>
          </Box>
        </Drop>
      )}
    </Box>
  );
}

CellBodyCategories.propTypes = {
  entity: PropTypes.object,
  align: PropTypes.string,
  intl: intlShape,
};


export default injectIntl(CellBodyCategories);
