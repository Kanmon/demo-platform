import React, { useState } from 'react'

import { DropdownNotifications } from '../shared/DropdownNotifications'
import { UserMenu } from '../shared/UserMenu'
import { DropdownHelp } from '../shared/DropdownHelp'
import { ModalSearch } from '../shared/ModalSearch'
import { useKanmonConnectContext } from '../../hooks/KanmonConnectContext'

export const Header = ({
  sidebarOpen,
  setSidebarOpen,
}: {
  sidebarOpen: boolean
  setSidebarOpen: (sidebarOpen: boolean) => void
}) => {
  const [searchModalOpen, setSearchModalOpen] = useState(false)
  const { isDarkMode, setKanmonDarkMode } = useKanmonConnectContext()

  return (
    <header className="sticky top-0 bg-white border-b border-slate-200 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 -mb-px">
          <div className="flex">
            <button
              className="text-slate-500 hover:text-slate-600 lg:hidden"
              aria-controls="sidebar"
              aria-expanded={sidebarOpen}
              onClick={(e) => {
                e.stopPropagation()
                setSidebarOpen(!sidebarOpen)
              }}
            >
              <span className="sr-only">Open sidebar</span>
              <svg
                className="w-6 h-6 fill-current"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="4" y="5" width="16" height="2" />
                <rect x="4" y="11" width="16" height="2" />
                <rect x="4" y="17" width="16" height="2" />
              </svg>
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <div>
              <button
                className={`w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 transition duration-150 rounded-full ml-3 ${
                  searchModalOpen && 'bg-slate-200'
                }`}
                onClick={(e) => {
                  e.stopPropagation()
                  setSearchModalOpen(true)
                }}
                aria-controls="search-modal"
              >
                <span className="sr-only">Search</span>
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 16 16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    className="fill-current text-slate-500"
                    d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5z"
                  />
                  <path
                    className="fill-current text-slate-400"
                    d="M15.707 14.293L13.314 11.9a8.019 8.019 0 01-1.414 1.414l2.393 2.393a.997.997 0 001.414 0 .999.999 0 000-1.414z"
                  />
                </svg>
              </button>
              <ModalSearch
                searchId="search"
                modalOpen={searchModalOpen}
                setModalOpen={setSearchModalOpen}
              />
            </div>
            <button
              className="w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 transition duration-150 rounded-full"
              onClick={() => setKanmonDarkMode(!isDarkMode)}
              title={`Switch Kanmon widget to ${
                isDarkMode ? 'light' : 'dark'
              } mode`}
            >
              <span className="sr-only">Toggle Kanmon dark mode</span>
              {isDarkMode ? (
                <svg
                  className="w-4 h-4 fill-current text-slate-500"
                  viewBox="0 0 16 16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M8 12a4 4 0 100-8 4 4 0 000 8zM8 0a.75.75 0 01.75.75v1a.75.75 0 01-1.5 0v-1A.75.75 0 018 0zm0 13.5a.75.75 0 01.75.75v1a.75.75 0 01-1.5 0v-1a.75.75 0 01.75-.75zM16 8a.75.75 0 01-.75.75h-1a.75.75 0 010-1.5h1A.75.75 0 0116 8zM2.5 8a.75.75 0 01-.75.75h-1a.75.75 0 010-1.5h1A.75.75 0 012.5 8zm11.16-5.66a.75.75 0 010 1.06l-.71.71a.75.75 0 11-1.06-1.06l.71-.71a.75.75 0 011.06 0zM4.11 11.89a.75.75 0 010 1.06l-.71.71a.75.75 0 11-1.06-1.06l.71-.71a.75.75 0 011.06 0zm9.55 1.77a.75.75 0 01-1.06 0l-.71-.71a.75.75 0 111.06-1.06l.71.71a.75.75 0 010 1.06zM4.11 4.11a.75.75 0 01-1.06 0l-.71-.71a.75.75 0 111.06-1.06l.71.71a.75.75 0 010 1.06z" />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4 fill-current text-slate-500"
                  viewBox="0 0 16 16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M6.2 1.1a7 7 0 108.7 8.7A7 7 0 016.2 1.1zm6.9 9.9A5.5 5.5 0 015 4.9a5.51 5.51 0 00-1.5 3.6 5.5 5.5 0 005.5 5.5 5.51 5.51 0 004.1-1.9c-.33.06-.66.1-1 .1z" />
                </svg>
              )}
            </button>
            <DropdownNotifications align="right" />
            <DropdownHelp align="right" />
            <hr className="w-px h-6 bg-slate-200 mx-3" />
            <UserMenu align="right" />
          </div>
        </div>
      </div>
    </header>
  )
}
