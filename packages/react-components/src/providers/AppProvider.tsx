import React, { createContext, useState } from 'react'
import Amplify, { Auth, AuthClass } from 'aws-amplify'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { onError, ErrorResponse } from 'apollo-link-error'
import { ApolloLink } from 'apollo-link'
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
  onLinkError: (error: ErrorResponse) => void
}

export { AppContext, AppProvider }

const AppContext: React.Context<AppContext> = createContext({
  Auth,
  setUser: _ => {},
})

function AppProvider({
  children,
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
    link: ApolloLink.from([errorLink, authLink, httpLink]),
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
