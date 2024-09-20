import { configureStore } from '@reduxjs/toolkit'
import authentication from './authentication'

export const store = configureStore({
  reducer: {
    authentication
  }
})
