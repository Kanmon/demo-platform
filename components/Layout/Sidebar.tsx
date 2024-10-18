import React, { useState, useEffect, useRef } from 'react'
import SidebarLinkGroup from './SidebarLinkGroup'
import { SidebarLinkItem } from './SidebarLinkItem'
import { Logo } from '@/components/shared/Logo'
import { useSelector } from 'react-redux'
import { getCustomizationState } from '@/store/customizationSlice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faList,
  faCube,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons'

interface SidebarProps {
  sidebarOpen: boolean
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
}

enum SidebarGroup {
  Dashboard = 'Dashboard',
  Orders = 'Orders',
}

export const Sidebar: React.FC<SidebarProps> = ({
  sidebarOpen,
  setSidebarOpen,
}) => {
  const customizationState = useSelector(getCustomizationState)
  const trigger = useRef(null)
  const sidebar = useRef(null)

  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const [activeSidebarGroup, setActiveSidebarGroup] = useState('')

  useEffect(() => {
    const bodyElement = document.querySelector('body')
    if (!bodyElement) return

    if (sidebarExpanded) {
      bodyElement.classList.add('sidebar-expanded')
    } else {
      bodyElement.classList.remove('sidebar-expanded')
    }
  }, [sidebarExpanded])

  const wrappedIcon = (icon: IconDefinition) => {
    const getIcon = (active: boolean) => {
      return (
        <FontAwesomeIcon
          className={`fill-current h-4 w-4 mx-1 ${
            active ? 'text-indigo-500' : 'text-slate-600'
          }`}
          icon={icon}
        />
      )
    }

    return getIcon
  }

  return (
    <div>
      <div
        className={`fixed inset-0 bg-slate-900 bg-opacity-30 z-40 lg:hidden lg:z-auto transition-opacity duration-200 ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      />

      <div
        id="sidebar"
        ref={sidebar}
        className={`flex flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 h-screen overflow-y-scroll lg:overflow-y-auto no-scrollbar w-64 lg:w-20 lg:sidebar-expanded:!w-64 2xl:!w-64 shrink-0 p-4 transition-all duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-64'
        }`}
        style={{ backgroundColor: customizationState.sidenavBgColor }}
      >
        <div className="flex justify-between mb-10 pr-3 sm:px-2">
          <button
            ref={trigger}
            className="lg:hidden text-slate-500 hover:text-slate-400 bg-blend-hard-light bg-inherit"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
          >
            <span className="sr-only">Close sidebar</span>
            <svg
              className="w-6 h-6 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10.7 18.7l1.4-1.4L7.8 13H20v-2H7.8l4.3-4.3-1.4-1.4L4 12z" />
            </svg>
          </button>
          <Logo />
        </div>

        <div className="space-y-8">
          <div>
            <h3 className="text-xs uppercase text-slate-500 font-semibold pl-3">
              <span
                className="hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden text-center w-6"
                aria-hidden="true"
              >
                •••
              </span>
              <span className="lg:hidden lg:sidebar-expanded:block 2xl:block">
                Pages
              </span>
            </h3>
            <ul className="mt-3">
              <SidebarLinkGroup
                title={SidebarGroup.Dashboard}
                icon={wrappedIcon(faCube)}
                active={activeSidebarGroup === SidebarGroup.Dashboard}
              >
                {(open, setOpen) => {
                  return (
                    <React.Fragment>
                      <SidebarLinkItem
                        title="Main"
                        linkHref="/"
                        setOpen={setOpen}
                        setActive={() =>
                          setActiveSidebarGroup(SidebarGroup.Dashboard)
                        }
                      />

                      <SidebarLinkItem
                        title="Financing"
                        linkHref="/financing"
                        setOpen={setOpen}
                        setActive={() =>
                          setActiveSidebarGroup(SidebarGroup.Dashboard)
                        }
                      />
                    </React.Fragment>
                  )
                }}
              </SidebarLinkGroup>
              <SidebarLinkGroup
                title={SidebarGroup.Orders}
                icon={wrappedIcon(faList)}
                active={activeSidebarGroup === SidebarGroup.Orders}
              >
                {(open, setOpen) => {
                  return (
                    <React.Fragment>
                      <SidebarLinkItem
                        title="Purchase Orders"
                        linkHref="/platforms/purchase-orders"
                        setOpen={setOpen}
                        setActive={() =>
                          setActiveSidebarGroup(SidebarGroup.Orders)
                        }
                      />

                      <SidebarLinkItem
                        title="Invoices"
                        linkHref="/platforms/invoices"
                        setOpen={setOpen}
                        setActive={() =>
                          setActiveSidebarGroup(SidebarGroup.Orders)
                        }
                      />

                      <SidebarLinkItem
                        title="Examples"
                        linkHref="/examples"
                        setOpen={setOpen}
                        setActive={() =>
                          setActiveSidebarGroup(SidebarGroup.Orders)
                        }
                      />
                    </React.Fragment>
                  )
                }}
              </SidebarLinkGroup>
            </ul>
          </div>
        </div>

        <div className="pt-3 hidden lg:inline-flex 2xl:hidden justify-end mt-auto">
          <div className="px-3 py-2">
            <div
              className="hover:cursor-pointer"
              onClick={() => setSidebarExpanded(!sidebarExpanded)}
            >
              <span className="sr-only">Expand / collapse sidebar</span>
              <svg
                className="w-6 h-6 fill-current sidebar-expanded:rotate-180"
                viewBox="0 0 24 24"
              >
                <path
                  className="text-slate-400"
                  d="M19.586 11l-5-5L16 4.586 23.414 12 16 19.414 14.586 18l5-5H7v-2z"
                />
                <path className="text-slate-600" d="M3 23H1V1h2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
