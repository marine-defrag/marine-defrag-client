import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';

import Button from '../Button';

const Styled = styled(Button)`
  color: ${({ theme, isPrint }) => isPrint ? theme.global.colors.text.brand : palette('text', 2)};
  background-color: ${(props) => props.isPrint ? 'white' : palette(props.palette, props.pIndex || 0)};
  padding:${({ isPrint }) => isPrint ? ' 1px 4px' : '1px 6px'};
  margin-right: 2px;
  font-size:${({ isPrint }) => isPrint ? '9pt' : '0.85em'};
  border: 1px solid ${(props) => props.isPrint ? props.theme.global.colors.text.brand : palette(props.palette, props.pIndex || 0)};
  &:hover {
    color: ${palette('text', 2)};
    background-color: ${(props) => palette(props.disabled ? props.paletteHover : props.palette, props.pIndex || 0)};
  }
  &:focus-visible {
    outline-offset: 2px;
  }
  @media (min-width: ${({ theme }) => theme.breakpoints.medium}) {
    padding:${({ isPrint }) => isPrint ? ' 1px 4px' : '1px 6px'};
    font-size:${({ isPrint }) => isPrint ? '9pt' : '0.85em'};
  }
`;

export function ButtonTagFilter({
  onClick,
  label,
  ...props
}) {
  const title = onClick
    ? `${label}. Click to remove filter`
    : label;
  return <Styled title={title} {...props} />;
}

ButtonTagFilter.propTypes = {
  onClick: PropTypes.func,
  label: PropTypes.string,
};

export default ButtonTagFilter;
