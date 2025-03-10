import React from 'react';
import PropTypes from 'prop-types';

import DownloadFile from 'components/DownloadFile';

const DocumentView = ({ url }) => url
  ? <span><DownloadFile url={url} /></span>
  : null;

DocumentView.propTypes = {
  url: PropTypes.string,
};

export default DocumentView;
