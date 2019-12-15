import React from 'react'
import App from 'next/app'
import ApolloClient from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from '@apollo/react-hooks';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import fetch from 'isomorphic-unfetch';
import { LocalizationContextProvider } from '../src/contexts/LocalizationContext'
import Layout from '../src/components/Layout'
import { AuthContextProvider } from '../src/contexts/AuthContext';
import isServer from '../src/helpers/isServer';
const link = createHttpLink({
  fetch,
  uri: 'http://localhost:4000'
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = !isServer() && localStorage.getItem('token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(link),
  cache: new InMemoryCache()
});

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props
    return (
      <ApolloProvider client={client}>
        <LocalizationContextProvider>
          <MuiPickersUtilsProvider
            utils={DateFnsUtils}
          >
            <AuthContextProvider>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </AuthContextProvider>
          </MuiPickersUtilsProvider>
        </LocalizationContextProvider>
      </ApolloProvider>
    )
  }
}

export default MyApp
