import { Translator } from '@/types/Translator'
import Card from '../components/commons/Card'
import Loading from '../components/commons/Loading'
import { useAppDispatch, useAppSelector } from '../hooks/hooks'
import { fetchAllTranslatorAsync } from '../redux/reducers/translatorsReducer'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Pagination from '../components/commons/Pagination'

export default function HomePage() {
  const { translators, totalItems, isLoading } = useAppSelector((state) => state.translatorReducer)

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 9

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller
    const offset = (currentPage - 1) * itemsPerPage

    dispatch(fetchAllTranslatorAsync({ offset, limit: itemsPerPage, keyword: '', signal }))

    return () => {
      controller.abort()
    }
  }, [currentPage])

  const editTranslator = (id: string, translator: Translator) => {
    navigate(`/translator/edit/${id}`, { state: translator })
  }

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  if (translators.length === 0 || isLoading) {
    return <Loading />
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {translators.length > 0 ? (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {translators.map((item) => (
              <Card
                key={item.id}
                wordFirstLang={item.wordFirstLang}
                wordSecondLang={item.wordSecondLang}
                sentenceFirstLang={item.sentenceFirstLang}
                sentenceSecondLang={item.sentenceSecondLang}
                button={{ type: 'button', label: 'Edit' }}
                onHandler={() => editTranslator(item.id, item)}
              />
            ))}
          </div>
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      ) : (
        <p className="text-center text-gray-500">No translators available</p>
      )}
    </div>
  )
}
