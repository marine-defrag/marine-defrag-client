/*
 *
 * ActorViewDetailsCountryFacts
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { FormattedMessage, intlShape, injectIntl } from 'react-intl';
import {
  Box,
  Text,
  Button,
} from 'grommet';
import { Map } from 'immutable';
import styled, { css } from 'styled-components';

import qe from 'utils/quasi-equals';
import isNumber from 'utils/is-number';

import NumberField from 'components/fields/NumberField';

import { ROUTES } from 'themes/config';

import { updatePath } from 'containers/App/actions';
import { usePrint } from 'containers/App/PrintContext';

import appMessages from 'containers/App/messages';
import { selectActorIndicators } from './selectors';

const ResourceButton = styled((p) => <Button plain {...p} />)`
  ${({ isPrint }) => isPrint && css`color: #1c2121;`}
  @media print {
    color: color: #1c2121;
  }
`;
const Group = styled(
  (p) => (
    <Box
      margin={{ bottom: 'large', top: 'medium' }}
      pad={{ vertical: 'small' }}
      {...p}
    />
  )
)`
  @media print {
    page-break-inside: avoid;
    break-inside: avoid;
  }
`;
const GroupTitle = styled.h5`
  font-size: 18px;
  font-weight: 500;
  margin: 0;
  @media print {
    font-size: 12pt;
  }
`;
const GroupTitleLabel = styled(GroupTitle)`
  font-weight: 300;
  color: ${({ theme }) => theme.global.colors.text.secondary};
  font-size: 11px;
`;

const Indicator = styled((p) => <Box margin={{ top: 'medium' }} pad={{ top: 'medium' }} {...p} />)`
  border-top: 1px solid ${({ theme }) => theme.global.colors.border.light};
`;

const StyledBox = styled((p) => (<Box margin={{ vertical: 'small', horizontal: 'medium' }} {...p} />))`
  ${({ isPrint }) => isPrint && css`margin-left: 0;`}
  ${({ isPrint }) => isPrint && css`margin-right: 0;`}
  ${({ isPrint }) => isPrint && css`pointer-events: none;`}
  @media print {
    margin-left: 0;
    margin-right: 0;
  }
`;

export function ActorViewDetailsCountryFacts({
  indicators,
  resources,
  onUpdatePath,
  // intl,
}) {
  const isPrint = usePrint();
  const indicatorsByResourceId = indicators && indicators.groupBy(
    (entity) => {
      if (entity.get('resourcesByType')) {
        return entity.get('resourcesByType').flatten().toList().first();
      }
      return 'without';
    }
  );
  return (
    <Box>
      {(!indicators || indicators.size === 0) && (
        <StyledBox isPrint={isPrint}>
          <Text>
            No indicators for actor in database
          </Text>
        </StyledBox>
      )}
      {indicators && indicators.size > 0 && (
        <StyledBox isPrint={isPrint}>
          {indicatorsByResourceId && indicatorsByResourceId.keySeq().map(
            (resourceId) => {
              const resource = !qe(resourceId, 'without')
                && resources
                && resources.get(resourceId.toString());
              const resourceIndicators = indicatorsByResourceId.get(resourceId);
              return (
                <Group key={`res-${resourceId}`}>
                  {resource && (
                    <Box gap="xsmall">
                      <Box>
                        <GroupTitleLabel>
                          Resource
                        </GroupTitleLabel>
                      </Box>
                      <Box>
                        <ResourceButton
                          as="a"
                          href={`${ROUTES.RESOURCE}/${resourceId}`}
                          onClick={(e) => {
                            if (e) e.preventDefault();
                            onUpdatePath(`${ROUTES.RESOURCE}/${resourceId}`);
                          }}
                          isPrint={isPrint}
                        >
                          <GroupTitle>
                            {resource.getIn(['attributes', 'title'])}
                          </GroupTitle>
                        </ResourceButton>
                      </Box>
                    </Box>
                  )}
                  {!resource && (
                    <GroupTitle>
                      Without resource
                    </GroupTitle>
                  )}
                  <Box>
                    {resourceIndicators && resourceIndicators.toList().map((indicator) => {
                      const path = `${ROUTES.ACTION}/${indicator.get('id')}`;
                      const value = isNumber(indicator.get('value'))
                        ? parseFloat(indicator.get('value'), 10)
                        : value;
                      let digits;
                      if (isNumber(value)) {
                        digits = value > 1 ? 1 : 3;
                      }
                      return (
                        <Indicator key={indicator.get('id')}>
                          <Box direction="row">
                            <NumberField
                              field={{
                                title: indicator.getIn(['attributes', 'title']),
                                unit: indicator.getIn(['attributes', 'comment']),
                                value,
                                digits,
                                showEmpty: appMessages.labels.noIndicatorValue,
                                titleLink: {
                                  href: path,
                                  onClick: (evt) => {
                                    if (evt && evt.preventDefault) evt.preventDefault();
                                    onUpdatePath(path);
                                  },
                                },
                              }}
                            />
                          </Box>
                        </Indicator>
                      );
                    })}
                  </Box>
                </Group>
              );
            }
          )}
        </StyledBox>
      )}
    </Box>
  );
}

ActorViewDetailsCountryFacts.propTypes = {
  // viewEntity: PropTypes.instanceOf(Map),
  indicators: PropTypes.instanceOf(Map),
  resources: PropTypes.instanceOf(Map),
  onUpdatePath: PropTypes.func,
  // intl: intlShape,
};

const mapStateToProps = (state, { id }) => ({
  indicators: selectActorIndicators(state, id),
});

function mapDispatchToProps(dispatch) {
  return {
    onUpdatePath: (path) => {
      dispatch(updatePath(path));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ActorViewDetailsCountryFacts);
