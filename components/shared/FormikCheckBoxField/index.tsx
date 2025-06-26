import { Checkbox } from '@mui/material'
import classNames from 'classnames'
import { FastField, FastFieldProps } from 'formik'
import React from 'react'
import FieldErrorText from '../FieldErrorText'
import { StyledBodySmall } from '../StyledTypographyComponents'

interface CheckboxFieldProps<FormData> {
  fieldName: keyof FormData & string
  label: React.ReactNode
  labelStyles?: string
  containerClass?: string
  disabled?: boolean
}

const defaultCss = 'ml-2 text-left font-light'

const FormikCheckboxInput = <FormData,>({
  fieldName,
  label,
  labelStyles,
  containerClass,
  disabled,
}: CheckboxFieldProps<FormData>) => {
  return (
    <FastField name={fieldName}>
      {({ field, meta, form }: FastFieldProps) => {
        return (
          <div className={classNames(containerClass || '')}>
            <div className="flex items-center">
              <Checkbox
                {...field}
                id={fieldName}
                disabled={disabled}
                checked={field.value || false}
                name={fieldName}
                onChange={(e) => {
                  form.setFieldValue(fieldName, e.target.checked)
                }}
                sx={{
                  padding: 0,
                  marginRight: 1,
                  textAlign: 'left',
                }}
              />
              <label htmlFor={fieldName} className="mb-0">
                <StyledBodySmall
                  className={classNames(
                    labelStyles ? `${labelStyles}` : `${defaultCss}`,
                  )}
                >
                  {label}
                </StyledBodySmall>
              </label>
            </div>
            <div className="min-h-6">
              {meta.touched && meta.error && (
                <FieldErrorText
                  id={`field-error-${fieldName}`}
                  message={meta.error || ''}
                />
              )}
            </div>
          </div>
        )
      }}
    </FastField>
  )
}

export default FormikCheckboxInput
