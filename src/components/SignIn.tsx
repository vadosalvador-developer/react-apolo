import React, { useEffect, useState } from 'react';
import axios from 'axios';

import {
  Button,
  TextField,
  Container,
  CssBaseline,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';

//--------------------пошел материал ui-------------------//
const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

// -----------------------------основная функция--------------------------//
const SignIn: React.FC = () => {
  useEffect(() => {
    localStorage.clear();
  }, []);

  const history = useHistory();
  const handleClick = () => {
    history.push('/partner_cabinet');
  };

  //--------------------авторизация-----------------------//
  const getToken = () => {
    // тело запроса
    const bodyRequest = {
      username: username,
      password: password,
    };
    // преобразую в строку
    const jsonBodyRequest = JSON.stringify(bodyRequest);

    // запрос на получения токена
    axios
      .post('http://auth.dev.service.app11.io/auth/login/token/get', jsonBodyRequest, {
        headers: {
          'content-type': 'application/json',
        },
      })
      .then((result) => {
        const username = JSON.parse(result.config.data).username;
        if (result.statusText === 'OK') {
          localStorage.setItem('token', result.data.token);
          localStorage.setItem('dataUser', username);
          handleClick();
        }
      }) //если все ок, сохраняю токен в локальное хранилище
      .catch((error) => console.log(error));
  };

  const classes = useStyles();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  console.log(username);
  // рендер
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Вход
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            name="username"
            label="Логин"
            autoFocus
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            name="password"
            label="Пароль"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={getToken}>
            Войти
          </Button>
        </form>
      </div>
    </Container>
  );
};

export default SignIn;
