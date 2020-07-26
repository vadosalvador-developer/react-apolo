import React, { useEffect, useState } from 'react';

import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache, gql } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  makeStyles,
  Theme,
  createStyles,
  AppBar,
  Toolbar,
  Button,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useHistory } from 'react-router-dom';

// материал ui
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  }),
);

// точка доступа
const httpLink = createHttpLink({
  uri: 'https://partner.dev.service.app11.io/partner/graphql',
});

// авторизация
const authLink = setContext((_, { headers }) => {
  // токен
  const token = localStorage.getItem('token');
  // возвращаю заголовок в контекст, чтобы httpLink смог их прочитать
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// инициализирую Аполло клиент
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

// основная функция
const PartnerCabinet: React.FC = () => {
  const classes = useStyles();

  const history = useHistory();
  const handleClick = () => {
    history.push('/');
  };

  const Logout = () => {
    localStorage.clear();
    handleClick();
  };

  const [partner, setPartner] = useState([]);

  useEffect(() => {
    client
      .query({
        query: gql`
          query getPartners {
            partners {
              edges {
                node {
                  id
                  name
                }
                __typename
              }
            }
          }
        `,
      })
      .then((result) => {
        const data = result.data.partners.edges;
        const dataPartner = data.map((element: any, key: string) => {
          const id = element.node.id;
          return (
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header">
                <Typography className={classes.heading}>
                  Имя партнера: {element.node.name}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>ID Партнера: {id.slice(18)}</Typography>
              </AccordionDetails>
            </Accordion>
          );
        });
        setPartner(dataPartner);
      });
  }, []);

  console.log(partner);
  // рендер
  return (
    <ApolloProvider client={client}>
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              AquaDelivery
            </Typography>
            <Typography variant="h6" className={classes.title}>
              {localStorage.getItem('dataUser')}
            </Typography>
            <Button color="inherit" onClick={Logout}>
              Выход
            </Button>
          </Toolbar>
        </AppBar>
        {partner}
      </div>
    </ApolloProvider>
  );
};

export default PartnerCabinet;
