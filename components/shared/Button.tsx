import React from 'react'
import { Button as MuiButton } from '@mui/material'

const Button: React.FC<React.ComponentProps<typeof MuiButton>> = ({
  children,
  ...buttonProps
}) => {
  return (
    <MuiButton
      {...buttonProps}
      sx={{ textTransform: 'inherit', ...(buttonProps.sx || {}) }}
    >
      {children}
    </MuiButton>
  )
}

export default Button
