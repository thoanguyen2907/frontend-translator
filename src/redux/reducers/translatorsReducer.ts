import { PaginationQuery } from '@/types/PaginationQuery'
import { Translator, TranslatorEdit, TranslatorResponse } from '@/types/Translator'
import { API_URL } from '../../utils/constant'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios, { AxiosResponse } from 'axios'

const initialState: {
  translators: Translator[]
  error?: string | unknown
  isLoading: boolean
} = {
  translators: [],
  isLoading: false
}

export const fetchAllTranslatorAsync = createAsyncThunk<Translator[], PaginationQuery>(
  'fetchAllTranslatorAsync',
  async ({ limit, offset, keyword, signal }, { rejectWithValue }) => {
    try {
      const result = await axios.get<any, AxiosResponse<TranslatorResponse>>(
        `${API_URL}/translators?offset=${offset}&limit=${limit}&keyword=${keyword}`,
        { signal }
      )
      console.log("result ", result)
      return result.data?.details?.records
    } catch (err) {
      const message = err instanceof Error ? err.message : 'error occurred'
      return rejectWithValue(message)
    }
  }
)
export const editTranslatorAsync = createAsyncThunk(
  'editTranslatorAsync',
  async ({ editTranslator, id }: { editTranslator: TranslatorEdit; id: string | undefined }, { rejectWithValue }) => {
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
//     clearProduct: (state) => {
//       state.product = initialState.product
//       state.error = undefined
//       state.isLoading = false
//     }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllTranslatorAsync.fulfilled, (state, action) => {
      state.translators = action.payload
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
export default translatorReducer
