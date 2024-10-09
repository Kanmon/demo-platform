import InputMask, { Props } from 'react-input-mask'

import { TextField } from '@mui/material'
import { DateTime } from 'luxon'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { updateInvoice } from '../../store/apiInvoicesSlice'
import { formatUTCISODate, renderValueAsDate } from '../../utils'
import { PlatformInvoice } from '../../types/DemoInvoicesTypes'

interface InputProps extends Omit<Props, 'children'> {
  children?: (inputProps: any) => JSX.Element
}

const InputMaskFixed = InputMask as unknown as React.FC<InputProps>

const EditableDateField = ({
  invoice,
  field,
}: {
  invoice: PlatformInvoice
  field: 'dueDateIsoDate' | 'createdAtIsoDate'
}) => {
  const dispatch = useDispatch()
  const [focused, setFocused] = useState(false)
  const [value, setValue] = useState(
    formatUTCISODate(invoice[field] as string, 'MM/dd/yyyy'),
  )

  useEffect(() => {
    setValue(formatUTCISODate(invoice[field] as string, 'MM/dd/yyyy'))
  }, [invoice, field])

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('e.target.value', e.target.value)
    const value = e.target.value

    setValue(value)
  }

  const onBlur = () => {
    if (value === '__/__/____') {
      dispatch(
        updateInvoice({
          invoice: {
            ...invoice,
            [field]: null,
          },
        }),
      )
    } else {
      const dateTime = DateTime.fromFormat(value, 'MM/dd/yyyy')

      if (dateTime.isValid) {
        dispatch(
          updateInvoice({
            invoice: {
              ...invoice,
              [field]: dateTime.toISODate(),
            },
          }),
        )
      } else {
        setValue(formatUTCISODate(invoice[field] as string, 'MM/dd/yyyy'))
      }
    }

    setFocused(false)
  }

  console.log('value', field, value)

  return focused ? (
    <InputMaskFixed
      mask={'99/99/9999'}
      autoFocus
      value={value}
      onChange={onChange}
      onBlur={onBlur}
    >
      {(inputProps: any) => (
        <TextField
          {...inputProps}
          inputProps={{
            style: {
              padding: '10px',
            },
          }}
          InputProps={{
            style: {
              letterSpacing: '0.8px',
            },
          }}
          className="bg-white w-[110px]"
          variant="outlined"
          placeholder={'__/__/____'}
        />
      )}
    </InputMaskFixed>
  ) : (
    <div
      className="w-[110px]"
      onClick={() => {
        setFocused(true)
      }}
    >
      {renderValueAsDate(invoice[field])}
    </div>
  )
}

export default EditableDateField
