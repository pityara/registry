import React, { useContext, useEffect } from 'react';
import useForm from 'react-hook-form';
import TextField from './controls/TextField';
import { Button, Typography } from '@material-ui/core';
import LocalizationContext from '../contexts/LocalizationContext';
import { useMutation } from '@apollo/react-hooks';
import { LOGIN } from '../mutations/login';
import AuthContext from '../contexts/AuthContext';

export default function LoginPage() {
  const { register, errors, handleSubmit } = useForm();
  const { onGetTranslation } = useContext(LocalizationContext);
  const { onChangeUser } = useContext(AuthContext);
  const [handleLogin, { data, error, loading }] = useMutation(LOGIN);

  const onSubmit = ({ email, password }) => {
    handleLogin({ variables: { email, password } });
  }

  useEffect(() => {
    if (data && data.login && data.login.user) {
      const { user } = data.login;
      onChangeUser(user);
      localStorage.setItem('token', user.accessToken);
    }
  }, [data]);

  if (loading) return <p>{onGetTranslation('loading')}</p>;

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="form"
      >
        <TextField
          name="email"
          register={register({ required: 'email-required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'email-invalid' } })}
          error={errors.email}
          className="field"
          type="email"
          label="email"
        />
        <TextField
          name="password"
          type="password"
          className="field"
          register={register({ required: 'password-required', })}
          label="password"
          error={errors.password}
        />
        {data && data.login && !data.login.success &&
          <Typography className="error">
            {onGetTranslation('invalid-credentials')}
          </Typography>}
        <Button
          type="submit"
          className="button"

        >
          {onGetTranslation('login')}
        </Button>
      </form>
      <style jsx global>
        {`
        .form {
          width: 20rem;
          display: flex;
          align-items: center;
          flex-direction: column;
        }

        .field {
          width: 100% !important;
          margin-bottom: 3rem !important;
        }

        .button {
          width: 100%;
        }

        .error {
          color: red !important;
          font-size: 12px;
          text-align: center;
        }
      `}
      </style>
    </>
  );
}
