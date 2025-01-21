import React from 'react'

interface PaginationProps {
  totalPages: number
  currentPage: number
  onPageChange: (page: number) => void
}

export default function Pagination({ totalPages, currentPage, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null
  
  return (
    <div className="mt-6 flex justify-center space-x-2">
      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index + 1}
          onClick={() => onPageChange(index + 1)}
          className={`px-4 py-2 rounded ${
            currentPage === index + 1
              ? 'bg-blue-500 text-white'
              : 'bg-gray-300 text-gray-800 hover:bg-gray-400'
          }`}>
          {index + 1}
        </button>
      ))}
    </div>
  )
}
