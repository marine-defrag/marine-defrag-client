import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
// import { FormattedMessage, intlShape, injectIntl } from 'react-intl';
import { Box, Text } from 'grommet';
import PrintOnly from 'components/styled/PrintOnly';
import PrintHide from 'components/styled/PrintHide';

import MapKey from './MapKey';
import MapSubjectOptions from './MapSubjectOptions';
import MapOption from './MapOption';

const Title = styled((p) => <Text weight={500} {...p} />)`
  margin-right: ${({ hasInfo }) => hasInfo ? 8 : 0}px;
  @media print {
    font-size: 11pt;
  }
`;
const SubTitle = styled((p) => <Text size="small" {...p} />)`
  @media print {
    font-size: 9pt;
  }
`;

export function CountriesTab({
  config,
  minMaxValues,
  countryMapSubject,
  isPrintView,
}) {
  const {
    subjectOptions,
    title,
    subTitle,
    memberOption,
  } = config;
  const subjectOption = subjectOptions && subjectOptions.find((option) => option.active);
  return (
    <Box>
      <PrintOnly isPrint={isPrintView}>
        <Text size="small">
          {config.tabTitle}
        </Text>
        <Box gap="xsmall" margin={{ top: 'xsmall', bottom: 'medium' }}>
          {title && subjectOption && (
            <Title>{`${subjectOption.title}: ${title}`}</Title>
          )}
          {title && !subjectOption && (
            <Title>{title}</Title>
          )}
          {subTitle && (
            <SubTitle>{subTitle}</SubTitle>
          )}
        </Box>
      </PrintOnly>
      {subjectOptions && (
        <PrintHide isPrint={isPrintView}>
          <MapSubjectOptions options={subjectOptions} />
        </PrintHide>
      )}
      {minMaxValues.countries.max > 0 && (
        <MapKey
          maxValue={minMaxValues.countries.max}
          mapSubject={countryMapSubject}
          isPrint={isPrintView}
        />
      )}
      <PrintHide isPrint={isPrintView}>
        <Box gap="xsmall" margin={{ vertical: 'small' }}>
          {title && (
            <Title>{title}</Title>
          )}
          {subTitle && (
            <SubTitle>{subTitle}</SubTitle>
          )}
        </Box>
      </PrintHide>
      {memberOption && (
        <MapOption option={memberOption} type="member" />
      )}
    </Box>
  );
}

CountriesTab.propTypes = {
  config: PropTypes.object,
  minMaxValues: PropTypes.object,
  countryMapSubject: PropTypes.string,
  isPrintView: PropTypes.bool,
};

export default CountriesTab;
