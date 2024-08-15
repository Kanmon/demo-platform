import classNames from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { useSelector } from 'react-redux'
import { useEffectOnce } from 'react-use'
import { getCustomizationState } from '@/store/customizationSlice'

interface SidebarItemProps {
  title: string
  linkHref: string
  disabled?: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  setActive: () => void
}

export const SidebarLinkItem: React.FC<SidebarItemProps> = ({
  title,
  linkHref,
  disabled,
  setOpen,
  setActive,
}) => {
  const customizationState = useSelector(getCustomizationState)
  const router = useRouter()
  const active = router.asPath === linkHref

  useEffectOnce(() => {
    if (active) {
      setOpen(true)
      setActive()
    }
  })

  const containerClasses = classNames(
    'block transition duration-150 truncate',
    active
      ? 'text-indigo-500 hover:cursor-default'
      : 'text-slate-400 hover:text-slate-200 hover:cursor-pointer',
  )

  const sideNavTextStyles =
    'text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200'

  return (
    <li className="mb-1 last:mb-0">
      <div className={containerClasses} onClick={setActive}>
        {disabled ? (
          <span
            className={sideNavTextStyles}
            style={{
              color: active ? customizationState.primaryColor : undefined,
            }}
          >
            {title}
          </span>
        ) : (
          <Link href={linkHref} passHref legacyBehavior>
            <a
              className={sideNavTextStyles}
              style={{
                color: active ? customizationState.primaryColor : undefined,
              }}
            >
              {title}
            </a>
          </Link>
        )}
      </div>
    </li>
  )
}
