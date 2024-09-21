import { defineConfig } from '@aiszlab/wasp/vite'

export default defineConfig({
  server: {
    proxy: {
      '/graphql': {
        target: 'http://localhost:3900'
      }
    }
  }
})
