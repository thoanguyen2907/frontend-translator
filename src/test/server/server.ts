import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

import { TranslatorEdit } from '../../types/Translator'
import { API_URL } from '../../utils/constant'
import { translatorsData } from '../data/translatorsData'

export const handlers = [
  http.patch(`${API_URL}/translators/:id`, async ({ request, params }) => {
    const update = (await request.json()) as TranslatorEdit
    const { id } = params
    const index = translatorsData.findIndex((p) => p.id === id)
    if (index > -1) {
      return HttpResponse.json({ ...translatorsData[index], ...update })
    } else {
      return HttpResponse.json({
        status: 404
      })
    }
  })

]

const server = setupServer(...handlers)

export default server
