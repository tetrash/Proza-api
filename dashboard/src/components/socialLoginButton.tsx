import { Button } from '@material-ui/core';
import React, { ReactNode, MouseEvent } from 'react';

interface SocialLoginButtonProps {
  color: string;
  backgroundColor: string;
  icon: ReactNode;
  buttonText: string;
  onClick: (e: MouseEvent) => unknown;
  width: string;
}

export default function SocialLoginButton({
  color,
  icon,
  buttonText,
  onClick,
  backgroundColor,
  width,
}: SocialLoginButtonProps) {
  return (
    <Button
      variant="contained"
      style={{ backgroundColor, color, width }}
      color="primary"
      size="large"
      startIcon={icon}
      onClick={onClick}
    >
      {buttonText}
    </Button>
  );
}
