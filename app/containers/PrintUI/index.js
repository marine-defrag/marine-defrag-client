import React, { useEffect, useRef, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Box, Text } from 'grommet';
import styled from 'styled-components';

import {
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
import ButtonForm from 'components/buttons/ButtonForm';
import ButtonCancel from 'components/buttons/ButtonCancel';
import ButtonSubmit from 'components/buttons/ButtonSubmit';
import CheckboxButton from 'components/buttons/CheckboxButton';
import Container from 'components/styled/Container';

import appMessages from 'containers/App/messages';
import qe from 'utils/quasi-equals';

import messages from './messages';

const MyCheckboxButton = forwardRef(
  (props, ref) => <CheckboxButton innerRef={ref} {...props} />
);

const Styled = styled.div`
  position: relative;
  z-index: 96;
  margin: 40px auto;
  @media print {
    display: none;
  }
`;

const StyledContainer = styled((p) => <Container isNarrow {...p} />)`
  padding-bottom: 0px;
`;
const StyledFieldGroupWrapper = styled(FieldGroupWrapper)`
  padding: 15px 0;
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    padding: 15px 0;
  }
`;

const StyledForm = styled.form`
  position: relative;
  display: table;
  width: 100%;
  margin-bottom: 20px;
`;
const StyledGroupLabel = styled(GroupLabel)`
  font-size: 1.2em;
  @media print {
    font-size: ${(props) => props.theme.sizes.print.large};
  }
`;

const Label = styled((p) => <Text size="small" {...p} />)``;

const Footer = styled.div`
  position: fixed;
  width: 100%;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333333;
  box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.5);
`;

const FooterContainer = styled((p) => <Container isNarrow {...p} />)`
  padding-bottom: 0px;
`;

const StyledButtonCancel = styled(ButtonForm)`
  color: white;
  opacity: 0.9;
  &:hover {
    opacity: 0.8;
  }
`;

export function PrintUI({
  printConfig,
  close,
  onPrint,
  pageItems,
}) {
  const focusElementRef = useRef();
  useEffect(() => {
    // set focus on first checkbox
    if (focusElementRef && focusElementRef.current) {
      focusElementRef.current.focus();
    }
  }, [focusElementRef]);

  const {
    printType,
    printTabs,
    printAllTypes,
    printSize,
    printOrientation,
    printItems,
    printContentOptions,
    printMapOptions,
    printMapMarkers,
  } = printConfig;
  const printAllPages = printItems === 'all' || pageItems === 'all';

  return (
    <Styled>
      <StyledContainer>
        <Box>
          <h2>
            <FormattedMessage {...messages.title} />
          </h2>
        </Box>
        <Box margin={{ bottom: 'medium' }}>
          <Text size="large">
            <FormattedMessage {...messages.hint} />
          </Text>
        </Box>
        <StyledForm>
          <FormBody>
            <FieldGroupLabel>
              <StyledGroupLabel>
                <FormattedMessage {...messages.titleFormat} />
              </StyledGroupLabel>
            </FieldGroupLabel>
            <Box direction="row" fill="horizontal">
              <Box basis="1/2">
                <StyledFieldGroupWrapper>
                  <Field>
                    <FormFieldWrap>
                      <FieldLabel>
                        <FormattedMessage {...messages.orientationOption} />
                      </FieldLabel>
                    </FormFieldWrap>
                    <FormFieldWrap>
                      <Box direction="row" gap="medium">
                        <MyCheckboxButton
                          ref={focusElementRef}
                          type="radio"
                          name="radio-orient-1"
                          checked={printOrientation === 'portrait'}
                          label={(
                            <Label>
                              <FormattedMessage {...messages.orientationPortrait} />
                            </Label>
                          )}
                          onChange={() => onPrint({
                            printOrientation: 'portrait',
                          })}
                        />
                        <MyCheckboxButton
                          type="radio"
                          name="radio-orient-2"
                          checked={printOrientation === 'landscape'}
                          label={(
                            <Label>
                              <FormattedMessage {...messages.orientationLandscape} />
                            </Label>
                          )}
                          onChange={() => onPrint({
                            printOrientation: 'landscape',
                          })}
                        />
                      </Box>
                    </FormFieldWrap>
                  </Field>
                  <Field>
                    <FormFieldWrap>
                      <FieldLabel>
                        Size
                      </FieldLabel>
                    </FormFieldWrap>
                    <FormFieldWrap>
                      <Box direction="row" gap="medium">
                        <MyCheckboxButton
                          type="radio"
                          group="radio-size"
                          name="radio-size-1"
                          checked={printSize === 'A4'}
                          label={<Label>A4</Label>}
                          onChange={() => onPrint({
                            printSize: 'A4',
                          })}
                        />
                        <MyCheckboxButton
                          type="radio"
                          group="radio-size"
                          name="radio-size-2"
                          checked={printSize === 'A3'}
                          label={<Label>A3</Label>}
                          onChange={() => onPrint({
                            printSize: 'A3',
                          })}
                        />
                      </Box>
                    </FormFieldWrap>
                  </Field>
                </StyledFieldGroupWrapper>
              </Box>
              <Box basis="1/2">
                <StyledFieldGroupWrapper>
                  <Text size="xsmall" color="hint">
                    <FormattedMessage {...messages.hintFormat} />
                  </Text>
                </StyledFieldGroupWrapper>
              </Box>
            </Box>
            {!!printContentOptions && (
              <Box>
                <FieldGroupLabel>
                  <StyledGroupLabel>
                    <FormattedMessage {...messages.titleContent} />
                  </StyledGroupLabel>
                </FieldGroupLabel>
                <Box direction="row" fill="horizontal">
                  <Box basis="1/2">
                    <StyledFieldGroupWrapper>
                      {printContentOptions.pages && (
                        <Field>
                          <FormFieldWrap>
                            <FieldLabel>
                              <FormattedMessage {...messages.pagesOption} />
                            </FieldLabel>
                          </FormFieldWrap>
                          <FormFieldWrap>
                            <Box direction="row" gap="medium">
                              <MyCheckboxButton
                                type="radio"
                                group="radio-pages"
                                name="radio-pages-1"
                                checked={!printAllPages}
                                label={(
                                  <Label>
                                    <FormattedMessage {...messages.pagesCurrent} />
                                  </Label>
                                )}
                                onChange={() => onPrint({
                                  printItems: 'current',
                                })}
                              />
                              <MyCheckboxButton
                                type="radio"
                                group="radio-pages"
                                name="radio-pages-2"
                                checked={printAllPages}
                                label={(
                                  <Label>
                                    <FormattedMessage {...messages.pagesAll} />
                                  </Label>
                                )}
                                onChange={() => onPrint({
                                  printItems: 'all',
                                })}
                              />
                            </Box>
                          </FormFieldWrap>
                        </Field>
                      )}
                      {printContentOptions.tabs && (
                        <Field>
                          <FormFieldWrap>
                            <FieldLabel>
                              <FormattedMessage {...messages.tabOption} />
                            </FieldLabel>
                          </FormFieldWrap>
                          <FormFieldWrap>
                            <Box direction="row" gap="medium">
                              <MyCheckboxButton
                                type="radio"
                                group="radio-tabs"
                                name="radio-tabs-1"
                                checked={printTabs !== 'all'}
                                label={(
                                  <Label>
                                    <FormattedMessage {...messages.tabsCurrent} />
                                  </Label>
                                )}
                                onChange={() => onPrint({
                                  printTabs: 'current',
                                })}
                              />
                              <MyCheckboxButton
                                type="radio"
                                group="radio-tabs"
                                name="radio-tabs-2"
                                checked={printTabs === 'all'}
                                label={(
                                  <Label>
                                    <FormattedMessage {...messages.tabsAll} />
                                  </Label>
                                )}
                                onChange={() => onPrint({
                                  printTabs: 'all',
                                })}
                              />
                            </Box>
                          </FormFieldWrap>
                        </Field>
                      )}
                      {printContentOptions.types && (
                        <Field>
                          <FormFieldWrap>
                            <FieldLabel>
                              <FormattedMessage {...messages.typesOption} />
                            </FieldLabel>
                          </FormFieldWrap>
                          <FormFieldWrap>
                            <Box direction="row" gap="medium">
                              <MyCheckboxButton
                                type="radio"
                                group="radio-types"
                                name="radio-types-1"
                                checked={printAllTypes !== 'all'}
                                label={(
                                  <Label>
                                    <FormattedMessage {...messages.typesCurrent} />
                                  </Label>
                                )}
                                onChange={() => onPrint({
                                  printAllTypes: 'current',
                                })}
                              />
                              <MyCheckboxButton
                                type="radio"
                                group="radio-types"
                                name="radio-types-2"
                                checked={printAllTypes === 'all'}
                                label={(
                                  <Label>
                                    <FormattedMessage {...messages.typesAll} />
                                  </Label>
                                )}
                                onChange={() => onPrint({
                                  printAllTypes: 'all',
                                })}
                              />
                            </Box>
                          </FormFieldWrap>
                        </Field>
                      )}
                    </StyledFieldGroupWrapper>
                  </Box>
                  <Box basis="1/2">
                    <StyledFieldGroupWrapper>
                      <Text size="xsmall" color="hint">
                        {qe(printType, PRINT_TYPES.LIST) && (
                          <FormattedMessage {...messages.hintContentList} />
                        )}
                        {qe(printType, PRINT_TYPES.SINGLE) && (
                          <FormattedMessage {...messages.hintContentSingle} />
                        )}
                      </Text>
                    </StyledFieldGroupWrapper>
                  </Box>
                </Box>
              </Box>
            )}
            {!!printMapOptions && (
              <Box>
                <FieldGroupLabel>
                  <StyledGroupLabel>
                    <FormattedMessage {...messages.titleMap} />
                  </StyledGroupLabel>
                </FieldGroupLabel>
                <Box direction="row" fill="horizontal">
                  <Box basis="1/2">
                    <StyledFieldGroupWrapper>
                      {printMapOptions.markers && (
                        <Field>
                          <FormFieldWrap>
                            <FieldLabel>
                              <FormattedMessage {...messages.mapMarkersOption} />
                            </FieldLabel>
                          </FormFieldWrap>
                          <FormFieldWrap>
                            <Box direction="row" gap="medium">
                              <MyCheckboxButton
                                name="checkbox-markers-1"
                                checked={printMapMarkers}
                                label={(
                                  <Label>
                                    <FormattedMessage {...messages.mapMarkersLabel} />
                                  </Label>
                                )}
                                onChange={() => onPrint({
                                  printMapMarkers: !printMapMarkers,
                                })}
                              />
                            </Box>
                          </FormFieldWrap>
                        </Field>
                      )}
                    </StyledFieldGroupWrapper>
                  </Box>
                  <Box basis="1/2">
                    <StyledFieldGroupWrapper>
                      <Text size="xsmall" color="hint">
                        <FormattedMessage {...messages.hintMap} />
                      </Text>
                    </StyledFieldGroupWrapper>
                  </Box>
                </Box>
              </Box>
            )}
          </FormBody>
          <Box direction="row" justify="end" border="top" pad={{ top: 'small' }}>
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
      </StyledContainer>
      <Footer>
        <FooterContainer>
          <Box direction="row" justify="end">
            <StyledButtonCancel type="button" onClick={close}>
              <FormattedMessage {...appMessages.buttons.cancel} />
            </StyledButtonCancel>
            <ButtonSubmit
              type="button"
              onClick={() => window.print && window.print()}
            >
              <FormattedMessage {...messages.buttonPrint} />
            </ButtonSubmit>
          </Box>
        </FooterContainer>
      </Footer>
    </Styled>
  );
}

PrintUI.propTypes = {
  printConfig: PropTypes.object,
  pageItems: PropTypes.string,
  close: PropTypes.func,
  onPrint: PropTypes.func,
};

const mapStateToProps = (state) => ({
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

export default connect(mapStateToProps, mapDispatchToProps)(PrintUI);
