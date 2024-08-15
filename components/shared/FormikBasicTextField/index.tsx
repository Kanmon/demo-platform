import { FastField, FastFieldProps } from 'formik'
import { TextField } from '@mui/material'
import React from 'react'
import { StyledBodySmall } from '../StyledTypographyComponents'
import FieldErrorText from '../FieldErrorText'

interface TextFieldProps<FormData> {
  fieldName: keyof FormData & string
  placeholder?: string
  label: React.ReactNode
}

const FormikTextInput = <FormData,>({
  fieldName,
  label,
  placeholder,
}: TextFieldProps<FormData>) => {
  return (
    <FastField name={fieldName}>
      {({ field, meta }: FastFieldProps) => (
        <div>
          <label htmlFor={fieldName}>
            <StyledBodySmall className="mb-1 block">{label}</StyledBodySmall>
          </label>
          <TextField
            {...field}
            id={fieldName}
            className="bg-white w-full"
            name={fieldName}
            type={fieldName}
            variant="outlined"
            value={field.value || ''}
            placeholder={placeholder}
            error={meta.touched && !!meta.error}
          />
          <div className="min-h-6">
            {meta.touched && meta.error && (
              <FieldErrorText
                id={`field-error-${fieldName}`}
                message={meta.error || ''}
              />
            )}
          </div>
        </div>
      )}
    </FastField>
  )
}

export default FormikTextInput
