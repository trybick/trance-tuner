import React from 'react';

import { COLORS, BORDER_RADIUS, GRADIENT } from '../styles/constants';
import '../styles/button.css';

const style = {
  padding: '.5rem 2.5rem',
  color: COLORS.lightWhite,
  fontWeight: 700,
  background: GRADIENT,
  borderRadius: BORDER_RADIUS,
  borderWidth: 0,
  cursor: 'pointer',
};

const Button = ({ children, openNewTab, to }) => {
  const baseButton = (
    <button style={style} type="button">
      {children}
    </button>
  );

  return to ? (
    <a href={to} target={openNewTab && '_blank'}>
      {baseButton}
    </a>
  ) : (
    baseButton
  );
};

export default Button;
