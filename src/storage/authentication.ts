import { createSlice } from '@reduxjs/toolkit'
import type { Who } from '../api/authentication.type'
import { client } from '../api'
import { WHO_AM_I } from '../api/authentication'

interface Authentication {
  token?: string | null
  who?: Who
}

const authentication = createSlice({
  name: 'authentication',
  initialState: (): Authentication => ({
    token: window.localStorage.getItem('')
  }),
  reducers: {
    whoAmI: () => {
      client.query({ query: WHO_AM_I })
    }
  }
})

export const { whoAmI } = authentication.actions
export default authentication.reducer
