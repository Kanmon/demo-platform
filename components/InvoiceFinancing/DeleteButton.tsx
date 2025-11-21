import React from 'react'
import { CircularProgress } from '@mui/material'

interface DeleteButtonProps {
  onClick: () => void
  numberOfSelectedInvoices: number
  loading?: boolean
}

function DeleteButton({
  numberOfSelectedInvoices,
  onClick,
  loading = false,
}: DeleteButtonProps) {
  return (
    <div className={`${numberOfSelectedInvoices < 1 && 'hidden'}`}>
      <div className="flex items-center">
        <div className="hidden xl:block text-sm italic mr-2 whitespace-nowrap">
          <span>{numberOfSelectedInvoices}</span> items selected
        </div>
        <button
          className="btn bg-rose-600 border-slate-200 hover:border-slate-300 text-white hover:bg-rose-800 flex items-center gap-2"
          onClick={onClick}
          disabled={loading}
        >
          {loading && <CircularProgress size={16} sx={{ color: 'white' }} />}
          Delete
        </button>
      </div>
    </div>
  )
}

export default DeleteButton
