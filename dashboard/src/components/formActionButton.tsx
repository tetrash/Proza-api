import React, { FormEvent, ReactNode } from 'react';
import { Button, CircularProgress } from '@material-ui/core';

interface SaveButtonProps {
  className?: string;
  color?: 'primary' | 'secondary';
  buttonText: string;
  startIcon?: ReactNode;
  onClick: (event: FormEvent) => unknown;
}

export default function FormActionButton({ onClick, buttonText, className, startIcon, color }: SaveButtonProps) {
  return (
    <Button
      form="create-post-form"
      color={color || 'primary'}
      className={className}
      onClick={onClick}
      startIcon={startIcon}
    >
      {buttonText}
    </Button>
  );
}
