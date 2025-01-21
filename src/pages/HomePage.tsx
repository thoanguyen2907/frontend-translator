import { Translator } from '@/types/Translator'
import Card from '../components/commons/Card'
import Loading from '../components/commons/Loading'
import { useAppDispatch, useAppSelector } from '../hooks/hooks'
import { fetchAllTranslatorAsync } from '../redux/reducers/translatorsReducer'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function HomePage() {
  const { translators, isLoading } = useAppSelector((state) => state.translatorReducer)

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

    useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller

    dispatch(fetchAllTranslatorAsync({ offset: 0, limit: 10, keyword: "", signal }))

    return () => {
      controller.abort()
    }
  }, [])

    const editTranslator = (id: string, translator: Translator) => {
    navigate(`/translator/edit/${id}`, { state:  translator})
  }

 if (translators.length === 0 || isLoading) {
    return <Loading />
  }


  return <div className="p-6 bg-gray-100 min-h-screen">
  {translators.length > 0 ? (
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
  ) : (
    <p className="text-center text-gray-500">No translators available</p>
  )}
</div>

}
