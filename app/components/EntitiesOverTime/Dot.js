import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  position: relative;
  width: 16px;
  height: 16px;
  display: block;
`;
const Outer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 16px;
  height: 16px;
  background-color: rgba(71, 122, 209, 0.3);
  border-radius: 999px;
`;
const Inner = styled.div`
  position: absolute;
  top: 4px;
  left: 4px;
  width: 8px;
  height: 8px;
  background-color: rgb(71, 122, 209);
  border-radius: 999px;
`;

export function Dot() {
  return (
    <Wrapper>
      <Outer />
      <Inner />
    </Wrapper>
  );
}

export default Dot;
