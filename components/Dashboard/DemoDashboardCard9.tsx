import React from 'react'

import { useSelector } from 'react-redux'
import { pSBC } from '@/utils'
import { getCustomizationState } from '@/store/customizationSlice'
import Tooltip from '../shared/Tooltip'
import { BarChart2 } from '../Charts/BarChart2'

export const DemoDashboardCard9 = () => {
  const { buttonBgColor } = useSelector(getCustomizationState)

  const chartData = {
    labels: [
      '12-01-2020',
      '01-01-2021',
      '02-01-2021',
      '03-01-2021',
      '04-01-2021',
      '05-01-2021',
    ],
    datasets: [
      {
        label: 'Stack 1',
        data: [6200, 9200, 6600, 8800, 5200, 9200],
        backgroundColor: buttonBgColor,
        hoverBackgroundColor: pSBC(-0.4, buttonBgColor),
        barPercentage: 0.66,
        categoryPercentage: 0.66,
      },
      {
        label: 'Stack 2',
        data: [-4000, -2600, -5350, -4000, -7500, -2000],
        backgroundColor: pSBC(0.3, buttonBgColor),
        hoverBackgroundColor: pSBC(0.1, buttonBgColor),
        barPercentage: 0.66,
        categoryPercentage: 0.66,
      },
    ],
  }

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 bg-white shadow-lg rounded-sm border border-slate-200">
      <header className="px-5 py-4 border-b border-slate-100 flex items-center">
        <h2 className="font-semibold text-slate-800">Sales / Refunds</h2>
        <Tooltip className="ml-2" size="lg">
          <div className="text-sm">
            Sint occaecat cupidatat non proident, sunt in culpa qui officia
            deserunt mollit.
          </div>
        </Tooltip>
      </header>
      <div className="px-5 py-3">
        <div className="flex items-start">
          <div className="text-3xl font-bold text-slate-800 mr-2">+$6,796</div>
          <div className="text-sm font-semibold text-white px-1.5 bg-amber-500 rounded-full">
            -34%
          </div>
        </div>
      </div>
      <div className="grow">
        <BarChart2 data={chartData} width={595} height={248} />
      </div>
    </div>
  )
}
