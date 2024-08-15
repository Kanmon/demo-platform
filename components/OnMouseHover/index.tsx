import { ReactNode, useState } from 'react'

export const OnMouseHover = ({
  children,
}: {
  children: (hovering: boolean) => ReactNode
}) => {
  const [hovering, setHovering] = useState(false)

  return (
    <div
      onMouseEnter={() => {
        setHovering(true)
      }}
      onMouseLeave={() => {
        setHovering(false)
      }}
    >
      {children(hovering)}
    </div>
  )
}
