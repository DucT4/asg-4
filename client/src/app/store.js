import { configureStore } from '@reduxjs/toolkit'

import authReducer from '../features/auth/authSlice'
import quizReducer from '../features/quizzes/quizSlice'
import attemptReducer from '../features/attempts/attemptSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    quizzes: quizReducer,
    attempts: attemptReducer
  }
})

export default store
