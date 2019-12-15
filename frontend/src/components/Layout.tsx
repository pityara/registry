import React, { useContext } from 'react';
import { AppBar, Toolbar, IconButton, Button, Paper, Typography } from '@material-ui/core';
import { Menu } from '@material-ui/icons'
import LanguagePicker from './controls/LanguagePicker';
import { StylesContext } from '@material-ui/styles/StylesProvider';
import AuthContext from '../contexts/AuthContext';
import LocalizationContext from '../contexts/LocalizationContext';
import LinkButton from './controls/LinkButton';
import useStyles from './Layout.styles';

export default function Layout(props) {
  const { children } = props;
  const styles = useStyles({});
  const { user, onLogout } = useContext(AuthContext);
  console.log(user);
  const { onGetTranslation } = useContext(LocalizationContext);

  return (
    <main className="main">
      <AppBar>
        <Toolbar className="bar">
          <LinkButton
            label="registry"
            href="/"
          />
          <div className="right">
            <LanguagePicker />
            {!user
              ? (
                <>
                  <LinkButton
                    label="login"
                    href="/login"
                  />
                  <LinkButton
                    label="registration"
                    href="/register"
                  />
                </>
              )
              : <div className={styles.auth}>
                {user.role === 'admin' &&
                  <LinkButton
                    href="/users"
                    label="users"
                  />
                }
                <Typography
                  className={styles.hello}
                >
                  {`${onGetTranslation('hello')}, ${user.firstName}!`}
                </Typography>
                <Button
                  onClick={onLogout}
                  variant="contained"
                >
                  {onGetTranslation('logout')}
                </Button>
              </div>
            }
          </div>
        </Toolbar>
      </AppBar>
      <Paper
        className="content"
      >
        {children}
      </Paper>
      <style jsx global>{`
        body {
          min-height: 100vh;
          margin: 0;
        }
        .bar {
          display: flex;
          justify-content: space-between;
        }
        .auth {
          display: flex;
          align-items: center;
        }
        .hello {
          margin: 0 10px;
        }
        .right {
          display: flex;
        }
        .main {
          width: 100%;
          min-height: 100vh;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          background-color: #dedede;
        }
        .content {
          margin:7rem 0;
          padding: 5rem;
          width: 70%;
          display: flex;
          flex-direction: column;
          align-items: center;
        `}
      </style>
    </main>
  )
}
