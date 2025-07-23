import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Form, Errors } from 'react-redux-form/immutable';
import styled from 'styled-components';
import { Box, Text } from 'grommet';
import { CircleInformation, StatusGood } from 'grommet-icons';
import { omit } from 'lodash/object';
import { startCase } from 'lodash/string';

import appMessages from 'containers/App/messages';

import ButtonCancel from 'components/buttons/ButtonCancel';
import ButtonSubmit from 'components/buttons/ButtonSubmit';
import Clear from 'components/styled/Clear';
import Main from 'components/EntityView/Main';
import ViewPanel from 'components/EntityView/ViewPanel';
import FieldGroupWrapper from 'components/fields/FieldGroupWrapper';
import Field from 'components/fields/Field';

import ErrorWrapper from '../ErrorWrapper';
import FormWrapper from '../FormWrapper';
import FormBody from '../FormBody';
import FormFooter from '../FormFooter';
import FormFooterButtons from '../FormFooterButtons';
import Label from '../Label';
import Required from '../Required';
import ControlInput from '../ControlInput';

// These props will be omitted before being passed to the Control component
const nonControlProps = ['hint', 'label', 'component', 'controlType', 'children', 'errorMessages', 'showErrorsAsHints'];

const StyledForm = styled(Form)`
  display: table;
  width: 100%;
`;

class AuthForm extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  renderField = (field) => {
    const { id, model, ...props } = omit(field, nonControlProps);
    return (
      <ControlInput
        id={id}
        model={model || `.${id}`}
        {...props}
      />
    );
  }

  renderBody = (fields, formData) => {
    const hasFormErrors = formData && Object.values(formData.$form.errors).reduce((memo, val) => memo || val, false);
    return (
      <FormBody>
        <ViewPanel>
          <Main bottom>
            <FieldGroupWrapper>
              {fields.map((field, i) => {
                const value = formData && formData.attributes && formData.attributes[field.id]
                  && formData.attributes[field.id].value;
                const touched = formData && formData.attributes && formData.attributes[field.id]
                  && formData.attributes[field.id].touched;
                const hasPasswordMatchError = hasFormErrors
                  && formData
                  && formData.$form
                  && formData.$form.errors
                  && typeof formData.$form.errors.passwordsMatch !== 'undefined'
                  && formData.$form.errors.passwordsMatch;
                return (
                  <Field key={i}>
                    {field.label !== false && (
                      <Label htmlFor={field.id}>
                        {`${field.label || startCase(field.id)}`}
                        { field.validators && field.validators.required
                        && <Required>*</Required>
                        }
                      </Label>
                    )}
                    {this.renderField(field)}
                    {!field.showErrorsAsHints
                      && field.errorMessages
                      && (
                        <ErrorWrapper>
                          <Errors
                            className="errors"
                            model={field.model}
                            show="touched"
                            messages={field.errorMessages}
                            component={
                              (props) => (
                                <Box direction="row" align="center" gap="xsmall">
                                  <CircleInformation
                                    style={{ transform: 'rotate(180deg)' }}
                                    size="xxsmall"
                                    color="error"
                                  />
                                  {props.children}
                                </Box>
                              )
                            }
                          />
                        </ErrorWrapper>
                      )
                    }
                    {field.showErrorsAsHints && field.errorMessages && field.validators && (
                      <Box margin={{ top: 'xsmall' }} gap="xsmall">
                        {Object.keys(field.errorMessages).map((errorKey) => {
                          let valid = true;
                          if (field.validators[errorKey]) {
                            valid = !!field.validators[errorKey](value);
                          }
                          if (valid && errorKey === 'maxFieldLength') {
                            return null;
                          }
                          if (
                            Object.keys(field.errorMessages).indexOf('passwordLength') > -1
                            && errorKey === 'required') {
                            return null;
                          }
                          return (
                            <Box key={errorKey} direction="row" align="center" gap="xsmall">
                              {!valid && (
                                <CircleInformation
                                  style={{ transform: 'rotate(180deg)', opacity: 0.5 }}
                                  size="xxsmall"
                                  color="textSecondary"
                                />
                              )}
                              {valid && (
                                <StatusGood
                                  size="xxsmall"
                                  color="success"
                                />
                              )}
                              <Text
                                size="xsmall"
                                color={valid ? 'success' : 'textSecondary'}
                              >
                                {field.errorMessages[errorKey]}
                              </Text>
                            </Box>
                          );
                        })}
                      </Box>
                    )}
                    {field.id === 'passwordConfirmation' && hasPasswordMatchError && touched && (
                      <Box margin={{ top: 'xsmall' }} direction="row" align="center" gap="xsmall">
                        <CircleInformation
                          style={{ transform: 'rotate(180deg)' }}
                          size="xxsmall"
                          color="error"
                        />
                        <Text
                          size="xsmall"
                          color="error"
                        >
                          <FormattedMessage {...appMessages.forms.passwordMismatchError} />
                        </Text>
                      </Box>
                    )}
                  </Field>
                );
              })}

            </FieldGroupWrapper>
          </Main>
        </ViewPanel>
      </FormBody>
    );
  };

  render() {
    const {
      fields, model, handleSubmit, handleCancel, labels, formData, validators,
    } = this.props;

    return (
      <FormWrapper>
        <StyledForm
          model={model}
          onSubmit={handleSubmit}
          validators={validators}
        >
          { fields && this.renderBody(fields, formData) }
          <FormFooter>
            <FormFooterButtons>
              <ButtonCancel type="button" onClick={handleCancel}>
                <FormattedMessage {...appMessages.buttons.cancel} />
              </ButtonCancel>
              <ButtonSubmit type="submit" disabled={this.props.sending}>
                {labels.submit}
              </ButtonSubmit>
            </FormFooterButtons>
            <Clear />
          </FormFooter>
        </StyledForm>
      </FormWrapper>
    );
  }
}

AuthForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  labels: PropTypes.object,
  formData: PropTypes.object,
  model: PropTypes.string,
  fields: PropTypes.array,
  sending: PropTypes.bool,
  validators: PropTypes.object,
};
AuthForm.defaultProps = {
  sending: false,
};
export default AuthForm;
