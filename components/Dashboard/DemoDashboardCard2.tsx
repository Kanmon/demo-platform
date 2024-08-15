import React from 'react'
import Link from 'next/link'
import Icon from '@/public/images/icon-02.svg'

// Import utilities
import { getTailwindConfig, hexToRgbFormatted } from '@/utils'
import { getCustomizationState } from '@/store/customizationSlice'
import { useSelector } from 'react-redux'
import DropdownOptionMenu from '../shared/DropDownOptionMenu'
import { LineChart1 } from '../Charts/LineChart1'
import Image from 'next/image'

export const DemoDashboardCard2 = () => {
  const { buttonBgColor } = useSelector(getCustomizationState)

  const chartData = {
    labels: [
      '12-01-2020',
      '01-01-2021',
      '02-01-2021',
      '03-01-2021',
      '04-01-2021',
      '05-01-2021',
      '06-01-2021',
      '07-01-2021',
      '08-01-2021',
      '09-01-2021',
      '10-01-2021',
      '11-01-2021',
      '12-01-2021',
      '01-01-2022',
      '02-01-2022',
      '03-01-2022',
      '04-01-2022',
      '05-01-2022',
      '06-01-2022',
      '07-01-2022',
      '08-01-2022',
      '09-01-2022',
      '10-01-2022',
      '11-01-2022',
      '12-01-2022',
      '01-01-2023',
    ],
    datasets: [
      // Indigo line
      {
        data: [
          622, 622, 426, 471, 365, 365, 238, 324, 288, 206, 324, 324, 500, 409,
          409, 273, 232, 273, 500, 570, 767, 808, 685, 767, 685, 685,
        ],
        fill: true,
        backgroundColor: `rgba(${hexToRgbFormatted(
          getTailwindConfig().theme.colors.blue[500],
        )}, 0.08)`,
        borderColor: buttonBgColor,
        borderWidth: 2,
        tension: 0,
        pointRadius: 0,
        pointHoverRadius: 3,
        pointBackgroundColor: buttonBgColor,
        clip: 20,
      },
      // Gray line
      {
        data: [
          732, 610, 610, 504, 504, 504, 349, 349, 504, 342, 504, 610, 391, 192,
          154, 273, 191, 191, 126, 263, 349, 252, 423, 622, 470, 532,
        ],
        borderColor: getTailwindConfig().theme.colors.slate[300],
        borderWidth: 2,
        tension: 0,
        pointRadius: 0,
        pointHoverRadius: 3,
        pointBackgroundColor: getTailwindConfig().theme.colors.slate[300],
        clip: 20,
      },
    ],
  }

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white shadow-lg rounded-sm border border-slate-200">
      <div className="px-5 pt-5">
        <header className="flex justify-between items-start mb-2">
          <Image src={Icon} width="32" height="32" alt="Icon 02" />
          <DropdownOptionMenu align="right" className="relative inline-flex">
            <li>
              <Link
                className="font-medium text-sm text-slate-600 hover:text-slate-800 flex py-1 px-3"
                href="#0"
              >
                Option 1
              </Link>
            </li>
            <li>
              <Link
                className="font-medium text-sm text-slate-600 hover:text-slate-800 flex py-1 px-3"
                href="#0"
              >
                Option 2
              </Link>
            </li>
            <li>
              <Link
                className="font-medium text-sm text-rose-500 hover:text-rose-600 flex py-1 px-3"
                href="#0"
              >
                Remove
              </Link>
            </li>
          </DropdownOptionMenu>
        </header>
        <h2 className="text-lg font-semibold text-slate-800 mb-2">
          Advanced Plan
        </h2>
        <div className="text-xs font-semibold text-slate-400 uppercase mb-1">
          Sales
        </div>
        <div className="flex items-start">
          <div className="text-3xl font-bold text-slate-800 mr-2">$17,489</div>
          <div className="text-sm font-semibold text-white px-1.5 bg-amber-500 rounded-full">
            -14%
          </div>
        </div>
      </div>
      <div className="grow">
        <LineChart1 data={chartData} width={389} height={128} />
      </div>
    </div>
  )
}
