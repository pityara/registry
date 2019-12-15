import React, { useContext } from 'react';
import LocalizationContext from '../../contexts/LocalizationContext';
import { Button } from '@material-ui/core';
import { LocationDisabledSharp } from '@material-ui/icons';

export default function LanguagePicker() {
  const {
    locales,
    currentLocale,
    onGetTranslation,
    onChangeLocale,
  } = useContext(LocalizationContext);


  return (
    <>
      <div className="buttons">
        {locales.map(loc => (
          <Button
            variant={loc === currentLocale ? 'contained' : 'outlined'}
            onClick={() => onChangeLocale(loc)}
          >
            {onGetTranslation(loc)}
          </Button>
        ))}

      </div>
      <style jsx>
        {`
          .buttons {
            display: flex;
          }
        `}
      </style>
    </>
  )
}
