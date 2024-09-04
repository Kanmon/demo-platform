import { useState } from 'react'
import { Tooltip } from '@mui/material'

export const CopyTextWithToolTip = ({
  children,
  textToBeCopied,
}: {
  children: React.ReactNode
  textToBeCopied: string
}) => {
  const [copied, setCopied] = useState(false)

  const copyText = () => {
    navigator.clipboard.writeText(textToBeCopied)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 2500)
  }

  return (
    <Tooltip
      title={copied ? 'Copied to clipboard!' : 'Copy text to clipboard'}
      leaveDelay={copied ? 2000 : 0}
    >
      <div onClick={() => copyText()} className="hover:cursor-pointer">
        {children}
      </div>
    </Tooltip>
  )
}
