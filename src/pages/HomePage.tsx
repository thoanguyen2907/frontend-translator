import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Translator } from '@/types/Translator'
import { useAppDispatch, useAppSelector } from '../hooks/hooks'
import { fetchAllTranslatorAsync } from '../redux/reducers/translatorsReducer'

import Card from '../components/commons/Card'
import Loading from '../components/commons/Loading'
import Pagination from '../components/commons/Pagination'
import Input from '../components/commons/Input'
import Button from '../components/commons/Button'

export default function HomePage() {
  const { translators, totalItems, isLoading } = useAppSelector((state) => state.translatorReducer)

  const [currentPage, setCurrentPage] = useState(1)
  const [keyword, setKeyword] = useState('')

  const itemsPerPage = 9

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller
    dispatch(fetchAllTranslatorAsync({ offset: currentPage, limit: itemsPerPage, keyword: keyword, signal }))

    return () => {
      controller.abort()
    }
  }, [currentPage])

  const editTranslator = useCallback(
    (id: string, translator: Translator) => {
    navigate(`/translator/edit/${id}`, { state: translator })
  }, [])

  const handlePageChange = useCallback(
    (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }, []) 

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setKeyword(value)
  }, [])

  const handleSearch = useCallback(() => {
    const controller = new AbortController()
    const { signal } = controller
    if (keyword !== '') {
      dispatch(fetchAllTranslatorAsync({ offset: currentPage, limit: itemsPerPage, keyword: keyword, signal }))
    }
    return () => controller.abort()
  }, [keyword, currentPage, itemsPerPage])

  const handleCancel = useCallback(() => {
    const controller = new AbortController()
    const { signal } = controller
    if (keyword !== '') {
      setKeyword('')
      dispatch(fetchAllTranslatorAsync({ offset: currentPage, limit: itemsPerPage, keyword: '', signal }))
    }
    return () => controller.abort()
  }, [keyword, currentPage, itemsPerPage])
   
  const totalPages = useMemo(() =>  Math.ceil(totalItems / itemsPerPage), [totalItems, itemsPerPage])

  if (translators.length === 0 || isLoading) {
    return <Loading />
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div>
        <Input label="Search" name="keyword" onChange={handleChange} value={keyword} /> 
        <Button label="Search" type="button" onClick={handleSearch} />
        <Button label="Cancel" type="button" onClick={handleCancel} />
      </div>
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
