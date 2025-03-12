import React from 'react';
import PropTypes from 'prop-types';
import DownloadFile from 'components/DownloadFile';
import { FormattedMessage } from 'react-intl';

import appMessages from 'containers/App/messages';

import FieldWrap from '../FieldWrap';
import Label from '../Label';
import DocumentWrap from '../DocumentWrap';

class DownloadField extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { field } = this.props;
    return (
      <FieldWrap>
        <Label>
          <FormattedMessage {...(field.label || appMessages.attributes.document_url)} />
        </Label>
        {field.value && (
          <DocumentWrap>
            <DownloadFile url={field.value} />
          </DocumentWrap>
        )}
      </FieldWrap>
    );
  }
}

DownloadField.propTypes = {
  field: PropTypes.object.isRequired,
};
DownloadField.contextTypes = {
  intl: PropTypes.object.isRequired,
};
export default DownloadField;
