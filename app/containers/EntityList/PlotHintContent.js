import React from 'react';
import { palette } from 'styled-theme';
import styled from 'styled-components';
import { FormattedDate } from 'react-intl';

import { Hint } from 'react-vis';

const PlotHintWrapper = styled.div`
pointer-events: none;
margin: 15px 0px;
`;

const PlotHint = styled.div`
  max-width: 300px;
  color: ${({ color, theme }) => theme.global.colors[color]};
  background: ${({ theme }) => theme.global.colors.white};
  padding: 5px 10px;
  border-radius: ${({ theme }) => theme.global.edgeSize.xxsmall};
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.2);
  font-weight: 700;
  white-space: nowrap;
  pointer-events: auto;
`;

const PlotHintDateLabel = styled.div`
color: ${palette('text', 1)};
@media (min-width: ${(props) => props.theme.breakpoints.medium}) {
  font-size: ${(props) => props.theme.sizes.text.smaller};
}
`;

const PlotHintTitleLabel = styled.div`
color: ${({ color, theme }) => theme.global.colors[color]};
width: 250px;
text-wrap: wrap;
`;

// const PlotHintLinkLabel = styled.a`
// text-decoration: underline;
// `;
const PlotHintContent = (props) => {
  const { hint, entities } = props;
  const hintEntity = hint ? entities.find((entity) => entity.get('id') === hint.id) : null;

  return hint && hintEntity
        && (
          <Hint
            {...props}
            value={hint}
            style={{
              pointerEvents: 'none',
              margin: '10px 0',
            }}
          >
            <PlotHintWrapper>
              <PlotHint>
                <PlotHintDateLabel>
                  <FormattedDate
                    value={new Date(hintEntity.getIn(['attributes', 'date_start']))}
                    year="numeric"
                    month="long"
                    day="numeric"
                  />
                </PlotHintDateLabel>
                <PlotHintTitleLabel>{hintEntity.getIn(['attributes', 'title'])}</PlotHintTitleLabel>
              </PlotHint>
            </PlotHintWrapper>
          </Hint>
        );
};

export default PlotHintContent;
