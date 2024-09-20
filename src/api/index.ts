import { ApolloClient, from, HttpLink, InMemoryCache } from '@apollo/client'
import { createSelector } from '@reduxjs/toolkit'
import { store } from '../storage'

const client = new ApolloClient({
  uri: '/graphql',
  cache: new InMemoryCache(),
  link: from([
    new HttpLink({
      uri: 'http://localhost:4000/graphql',
      fetch: (uri, options) => {
        const _token = store.getState().authentication.token
        const _headers = new Headers(options?.headers)

        _token && _headers.append('Authorization', _token)

        return fetch(uri, {
          ...options,
          headers: Array.from(_headers.entries())
        })
      }
    })
  ])
})

export { client }
