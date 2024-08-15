import React from 'react'

import { useSelector } from 'react-redux'
import { pSBC, getTailwindConfig } from '@/utils'
import { getCustomizationState } from '@/store/customizationSlice'
import { DoughnutChart } from '../Charts/DoughnutChart'

export const DemoDashboardCard6 = () => {
  const { buttonBgColor } = useSelector(getCustomizationState)

  const chartData = {
    labels: ['United States', 'Italy', 'Other'],
    datasets: [
      {
        label: 'Top Countries',
        data: [35, 30, 35],
        backgroundColor: [
          buttonBgColor,
          getTailwindConfig().theme.colors.blue[400],
          pSBC(-0.5, buttonBgColor),
        ],
        hoverBackgroundColor: [
          pSBC(-0.3, buttonBgColor),
          getTailwindConfig().theme.colors.blue[500],
          pSBC(-0.8, buttonBgColor),
        ],
        hoverBorderColor: getTailwindConfig().theme.colors.white,
      },
    ],
  }

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white shadow-lg rounded-sm border border-slate-200">
      <header className="px-5 py-4 border-b border-slate-100">
        <h2 className="font-semibold text-slate-800">Top Countries</h2>
      </header>
      <DoughnutChart data={chartData} width={389} height={260} />
    </div>
  )
}
