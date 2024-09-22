import { ApolloClient, from, HttpLink, InMemoryCache } from '@apollo/client'
import { store } from '../storage'
import { onError } from '@apollo/client/link/error'
import { Notification } from 'musae'

const client = new ApolloClient({
  cache: new InMemoryCache(),

  link: from([
    onError(({ graphQLErrors, networkError }) => {
      const errorMessage = graphQLErrors?.[0].message ?? networkError?.message
      if (!errorMessage) return

      Notification.error({
        title: '接口调用异常！',
        description: errorMessage
      })
    }),
    new HttpLink({
      uri: '/graphql',
      fetch: (uri, options) => {
        const _authenticated = store.getState().authentication.authenticated
        const _headers = new Headers(options?.headers)

        _authenticated && _headers.append('Authorization', `Bearer ${_authenticated}`)

        return fetch(uri, {
          ...options,
          headers: Array.from(_headers.entries())
        })
      }
    })
  ])
})

export { client }