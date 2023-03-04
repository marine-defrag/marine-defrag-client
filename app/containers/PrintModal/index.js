import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { Box } from 'grommet';
import { Map } from 'immutable';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import Content from 'components/Content';
import {
  selectViewQuery,
} from 'containers/App/selectors';
import { printView } from 'containers/App/actions';
import { PRINT_TYPES } from 'containers/App/constants';

import FormWrapper from 'components/forms/FormWrapper';
import FormBody from 'components/forms/FormBody';
import FormFooter from 'components/forms/FormFooter';
import FormFooterButtons from 'components/forms/FormFooterButtons';
import FormFieldWrap from 'components/forms/FormFieldWrap';
import FieldGroupWrapper from 'components/fields/FieldGroupWrapper';
import FieldGroupLabel from 'components/fields/FieldGroupLabel';
import Field from 'components/fields/Field';
import GroupLabel from 'components/fields/GroupLabel';
import FieldLabel from 'components/forms/Label';
import ButtonCancel from 'components/buttons/ButtonCancel';
import ButtonSubmit from 'components/buttons/ButtonSubmit';
import Main from 'components/EntityView/Main';
import Clear from 'components/styled/Clear';

import appMessages from 'containers/App/messages';

import messages from './messages';

const StyledFieldGroupWrapper = styled(FieldGroupWrapper)`
  padding: 10px 15px 0;
`;
const StyledForm = styled.form`
  position: relative;
  display: table;
  width: 100%;
`;
const StyledGroupLabel = styled(GroupLabel)`
  font-size: 1.2em;
  @media print {
    font-size: ${(props) => props.theme.sizes.print.large};
  }
`;
const CONFIG = {
  pages: 'all',
  printTabs: 'all',
  printSize: 'A4',
  printOrientation: 'l',
};
export function PrintModal({
  args,
  close,
  onPrint,
  view,
}) {
  // console.log('options', args && args.toJS());
  const [config] = useState(CONFIG);
  const scrollContainer = useRef(null);
  const { type, hasTabs } = args;
  return (
    <div>
      <Content
        ref={scrollContainer}
        inModal
        onClose={() => close()}
      >
        <FormWrapper white>
          <StyledForm>
            <FormBody>
              <Main>
                <StyledFieldGroupWrapper>
                  <FieldGroupLabel>
                    <StyledGroupLabel>
                      <FormattedMessage {...messages.title} />
                    </StyledGroupLabel>
                  </FieldGroupLabel>
                  {type === PRINT_TYPES.LIST && view === 'list' && (
                    <Field>
                      <FormFieldWrap>
                        <FieldLabel>
                          <FormattedMessage {...messages.pagesOption} />
                        </FieldLabel>
                      </FormFieldWrap>
                    </Field>
                  )}
                  {type === PRINT_TYPES.LIST && view === 'map' && (
                    <Field>
                      <FormFieldWrap>
                        <FieldLabel>
                          <FormattedMessage {...messages.formatOption} />
                        </FieldLabel>
                      </FormFieldWrap>
                    </Field>
                  )}
                  {type === PRINT_TYPES.SINGLE && hasTabs && (
                    <Field>
                      <FormFieldWrap>
                        <FieldLabel>
                          <FormattedMessage {...messages.tabOption} />
                        </FieldLabel>
                      </FormFieldWrap>
                    </Field>
                  )}
                </StyledFieldGroupWrapper>
              </Main>
            </FormBody>
            <FormFooter>
              <FormFooterButtons>
                <ButtonCancel type="button" onClick={close}>
                  <FormattedMessage {...appMessages.buttons.cancel} />
                </ButtonCancel>
                <ButtonSubmit
                  type="button"
                  onClick={
                    () => {
                      onPrint(config);
                      close();
                    }
                  }
                >
                  <FormattedMessage {...messages.buttonPrint} />
                </ButtonSubmit>
              </FormFooterButtons>
              <Clear />
            </FormFooter>
          </StyledForm>
        </FormWrapper>
      </Content>
    </div>
  );
}

PrintModal.propTypes = {
  args: PropTypes.instanceOf(Map),
  location: PropTypes.object,
  view: PropTypes.string,
  close: PropTypes.func,
  onPrint: PropTypes.func,
};

const mapStateToProps = (state) => ({
  view: selectViewQuery(state),
});

function mapDispatchToProps(dispatch) {
  return {
    onPrint: (config) => {
      dispatch(printView(config));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PrintModal);
