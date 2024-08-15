import { useEffect, useRef, useState } from 'react'

import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import {
  getCustomizationState,
  toggleEditMode,
} from '@/store/customizationSlice'
import UserAvatar from '@/public/images/user-avatar-32.png'
import Transition from './Transition'

export const UserMenu = ({ align }: { align: string }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dispatch = useDispatch()
  const [clickCounter, setClickCounter] = useState(0)
  const { buttonBgColor } = useSelector(getCustomizationState)

  const trigger = useRef<HTMLButtonElement>(null)
  const dropdown = useRef<HTMLDivElement>(null)

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: { target: any }) => {
      if (!dropdown.current || !trigger.current) return
      if (
        !dropdownOpen ||
        dropdown.current.contains(target as Node) ||
        trigger.current.contains(target as Node)
      )
        return
      setDropdownOpen(false)
    }
    document.addEventListener('click', clickHandler)
    return () => document.removeEventListener('click', clickHandler)
  })

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: { keyCode: number }) => {
      if (!dropdownOpen || keyCode !== 27) return
      setDropdownOpen(false)
    }
    document.addEventListener('keydown', keyHandler)
    return () => document.removeEventListener('keydown', keyHandler)
  })

  const hiddenEditModeClick = () => {
    const newClickCounter = clickCounter + 1

    setClickCounter(newClickCounter)

    // 5 Clicks to toggle
    if (newClickCounter >= 5) {
      dispatch(toggleEditMode({}))
      setClickCounter(0)
    }
  }

  return (
    <div className="relative inline-flex">
      <button
        ref={trigger}
        className="inline-flex justify-center items-center group bg-white"
        aria-haspopup="true"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-expanded={dropdownOpen}
      >
        <Image
          className="w-8 h-8 rounded-full"
          src={UserAvatar}
          width="32"
          height="32"
          alt="User"
        />
        <div className="flex items-center truncate">
          <span className="truncate ml-2 text-sm font-medium group-hover:text-slate-800">
            Tycho LLC
          </span>
          <svg
            className="w-3 h-3 shrink-0 ml-1 fill-current text-slate-400"
            viewBox="0 0 12 12"
          >
            <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
          </svg>
        </div>
      </button>

      <Transition
        className={`origin-top-right z-10 absolute top-full min-w-44 bg-white border border-slate-200 py-1.5 rounded shadow-lg overflow-hidden mt-1 ${
          align === 'right' ? 'right-0' : 'left-0'
        }`}
        show={dropdownOpen}
        enter="transition ease-out duration-200 transform"
        enterStart="opacity-0 -translate-y-2"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-out duration-200"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
        appear={dropdownOpen}
      >
        <div
          ref={dropdown}
          onFocus={() => setDropdownOpen(true)}
          onBlur={() => setDropdownOpen(false)}
        >
          <div
            className="pt-0.5 pb-2 px-3 mb-1 border-b border-slate-200 select-none"
            onClick={hiddenEditModeClick}
          >
            <div className="font-medium text-slate-800">Tycho LLC</div>
            <div className="text-xs text-slate-500 italic">Administrator</div>
          </div>
          <ul>
            <li>
              <div
                className="font-medium text-sm flex items-center py-1 px-3"
                style={{ color: buttonBgColor }}
              >
                <div
                  className="hover:cursor-pointer fifty-percent-darker-text-on-hover"
                  onClick={() => {
                    dispatch({
                      type: 'RESET_STORE',
                    })
                  }}
                >
                  Start Over
                </div>
              </div>
            </li>
          </ul>
        </div>
      </Transition>
    </div>
  )
}
