import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { Who } from '../api/authentication.type'
import { client } from '../api'
import { WHO_AM_I } from '../api/authentication'
import { AuthenticationToken, StorageToken } from './tokens'
import { random } from '@aiszlab/fuzzy/dist/avatar'

interface Authentication {
  authenticated: string | null
  me: Who | null
}

const whoAmI = createAsyncThunk(AuthenticationToken.WhoAmI, async () => {
  const me = (await client.query({ query: WHO_AM_I }).catch(() => null))?.data.whoAmI ?? null
  if (!me) return null

  return {
    ...me,
    ...(!me.avatar && {
      avatar: await random({ color: `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}})` })
    })
  }
})

const authentication = createSlice({
  name: StorageToken.Authentication,
  initialState: (): Authentication => ({
    authenticated: window.localStorage.getItem(AuthenticationToken.Authenticated),
    me: null
  }),
  reducers: {
    authenticate: (state, { payload }: { payload: string }) => {
      state.authenticated = payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(whoAmI.fulfilled, (state, action) => {
      state.me = action.payload
    })
  }
})

export const { authenticate } = authentication.actions
export { whoAmI }
export default authentication.reducer
