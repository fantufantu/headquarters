import { ConfigProvider, ThemeProvider } from 'musae'
import { ApolloProvider } from '@apollo/client'
import { client } from './api'
import { useLocalStorageState } from '@aiszlab/relax'
import { AuthenticationToken } from './storage/tokens'
import { useMounted } from '@aiszlab/relax'
import { useState } from 'react'
import { useWho } from './hooks/authentication.hooks'
import { type ApplicationProps } from '@aiszlab/bee'

const Application = ({ children }: ApplicationProps) => {
  const [_authenticated] = useLocalStorageState(AuthenticationToken.Authenticated)
  const [isLoading, setIsLoading] = useState(true)
  const { whoAmI } = useWho()

  useMounted(async () => {
    if (_authenticated) {
      await whoAmI(_authenticated)
    }
    setIsLoading(false)
  })

  if (isLoading) {
    return null
  }

  return (
    <ApolloProvider client={client}>
      <ConfigProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </ConfigProvider>
    </ApolloProvider>
  )
}

export default Application
