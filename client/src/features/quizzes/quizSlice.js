import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import http, { getErrorMessage } from '../../api/http'

const initialState = {
  items: [],
  selectedQuiz: null,
  questions: [],
  loading: false,
  error: null
}

export const fetchQuizzes = createAsyncThunk('quizzes/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await http.get('/quizzes')
    return response.data.data.quizzes
  } catch (error) {
    return rejectWithValue(getErrorMessage(error))
  }
})

export const fetchQuiz = createAsyncThunk('quizzes/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const response = await http.get(`/quizzes/${id}`)
    return response.data.data.quiz
  } catch (error) {
    return rejectWithValue(getErrorMessage(error))
  }
})

export const createQuiz = createAsyncThunk('quizzes/create', async (payload, { rejectWithValue }) => {
  try {
    const response = await http.post('/quizzes', payload)
    return response.data.data.quiz
  } catch (error) {
    return rejectWithValue(getErrorMessage(error))
  }
})

export const updateQuiz = createAsyncThunk('quizzes/update', async ({ id, ...payload }, { rejectWithValue }) => {
  try {
    const response = await http.put(`/quizzes/${id}`, payload)
    return response.data.data.quiz
  } catch (error) {
    return rejectWithValue(getErrorMessage(error))
  }
})

export const deleteQuiz = createAsyncThunk('quizzes/delete', async (id, { rejectWithValue }) => {
  try {
    await http.delete(`/quizzes/${id}`)
    return id
  } catch (error) {
    return rejectWithValue(getErrorMessage(error))
  }
})

export const fetchQuestions = createAsyncThunk('questions/fetchAll', async (quizId, { rejectWithValue }) => {
  try {
    const response = await http.get('/questions', { params: quizId ? { quizId } : {} })
    return response.data.data.questions
  } catch (error) {
    return rejectWithValue(getErrorMessage(error))
  }
})

export const createQuestion = createAsyncThunk('questions/create', async (payload, { rejectWithValue }) => {
  try {
    const response = await http.post('/questions', payload)
    return response.data.data.question
  } catch (error) {
    return rejectWithValue(getErrorMessage(error))
  }
})

export const deleteQuestion = createAsyncThunk('questions/delete', async (id, { rejectWithValue }) => {
  try {
    await http.delete(`/questions/${id}`)
    return id
  } catch (error) {
    return rejectWithValue(getErrorMessage(error))
  }
})

const quizSlice = createSlice({
  name: 'quizzes',
  initialState,
  reducers: {
    clearQuizError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuizzes.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchQuizzes.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchQuizzes.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchQuiz.fulfilled, (state, action) => {
        state.selectedQuiz = action.payload
      })
      .addCase(createQuiz.fulfilled, (state, action) => {
        state.items.unshift(action.payload)
      })
      .addCase(updateQuiz.fulfilled, (state, action) => {
        state.items = state.items.map((quiz) => quiz._id === action.payload._id ? action.payload : quiz)
      })
      .addCase(deleteQuiz.fulfilled, (state, action) => {
        state.items = state.items.filter((quiz) => quiz._id !== action.payload && quiz.id !== action.payload)
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.questions = action.payload
      })
      .addCase(createQuestion.fulfilled, (state, action) => {
        state.questions.unshift(action.payload)
      })
      .addCase(deleteQuestion.fulfilled, (state, action) => {
        state.questions = state.questions.filter((question) => question._id !== action.payload)
      })
  }
})

export const { clearQuizError } = quizSlice.actions
export default quizSlice.reducer
