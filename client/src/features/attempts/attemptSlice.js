import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import http, { getErrorMessage } from '../../api/http'

const initialState = {
  latestResult: null,
  attempts: [],
  loading: false,
  error: null
}

export const submitQuiz = createAsyncThunk('attempts/submit', async (payload, { rejectWithValue }) => {
  try {
    const response = await http.post('/attempts/submit', payload)
    return response.data.data
  } catch (error) {
    return rejectWithValue(getErrorMessage(error))
  }
})

export const fetchMyAttempts = createAsyncThunk('attempts/me', async (_, { rejectWithValue }) => {
  try {
    const response = await http.get('/attempts/me')
    return response.data.data.attempts
  } catch (error) {
    return rejectWithValue(getErrorMessage(error))
  }
})

const attemptSlice = createSlice({
  name: 'attempts',
  initialState,
  reducers: {
    clearLatestResult: (state) => {
      state.latestResult = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitQuiz.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(submitQuiz.fulfilled, (state, action) => {
        state.loading = false
        state.latestResult = action.payload.result
      })
      .addCase(submitQuiz.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchMyAttempts.fulfilled, (state, action) => {
        state.attempts = action.payload
      })
  }
})

export const { clearLatestResult } = attemptSlice.actions
export default attemptSlice.reducer
