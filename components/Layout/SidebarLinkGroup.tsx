import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { getCustomizationState } from '@/store/customizationSlice'
import { pSBC } from '@/utils/pSBC'

interface SidebarGroupProps {
  children?: (
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  ) => React.ReactNode
  title: string
  icon: (active: boolean) => JSX.Element
  active: boolean
}

export const SidebarLinkGroup: React.FC<SidebarGroupProps> = ({
  children,
  title,
  icon,
  active,
}) => {
  const customizationState = useSelector(getCustomizationState)
  const [open, setOpen] = useState(true)

  return (
    <li
      className={'px-3 py-2 rounded-sm mb-0.5 last:mb-0'}
      style={{
        backgroundColor: active
          ? (pSBC(-0.7, customizationState.sidenavBgColor) as string)
          : undefined,
      }}
    >
      <React.Fragment>
        <a
          href="#0"
          className={`block text-slate-200 truncate transition duration-150 ${
            active ? 'hover:text-slate-200' : 'hover:text-white'
          }`}
          onClick={(e) => {
            e.preventDefault()
            setOpen(!open)
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {icon(active)}
              <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                {title}
              </span>
            </div>
            <div className="flex shrink-0 ml-2">
              <svg
                className={`w-3 h-3 shrink-0 ml-1 fill-current text-slate-400 ${
                  open && 'rotate-180'
                }`}
                viewBox="0 0 12 12"
              >
                <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
              </svg>
            </div>
          </div>
        </a>
        <div className="lg:hidden lg:sidebar-expanded:block 2xl:block">
          <ul className={`pl-9 mt-1 ${!open && 'hidden'}`}>
            {children?.(open, setOpen)}
          </ul>
        </div>
      </React.Fragment>
    </li>
  )
}

export default SidebarLinkGroup
