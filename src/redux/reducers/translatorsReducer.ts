import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios, { AxiosResponse } from 'axios'

import { PaginationQuery } from '@/types/PaginationQuery'
import { Translator, TranslatorEdit, TranslatorResponse } from '@/types/Translator'
import { API_URL } from '../../utils/constant'

const initialState: {
  translators: Translator[]
  totalItems: number
  error?: string | unknown
  isLoading: boolean
} = {
  translators: [],
  totalItems: 0,
  isLoading: false
}

export const fetchAllTranslatorAsync = createAsyncThunk<TranslatorResponse, PaginationQuery>(
  'fetchAllTranslatorAsync',
  async ({ limit, offset, keyword, signal }, { rejectWithValue }) => {
    try {
      const result = await axios.get<any, AxiosResponse<TranslatorResponse>>(
        `${API_URL}/translators?offset=${offset}&limit=${limit}&keyword=${keyword}`,
        { signal }
      )
      return result.data
    } catch (err) {
      const message = err instanceof Error ? err.message : 'error occurred'
      return rejectWithValue(message)
    }
  }
)
export const editTranslatorAsync = createAsyncThunk(
  'editTranslatorAsync',
  async (
    { editTranslator, id }: { editTranslator: TranslatorEdit; id: string | undefined },
    { rejectWithValue }
  ) => {
    try {
      const result = await axios.patch<Translator>(`${API_URL}/translators/${id}`, editTranslator)
      return result.data
    } catch (err) {
      const message = err instanceof Error ? err.message : 'error occurred'
      return rejectWithValue(message)
    }
  }
)

const translatorSlice = createSlice({
  name: 'translators',
  initialState,
  reducers: {
        clearProduct: (state) => {
          state.translators = initialState.translators
          state.totalItems = 0
          state.error = undefined
          state.isLoading = false
        }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllTranslatorAsync.fulfilled, (state, action) => {
      state.translators = action.payload.details.records
      state.totalItems = action.payload.details.totalRecords
      state.isLoading = false
      state.error = undefined
    })
    builder.addCase(fetchAllTranslatorAsync.pending, (state, action) => {
      return {
        ...state,
        isLoading: true
      }
    })
    builder.addCase(fetchAllTranslatorAsync.rejected, (state, action) => {
      return {
        ...state,
        isLoading: false,
        error: action.payload || 'failed to fetch items'
      }
    })
    builder.addCase(editTranslatorAsync.fulfilled, (state, action) => {
      state.translators = state.translators.map((item) =>
        item.id === action.payload.id ? action.payload : item
      )
    })
    builder.addCase(editTranslatorAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(editTranslatorAsync.rejected, (state) => {
      state.isLoading = false
    })
  }
})

const translatorReducer = translatorSlice.reducer
export const { clearProduct } = translatorSlice.actions
export default translatorReducer
