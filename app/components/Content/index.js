import React from 'react';
import PropTypes from 'prop-types';

import Container from 'components/styled/Container';
import ContainerWrapper from 'components/styled/Container/ContainerWrapper';

const Content = React.forwardRef(
  (
    {
      isSingle,
      withoutHeaderNav,
      isStatic,
      onClose,
      inModal,
      children,
    },
    ref,
  ) => (
    <ContainerWrapper
      bg={isSingle}
      ref={ref}
      isStatic={withoutHeaderNav || isStatic}
      isContent
      onClick={(e) => {
        if (inModal && onClose) {
          if (e.currentTarget !== e.target) return;
          onClose(e);
        }
      }}
    >
      <Container inModal={inModal} isSingle={isSingle}>
        {children}
      </Container>
    </ContainerWrapper>
  )
);

Content.propTypes = {
  children: PropTypes.node,
  inModal: PropTypes.bool,
  withoutHeaderNav: PropTypes.bool,
  isStatic: PropTypes.bool,
  isSingle: PropTypes.bool,
  onClose: PropTypes.func,
};

export default Content;
