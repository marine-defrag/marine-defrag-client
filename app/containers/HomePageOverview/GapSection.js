import React from 'react';

import styled from 'styled-components';

const Styled = styled.div`
  position: relative;
  padding-top: 33%;
`;

function GapSection() {
  return (
    <Styled>
      <svg
        viewBox="0 0 1920 144"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          width: '100%',
        }}
      >
        <path
          fill="#f1f0f1"
          d="M1205.74,40.95c-370.37,36.17-636.23,99.1-834.09,93.58C173.8,129.01,0,67.54,0,67.54V0h1920v121.65S1576.08,4.77,1205.74,40.95Z"
        />
      </svg>
      <svg
        viewBox="0 0 1920 190"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          width: '100%',
        }}
      >
        <path
          fill="#f1f0f1"
          d="M1920,88.05S1575.51-29.36,1205.3,6.98c-370.21,36.34-635.98,99.54-833.78,94C173.73,95.44,0,33.7,0,33.7v217.87h1920V88.05Z"
        />
      </svg>
    </Styled>
  );
}

// export default injectIntl(TeaserSection);
export default GapSection;
