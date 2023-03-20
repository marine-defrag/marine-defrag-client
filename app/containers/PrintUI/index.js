import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Box, RadioButton } from 'grommet';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import styled from 'styled-components';

import {
  selectViewQuery,
  selectPrintConfig,
  selectPageItemsQuery,
} from 'containers/App/selectors';
import {
  printView,
  closePrintView,
} from 'containers/App/actions';
import { PRINT_TYPES } from 'containers/App/constants';

import FormBody from 'components/forms/FormBody';
import FormFieldWrap from 'components/forms/FormFieldWrap';
import FieldGroupWrapper from 'components/fields/FieldGroupWrapper';
import FieldGroupLabel from 'components/fields/FieldGroupLabel';
import Field from 'components/fields/Field';
import GroupLabel from 'components/fields/GroupLabel';
import FieldLabel from 'components/forms/Label';
// import ControlRadio from 'components/forms/ControlRadio';
import ButtonCancel from 'components/buttons/ButtonCancel';
import ButtonSubmit from 'components/buttons/ButtonSubmit';
import Container from 'components/styled/Container';

import appMessages from 'containers/App/messages';
import qe from 'utils/quasi-equals';

import messages from './messages';

const StyledFieldGroupWrapper = styled(FieldGroupWrapper)`
  padding: 15px 0;
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    padding: 15px 0;
  }
`;

const Styled = styled((p) => <Container isNarrow {...p} />)`
  margin-left: 40px;
`;

const StyledForm = styled.form`
  position: relative;
  display: table;
  width: 100%;
  margin-bottom: 20px;
  @media print {
    display: none;
  }
`;
const StyledGroupLabel = styled(GroupLabel)`
  font-size: 1.2em;
  @media print {
    font-size: ${(props) => props.theme.sizes.print.large};
  }
`;

// <Field>
//   <FormFieldWrap>
//     <FieldLabel>
//       <FormattedMessage {...messages.formatOption} />
//     </FieldLabel>
//   </FormFieldWrap>
//   <FormFieldWrap>
//     <Box direction="row" gap="medium">
//       <RadioButton
//         name="radio-format-1"
//         checked={printSize === 'A4'}
//         label="A4"
//         onChange={() => onPrint({
//           printSize: 'A4',
//         })}
//       />
//       <RadioButton
//         name="radio-format-2"
//         checked={printSize === 'A3'}
//         label="A3"
//         onChange={() => onPrint({
//           printSize: 'A3',
//         })}
//       />
//     </Box>
//   </FormFieldWrap>
// </Field>

export function PrintUI({
  printConfig,
  close,
  onPrint,
  view,
  intl,
  pageItems,
}) {
  const {
    printType,
    printTabs,
    // printSize,
    printOrientation,
    printItems,
  } = printConfig;
  const printAllPages = printItems === 'all' || pageItems === 'all';
  return (
    <Styled>
      <StyledForm>
        <FormBody>
          <StyledFieldGroupWrapper>
            <FieldGroupLabel>
              <StyledGroupLabel>
                <FormattedMessage {...messages.title} />
              </StyledGroupLabel>
            </FieldGroupLabel>
            <Field>
              <FormFieldWrap>
                <FieldLabel>
                  <FormattedMessage {...messages.orientationOption} />
                </FieldLabel>
              </FormFieldWrap>
              <FormFieldWrap>
                <Box direction="row" gap="medium">
                  <RadioButton
                    name="radio-orient-1"
                    checked={printOrientation === 'portrait'}
                    label={intl.formatMessage(messages.orientationPortrait)}
                    onChange={() => onPrint({
                      printOrientation: 'portrait',
                    })}
                  />
                  <RadioButton
                    name="radio-orient-2"
                    checked={printOrientation === 'landscape'}
                    label={intl.formatMessage(messages.orientationLandscape)}
                    onChange={() => onPrint({
                      printOrientation: 'landscape',
                    })}
                  />
                </Box>
              </FormFieldWrap>
            </Field>
            {qe(printType, PRINT_TYPES.LIST) && view === 'list' && (
              <Field>
                <FormFieldWrap>
                  <FieldLabel>
                    <FormattedMessage {...messages.pagesOption} />
                  </FieldLabel>
                </FormFieldWrap>
                <FormFieldWrap>
                  <Box direction="row" gap="medium">
                    <RadioButton
                      name="radio-pages-1"
                      checked={!printAllPages}
                      label={intl.formatMessage(messages.pagesCurrent)}
                      onChange={() => onPrint({
                        printItems: 'current',
                      })}
                    />
                    <RadioButton
                      name="radio-pages-2"
                      checked={printAllPages}
                      label={intl.formatMessage(messages.pagesAll)}
                      onChange={() => onPrint({
                        printItems: 'all',
                      })}
                    />
                  </Box>
                </FormFieldWrap>
              </Field>
            )}
            {qe(printType, PRINT_TYPES.SINGLE) && (
              <Field>
                <FormFieldWrap>
                  <FieldLabel>
                    <FormattedMessage {...messages.tabOption} />
                  </FieldLabel>
                </FormFieldWrap>
                <FormFieldWrap>
                  <Box direction="row" gap="medium">
                    <RadioButton
                      name="radio-tabs-1"
                      checked={printTabs !== 'all'}
                      label={intl.formatMessage(messages.tabsCurrent)}
                      onChange={() => onPrint({
                        printTabs: 'current',
                      })}
                    />
                    <RadioButton
                      name="radio-tabs-2"
                      checked={printTabs === 'all'}
                      label={intl.formatMessage(messages.tabsAll)}
                      onChange={() => onPrint({
                        printTabs: 'all',
                      })}
                    />
                  </Box>
                </FormFieldWrap>
              </Field>
            )}
          </StyledFieldGroupWrapper>
        </FormBody>
        <Box direction="row" justify="end">
          <ButtonCancel type="button" onClick={close}>
            <FormattedMessage {...appMessages.buttons.cancel} />
          </ButtonCancel>
          <ButtonSubmit
            type="button"
            onClick={() => window.print && window.print()}
          >
            <FormattedMessage {...messages.buttonPrint} />
          </ButtonSubmit>
        </Box>
      </StyledForm>
    </Styled>
  );
}

PrintUI.propTypes = {
  printConfig: PropTypes.object,
  pageItems: PropTypes.string,
  view: PropTypes.string,
  close: PropTypes.func,
  onPrint: PropTypes.func,
  intl: intlShape.isRequired,
};

const mapStateToProps = (state) => ({
  view: selectViewQuery(state),
  printConfig: selectPrintConfig(state),
  pageItems: selectPageItemsQuery(state),
});

function mapDispatchToProps(dispatch) {
  return {
    onPrint: (config) => {
      dispatch(printView(config));
    },
    close: () => {
      dispatch(closePrintView(null));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(PrintUI));
