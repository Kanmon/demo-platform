import Typography from '@mui/material/Typography'
import { HTMLAttributes } from 'react'

// Extend <Typography> variants options
declare module '@mui/material/styles' {
  interface TypographyVariants {
    body3: React.CSSProperties
    body4: React.CSSProperties
    body5: React.CSSProperties
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    body3?: React.CSSProperties
    body4?: React.CSSProperties
    body5?: React.CSSProperties
  }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    body3: true
    body4: true
    body5: true
  }
}

// default 36px line height 50px
export const StyledH1 = (props: HTMLAttributes<HTMLParagraphElement>) => {
  return <Typography variant="h1" className="mb-7.5" {...props}></Typography>
}

// default 28px line height 36px
export const StyledH2 = (props: HTMLAttributes<HTMLParagraphElement>) => {
  return <Typography variant="h2" {...props}></Typography>
}

// default 22px line height 32px
export const StyledBodyLarge = (
  props: HTMLAttributes<HTMLParagraphElement>,
) => {
  return <Typography variant="body2" {...props}></Typography>
}

export const StyledBodyLargeDiv = (
  props: HTMLAttributes<HTMLParagraphElement>,
) => {
  return <Typography variant="body2" component="div" {...props}></Typography>
}

// default 20px line height 30px
export const StyledBodyRegular = (
  props: HTMLAttributes<HTMLParagraphElement>,
) => {
  return (
    <Typography variant="body1" className="text-left" {...props}></Typography>
  )
}

// default 18px line height 28px
export const StyledBodySmall = (
  props: HTMLAttributes<HTMLParagraphElement>,
) => {
  return (
    <Typography variant="body3" className="text-left" {...props}></Typography>
  )
}

// 16px line height 24px
export const StyledBodyExtraSmall = (
  props: HTMLAttributes<HTMLParagraphElement>,
) => {
  return (
    <Typography variant="body4" className="text-left" {...props}></Typography>
  )
}

// 14px line height 20px
export const StyledBodyTiny = (props: HTMLAttributes<HTMLParagraphElement>) => {
  return (
    <Typography variant="body5" className="text-left" {...props}></Typography>
  )
}
