import React, { useCallback, useContext } from 'react';
import { TextField as MUITextField } from '@material-ui/core';
import LocalizationContext from '../../contexts/LocalizationContext';

export default function TextField(props) {
  const { label, register, name, error, ...restProps } = props;
  const { onGetTranslation } = useContext(LocalizationContext);
  const extractError = useCallback((fieldName) => error && onGetTranslation(error.message), [error])

  return (
    <MUITextField
      name={name}
      label={onGetTranslation(label)}
      inputRef={register}
      helperText={extractError(name)}
      error={Boolean(error)}
      {...restProps}
    />
  );
}
