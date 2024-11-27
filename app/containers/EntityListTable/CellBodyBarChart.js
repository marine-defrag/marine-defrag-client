import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Text,
  Button,
  Drop,
} from 'grommet';
import styled from 'styled-components';

import { ROUTES } from 'themes/config';

import DropEntityList from './DropEntityList';
import LinkTooltip from './LinkTooltip';

const Value = styled.div`
  width: 30px !important;
  display: block;
  text-align: right;
`;
const BarWrapper = styled.div`
  width: 100%;
  height: 20px;
  display: block;
  position: relative;
`;

const Bar = styled.div`
  width: ${({ value, maxvalue }) => value / maxvalue * 100}%;
  min-width: 1px;
  height: 20px;
  background-color: ${({ theme, subject }) => theme.global.colors[subject] || theme.global.colors.primary};
  opacity: ${({ issecondary }) => issecondary ? 0.6 : 1};
  display: block;
  position: absolute;
  left: 0;
  top: 0;
`;

const BarButton = styled((p) => <Button plain {...p} />)`
  width: ${({ value, maxvalue }) => value / maxvalue * 100}%;
  min-width: 1px;
  height: 20px;
  background-color: ${({ theme, subject }) => theme.global.colors[subject] || theme.global.colors.primary};
  display: block;
  position: absolute;
  left: 0;
  top: 0;
  opacity: ${({ issecondary, isHover }) => {
    if (isHover) {
      return issecondary ? 0.5 : 0.85;
    }
    return issecondary ? 0.6 : 1;
  }};
`;

const StyledLinkTT = styled(
  React.forwardRef((p, ref) => <LinkTooltip plain {...p} ref={ref} />)
)`
  padding: 0 4px;
`;

export function CellBodyBarChart({
  value,
  maxvalue,
  issecondary,
  subject,
  rowConfig,
  entityType,
  onEntityClick,
}) {
  const infoRef = useRef(null);
  const [info, showInfo] = useState(false);
  const [hover, isHover] = useState(false);

  return (
    <Box>
      {value && (
        <Box direction="row" gap="none" flex={{ shrink: 0 }} align="center">
          <Value>
            {!rowConfig.tooltip && (
              <Text size="small" weight={500} textAlign="end">
                {value}
              </Text>
            )}
            {rowConfig.tooltip && (
              <StyledLinkTT
                onClick={() => showInfo(!info)}
                onMouseOver={() => isHover(true)}
                onMouseLeave={() => isHover(false)}
                onFocus={() => isHover(true)}
                onBlur={() => null}
                ref={infoRef}
              >
                <Text size="small" weight={500} textAlign="end" wordBreak="keep-all">
                  {value}
                </Text>
              </StyledLinkTT>
            )}
          </Value>
          <BarWrapper>
            {!rowConfig.tooltip && (
              <Bar value={value} maxvalue={maxvalue} issecondary={issecondary} subject={subject} />
            )}
            {rowConfig.tooltip && (
              <BarButton
                value={value}
                maxvalue={maxvalue}
                issecondary={issecondary}
                subject={subject}
                fill={false}
                isHover={hover}
                onClick={() => showInfo(true)}
                onMouseOver={() => isHover(true)}
                onMouseLeave={() => isHover(false)}
                onFocus={() => isHover(true)}
                onBlur={() => null}
                tabIndex="-1"
              />
            )}
          </BarWrapper>
        </Box>
      )}
      {info && infoRef && rowConfig.tooltip && (
        <Drop
          target={infoRef.current}
          onClickOutside={() => showInfo(false)}
          align={{
            bottom: 'top',
            left: 'left',
          }}
          margin={{ bottom: 'xsmall' }}
          background="white"
          elevation="small"
          stretch={false}
        >
          <DropEntityList
            entityType={entityType}
            tooltipConfig={rowConfig.tooltip}
            onEntityClick={(id) => {
              showInfo(false);
              onEntityClick(id, entityType === 'actors' ? ROUTES.ACTOR : ROUTES.ACTION);
            }}
            footnote="As Implementing Partner"
          />
        </Drop>
      )}
    </Box>
  );
}

CellBodyBarChart.propTypes = {
  value: PropTypes.number,
  maxvalue: PropTypes.number,
  issecondary: PropTypes.bool,
  subject: PropTypes.string,
  entityType: PropTypes.string,
  rowConfig: PropTypes.object,
  onEntityClick: PropTypes.func,
};

export default CellBodyBarChart;
