import React from 'react'
import Button from './Button'

interface CardProps {
  wordFirstLang: string
  sentenceFirstLang: string
  wordSecondLang: string
  sentenceSecondLang: string
  button: {
    label: string
    type: 'button' | 'submit'
  }
  onHandler: () => void
}

export default function Card({
 wordFirstLang, 
 sentenceFirstLang,
 wordSecondLang,
 sentenceSecondLang,
  button,
  onHandler
}: CardProps) {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 max-w-sm border border-gray-200">
      <h2 className="text-lg font-bold text-gray-800">{wordFirstLang}</h2>
      <p className="text-gray-600 mt-2">sentenceFirstLang: {sentenceFirstLang}</p>
      <p className="text-gray-600 mt-2">wordSecondLang: {wordSecondLang}</p>
      <p className="text-gray-600 mt-2">sentenceSecondLang:{sentenceSecondLang}</p>
      <div className="mt-4">
        <Button onClick={onHandler} type={button.type} label={button.label} />
      </div>
    </div>
  )
}
