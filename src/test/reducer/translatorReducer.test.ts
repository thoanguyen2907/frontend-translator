import { createStore } from '../../redux/store'
import server from '../server/server'

import {
  editTranslatorAsync,
  fetchAllTranslatorAsync
} from '../../redux/reducers/translatorsReducer'
import { TranslatorEdit } from '@/types/Translator'

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }))
afterAll(() => server.close())
afterEach(() => server.resetHandlers())

let store = createStore()

beforeEach(() => {
  store = createStore({
    translatorReducer: {
      translators: [
        {
          id: '1',
          wordFirstLang: 'house',
          sentenceFirstLang: 'This is a house.',
          wordSecondLang: 'casa',
          sentenceSecondLang: 'Esta es una casa.'
        }
      ]
    }
  })
})

describe('test normal action in translatorReducer', () => {
  test('shoudl return initial state', () => {
    expect(store.getState().translatorReducer.translators).toMatchObject([
      {
        id: '1',
        wordFirstLang: 'house',
        sentenceFirstLang: 'This is a house.',
        wordSecondLang: 'casa',
        sentenceSecondLang: 'Esta es una casa.'
      }
    ])
  })
})
describe('test async thunk actions in translatorReducer', () => {
  test('Should fetch all translators with pagination', async () => {
    const controller = new AbortController()
    const { signal } = controller
    await store.dispatch(fetchAllTranslatorAsync({ limit: 5, offset: 0, keyword: '', signal }))
    expect(store.getState().translatorReducer.translators.length).toBe(5)
  })
  test('Should return no translators if keyword does not match', async () => {
    const controller = new AbortController()
    const { signal } = controller

    await store.dispatch(fetchAllTranslatorAsync({ limit: 5, offset: 0, keyword: 'no', signal }))

    const translators = store.getState().translatorReducer.translators
    expect(translators.length).toBe(0)
  })
  test('Should translators if matching the keyword', async () => {
    const controller = new AbortController()
    const { signal } = controller

    await store.dispatch(fetchAllTranslatorAsync({ limit: 5, offset: 0, keyword: 'a', signal }))

    const translators = store.getState().translatorReducer.translators
    expect(translators.length).toBeGreaterThan(1)
  })

  test('Should update product with id', async () => {
    const id: string = '1'
    const input: TranslatorEdit = {
      wordFirstLang: 'car',
      sentenceFirstLang: 'This is a car.',
      wordSecondLang: 'casa',
      sentenceSecondLang: 'Esta es una casa.'
    }
    await store.dispatch(editTranslatorAsync({ editTranslator: input, id: id }))

    const updatedTranslator = store
      .getState()
      .translatorReducer.translators.find((item) => item.id == id)

    expect(updatedTranslator).toMatchObject({
      id,
      ...input
    })
    expect(updatedTranslator).toBeTruthy()
    expect(updatedTranslator?.sentenceFirstLang).toBe('This is a car.')
  })
})
