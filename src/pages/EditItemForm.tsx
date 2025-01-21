import { useCallback } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

import { useAppDispatch, useAppSelector } from '../hooks/hooks'
import { editTranslatorAsync } from '../redux/reducers/translatorsReducer'

import { TranslatorEdit } from '@/types/Translator'
import Input from '../components/commons/Input'
import Button from '../components/commons/Button'

const validationSchema = Yup.object({
  wordFirstLang: Yup.string().required('wordFirstLang is required'),
  sentenceFirstLang: Yup.string().required('sentenceFirstLang is required'),
  wordSecondLang: Yup.string().required('wordSecondLang is required'),
  sentenceSecondLang: Yup.string().required('sentenceSecondLang is required')
})

export default function EditItemForm() {
  const { isLoading } = useAppSelector((state) => state.translatorReducer)

  const { state } = useLocation()
  const { id } = useParams<string>()

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    defaultValues: state,
    resolver: yupResolver(validationSchema)
  })

  const onSubmit = useCallback((data: TranslatorEdit) => {
    dispatch(editTranslatorAsync({ editTranslator: data, id }))
    navigate('/')
  }, [id])

  if (isLoading) {
    return <p>Loading ...</p>
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg px-4">
        <h2 className="text-center font-bold text-xl">Edit Product Form</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="wordFirstLang"
            control={control}
            render={({ field: { ref, ...field } }) => (
              <Input
                {...field}
                name={'wordFirstLang'}
                label="wordFirstLang"
                value={field.value}
                onChange={field.onChange}
                error={errors.wordFirstLang?.message}
              />
            )}
          />
          <Controller
            name="sentenceFirstLang"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="sentenceFirstLang"
                name={'sentenceFirstLang'}
                value={field.value}
                onChange={field.onChange}
                error={errors.sentenceFirstLang?.message}
              />
            )}
          />
          <Controller
            name="wordSecondLang"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="wordSecondLang"
                name={'wordSecondLang'}
                value={field.value}
                onChange={field.onChange}
                error={errors.wordSecondLang?.message}
              />
            )}
          />
          <Controller
            name="sentenceSecondLang"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="sentenceSecondLang"
                name={'sentenceSecondLang'}
                value={field.value}
                onChange={field.onChange}
                error={errors.sentenceSecondLang?.message}
              />
            )}
          />
          <Button label={'submit'} type={'submit'} />
        </form>
      </div>
    </div>
  )
}
