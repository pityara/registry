import React, { useContext, useEffect } from 'react';
import useForm from 'react-hook-form';
import { Dialog, DialogTitle, DialogContent, Button } from '@material-ui/core';
import LocalizationContext from '../contexts/LocalizationContext';
import TextField from './controls/TextField';
import useStyles from './CreateDoctorDialog.styles';
import { useMutation } from '@apollo/react-hooks';
import { REGISTER } from '../mutations/register';

export interface CreateDoctorDialogProps {
  onClose: () => void;
}

export default function CreateDoctorDialog(props: CreateDoctorDialogProps) {
  const { onClose } = props;
  const { onGetTranslation } = useContext(LocalizationContext);
  const [handleRegister, { loading, error, data }] = useMutation(REGISTER);
  const { register, handleSubmit, watch, errors } = useForm();
  const password = watch('password');
  const confirmPassword = watch('confirmPassword');
  const styles = useStyles({});

  const onSubmit = handleSubmit(
    ({ firstName, lastName, email, password }) => {
      handleRegister({ variables: { firstName, lastName, email, password, role: 'doctor' } });
    }
  );

  useEffect(() => {
    if (data) {
      onClose();
      window.location.reload();
    }
  }, [data])

  return (
    <Dialog
      onClose={onClose}
      open
    >
      <DialogTitle>{onGetTranslation('create-doctor')}</DialogTitle>
      <DialogContent>
        <form
          onSubmit={onSubmit}
          className={styles.form}
        >
          <TextField
            name="firstName"
            label="firstName"
            className={styles.field}
            register={register({ required: 'firstName-required' })}
            error={errors.firstName}
          />
          <TextField
            name="lastName"
            label="lastName"
            className={styles.field}
            register={register({ required: 'lastName-required' })}
            error={errors.lastName}
          />
          <TextField
            type="email"
            name="email"
            label="email"
            className={styles.field}
            register={register({ required: 'email-required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'email-invalid' } })}
            error={errors.email}
          />
          <TextField
            name="password"
            type="password"
            className={styles.field}
            register={register({ required: 'password-required', pattern: { value: new RegExp(`^${confirmPassword}$`), message: 'password-match' } })}
            label="password"
            error={errors.password}
          />
          <TextField
            type="password"
            className={styles.field}
            name="confirmPassword"
            label="confirmPassword"
            register={register({ required: 'password-required', pattern: { value: new RegExp(`^${password}$`), message: 'password-match' } })}
            error={errors.confirmPassword}
          />
          <Button
            type="submit"
            variant="contained"
          >
            {onGetTranslation('create')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
