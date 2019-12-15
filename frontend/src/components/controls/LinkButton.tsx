import React from 'react';
import Link from 'next/link';
import Button, { ButtonProps as MUIButtonProps } from '@material-ui/core/Button';
import LocalizationContext from '../../contexts/LocalizationContext';

export interface ButtonProps extends MUIButtonProps {
  href: string;
  label: string;
  className?: string;
}

export default function LinkButton(props: ButtonProps) {
  const { href, label, className, ...restProps } = props;
  const { onGetTranslation } = React.useContext(LocalizationContext);

  return (
    <Link
      href={href}
    >
      <a
        className={className}
      >
        <Button
          {...restProps}
        >
          {onGetTranslation(label)}
        </Button>
      </a>
    </Link>
  );
}
