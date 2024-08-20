import { StyledBodySmall } from '../StyledTypographyComponents'

interface ErrorTextProps {
  message: string
  id?: string
}

const FieldErrorText = ({ message, id }: ErrorTextProps) => (
  <StyledBodySmall id={id} className="text-red-400 block w-full text-left">
    {message}
  </StyledBodySmall>
)

export default FieldErrorText
