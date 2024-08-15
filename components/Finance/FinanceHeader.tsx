import React from 'react'
import Link from 'next/link'
import classNames from 'classnames'

export const FinanceHeader: React.FC = () => {
  return (
    <div className="w-full flex justify-center py-8 shadow-md">
      <section className="max-w-screen-2xl w-5/6">
        <div className="flex flex-row justify-between items-center">
          <Link href="https://kanmon.com" passHref legacyBehavior>
            <div className="flex flex-row items-center cursor-pointer">
              <h1
                className={classNames(
                  'text-[#344355] text-3xl whitespace-nowrap',
                  'sm:text-5xl',
                )}
              >
                Flourish Capital
              </h1>
            </div>
          </Link>
          <div
            className={`border-2 rounded-md uppercase text-sm py-1 px-3 sm:text-lg  sm:py-2 sm:px-4 sm:h-12`}
            color="primary"
          >
            <Link href="https://kanmon.com">contact us</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
