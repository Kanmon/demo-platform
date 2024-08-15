import { FastField, FastFieldProps } from 'formik'
import { SxProps, TextField } from '@mui/material'
import React, { HTMLInputTypeAttribute } from 'react'
import FieldErrorText from '../FieldErrorText'
import mergeCssClasses, {
  CssClassUpdater,
} from '../../../utils/mergeCssClasses'
import { StyledBodySmall } from '../StyledTypographyComponents'

interface TextFieldProps<FormData> {
  fieldName: keyof FormData & string
  placeholder?: string
  hideLabel?: boolean
  label?: React.ReactNode
  updateInputCss?: CssClassUpdater
  updateLabelCss?: CssClassUpdater
  updateContainerCss?: CssClassUpdater
  customInputSx?: SxProps
  showErrorMessage?: boolean
  disabled?: boolean
  type?: HTMLInputTypeAttribute
}

export const TEXT_INPUT_CLASS = 'bg-white w-full'
export const TEXT_INPUT_LABEL_CLASS = 'mb-1 block text-left font-light'
// Future proofing for potential base styles
export const TEXT_INPUT_CONTAINER_CLASS = ''

const FormikTextInput = <FormData,>({
  fieldName,
  hideLabel,
  label,
  placeholder,
  updateInputCss,
  updateLabelCss,
  updateContainerCss,
  customInputSx = {},
  showErrorMessage = true,
  disabled,
  type,
}: TextFieldProps<FormData>) => {
  const finalInputCss = updateInputCss
    ? mergeCssClasses(TEXT_INPUT_CLASS, updateInputCss)
    : TEXT_INPUT_CLASS
  const finalLabelCss = updateLabelCss
    ? mergeCssClasses(TEXT_INPUT_LABEL_CLASS, updateLabelCss)
    : TEXT_INPUT_LABEL_CLASS
  // Future proofing for potential base styles
  const finalContainerCss = updateContainerCss
    ? mergeCssClasses(TEXT_INPUT_CONTAINER_CLASS, updateContainerCss)
    : TEXT_INPUT_CONTAINER_CLASS

  return (
    <FastField name={fieldName}>
      {({ field, meta }: FastFieldProps) => {
        return (
          <div className={finalContainerCss}>
            {!hideLabel && (
              <label htmlFor={fieldName}>
                <StyledBodySmall className={finalLabelCss}>
                  {label}
                </StyledBodySmall>
              </label>
            )}
            <TextField
              type={type}
              disabled={disabled}
              {...field}
              id={fieldName}
              className={finalInputCss}
              name={fieldName}
              variant="outlined"
              value={field.value || ''}
              placeholder={placeholder}
              error={meta.touched && !!meta.error}
              sx={customInputSx}
            />
            {showErrorMessage && (
              <div className="min-h-6">
                {meta.touched && meta.error && (
                  <FieldErrorText
                    id={`field-error-${fieldName}`}
                    message={meta.error || ''}
                  />
                )}
              </div>
            )}
          </div>
        )
      }}
    </FastField>
  )
}

export default FormikTextInput
