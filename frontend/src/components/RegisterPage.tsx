import React, { useContext, useCallback, useEffect } from 'react';
import { Button, Typography } from '@material-ui/core';
import TextField from './controls/TextField';
import useForm from 'react-hook-form'
import LocalizationContext from '../contexts/LocalizationContext';
import { useMutation } from '@apollo/react-hooks';
import { REGISTER } from '../mutations/register';
import Router from 'next/router';
import AuthContext from '../contexts/AuthContext';

export default function RegisterPage() {
  const { register, handleSubmit, watch, errors } = useForm();
  const [handleRegister, { loading, error, data }] = useMutation(REGISTER);
  const password = watch('password');
  const confirmPassword = watch('confirmPassword');
  const { onGetTranslation } = useContext(LocalizationContext);
  const { onChangeUser } = useContext(AuthContext);

  useEffect(() => {
    if (data && data.register.success) {
      onChangeUser(data.register.user);
      localStorage.setItem('token', data.register.user.accessToken);
      Router.push('/');
    }
  }, [data]);

  const onSubmit = handleSubmit(({ firstName, lastName, email, password }) => {
    handleRegister({ variables: { firstName, lastName, email, password } });
  });

  if (loading) return <p>{onGetTranslation('loading')}</p>;
  if (error) return <p>{onGetTranslation('error')}</p>;

  return (
    <>
      <Typography variant="h3" className="title" >
        {onGetTranslation('registerPatient')}
      </Typography>
      <form
        onSubmit={onSubmit}
        className="form"
      >
        <TextField
          name="firstName"
          label="firstName"
          className="field"
          register={register({ required: 'firstName-required' })}
          error={errors.firstName}
        />
        <TextField
          name="lastName"
          label="lastName"
          className="field"
          register={register({ required: 'lastName-required' })}
          error={errors.lastName}
        />
        <TextField
          type="email"
          name="email"
          label="email"
          className="field"
          register={register({ required: 'email-required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'email-invalid' } })}
          error={errors.email}
        />
        <TextField
          name="password"
          type="password"
          className="field"
          register={register({ required: 'password-required', pattern: { value: new RegExp(`^${confirmPassword}$`), message: 'password-match' } })}
          label="password"
          error={errors.password}
        />
        <TextField
          type="password"
          className="field"
          name="confirmPassword"
          label="confirmPassword"
          register={register({ required: 'password-required', pattern: { value: new RegExp(`^${password}$`), message: 'password-match' } })}
          error={errors.confirmPassword}
        />
        <Button
          type="submit"
          variant="contained"
        >
          {onGetTranslation('register')}
        </Button>
      </form>
      <style jsx global>{`
        .form {
          margin: 5rem 0;
          width: 20rem;
          display: flex;
          flex-direction: column;
        }

        .title {
          text-align: center;
        }

        .field {
          margin-bottom: 3rem !important;
        }
      `}</style>
    </>
  );
}
