import { MenuItem, Select } from '@mui/material'
import classNames from 'classnames'
import { FastFieldProps, Field } from 'formik'
import React from 'react'
import FieldErrorText from '../FieldErrorText'
import { StyledBodySmall } from '../StyledTypographyComponents'

interface Options {
  label: React.ReactNode
  value: string
}

interface SelectFieldProps<FormData> {
  fieldName: keyof FormData & string
  placeholder?: string
  label: React.ReactNode
  options: Options[]
  includeNone?: boolean
  labelStyles?: string
  containerClass?: string
  disabled?: boolean
  multiple?: boolean
}

const defaultCss = 'mb-1 block text-left font-light'

const FormikSelectInput = <FormData,>({
  fieldName,
  label,
  placeholder,
  options,
  includeNone,
  labelStyles,
  containerClass,
  disabled,
  multiple,
}: SelectFieldProps<FormData>) => {
  return (
    <Field name={fieldName}>
      {({ field, meta, form }: FastFieldProps) => {
        return (
          <div className={classNames(containerClass || '')}>
            <label id={fieldName} htmlFor={fieldName}>
              <StyledBodySmall
                className={classNames(
                  labelStyles ? `${labelStyles}` : `${defaultCss}`,
                )}
              >
                {label}
              </StyledBodySmall>
            </label>
            <Select
              {...field}
              id={fieldName}
              multiple={multiple}
              disabled={disabled}
              value={field.value || ''}
              name={fieldName}
              placeholder={placeholder}
              error={meta.touched && !!meta.error}
              className="bg-white w-full"
              onChange={(e) => {
                const value = e.target.value
                form.setFieldValue(fieldName, value === '' ? null : value)
              }}
              sx={{
                textAlign: 'left',
              }}
            >
              {includeNone && (
                <MenuItem value={''}>
                  <em>None</em>
                </MenuItem>
              )}
              {options.map((item, index) => (
                <MenuItem key={`${fieldName}_${index}`} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
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
    </Field>
  )
}

export default FormikSelectInput
