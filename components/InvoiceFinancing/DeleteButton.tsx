import React from 'react'

interface DeleteButtonProps {
  onClick: () => void
  numberOfSelectedInvoices: number
}

function DeleteButton({
  numberOfSelectedInvoices,
  onClick,
}: DeleteButtonProps) {
  return (
    <div className={`${numberOfSelectedInvoices < 1 && 'hidden'}`}>
      <div className="flex items-center">
        <div className="hidden xl:block text-sm italic mr-2 whitespace-nowrap">
          <span>{numberOfSelectedInvoices}</span> items selected
        </div>
        <button
          className="btn bg-rose-600 border-slate-200 hover:border-slate-300 text-white hover:bg-rose-800"
          onClick={onClick}
        >
          Delete
        </button>
      </div>
    </div>
  )
}

export default DeleteButton
