import React, { createContext, useState } from 'react'
import Amplify, { Auth, AuthClass } from 'aws-amplify'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { onError, ErrorResponse } from 'apollo-link-error'
import { ApolloLink, split } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import { setContext } from 'apollo-link-context'
import { ApolloProvider } from '@apollo/react-hooks'
import { CognitoUser } from '@aws-amplify/auth'

interface AppContext {
  Auth: AuthClass
  user?: CognitoUser
  setUser: (user?: CognitoUser) => void
}

interface AppConfig {
  region: string
  userPoolId: string
  userPoolWebClientId: string
  graphQlUrl: string
  graphQlApiKey?: string
}

interface AppProviderProps {
  children: JSX.Element[] | JSX.Element
  config: AppConfig
  shouldEnableWebSockets?: boolean
  onLinkError: (error: ErrorResponse) => void
}

export { AppContext, AppProvider }

const AppContext: React.Context<AppContext> = createContext({
  Auth,
  setUser: _ => {},
})

function AppProvider({
  children,
  shouldEnableWebSockets = false,
  config: { region, userPoolId, userPoolWebClientId, graphQlUrl, graphQlApiKey },
  onLinkError = _ => {},
}: AppProviderProps): JSX.Element {
  Amplify.configure({
    Auth: {
      region,
      userPoolId,
      userPoolWebClientId,
    },
  })

  const [user, setUser] = useState<CognitoUser>()
  const httpLink = new HttpLink({ uri: graphQlUrl })
  const wsLink = new WebSocketLink({
    uri: graphQlUrl.replace('https://', 'wss://').replace('http://', 'ws://'),
    options: {
      reconnect: true,
      lazy: true,
    },
  })
  const link = split(
    ({ query }) => {
      const definition = getMainDefinition(query)
      return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
    },
    wsLink,
    httpLink
  )
  const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('token')
    return token
      ? {
          headers: {
            authorization: token,
            ...headers,
          },
        }
      : {
          headers: {
            'x-api-key': graphQlApiKey,
            ...headers,
          },
        }
  })
  const errorLink = onError(error => {
    console.error(error)
    onLinkError(error)
  })

  const client = new ApolloClient({
    link: ApolloLink.from([errorLink, authLink, shouldEnableWebSockets ? link : httpLink]),
    cache: new InMemoryCache(),
  })

  const value = {
    Auth,
    user,
    setUser,
  }

  return (
    <ApolloProvider client={client}>
      <AppContext.Provider value={value}>{children}</AppContext.Provider>
    </ApolloProvider>
  )
}
