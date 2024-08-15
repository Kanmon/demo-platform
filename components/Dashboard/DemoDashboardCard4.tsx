import React from 'react'

// Import utilities
import { getCustomizationState } from '@/store/customizationSlice'
import { getTailwindConfig, pSBC } from '@/utils'
import { useSelector } from 'react-redux'
import { BarChart1 } from '../Charts/BarChart1'

export const DemoDashboardCard4 = () => {
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
      // Light blue bars
      {
        label: 'Losses',
        data: [800, 1600, 900, 1300, 1950, 1700],
        backgroundColor: getTailwindConfig().theme.colors.blue[400],
        hoverBackgroundColor: getTailwindConfig().theme.colors.blue[500],
        barPercentage: 0.66,
        categoryPercentage: 0.66,
      },
      // Blue bars
      {
        label: 'Gains',
        data: [4900, 2600, 5350, 4800, 5200, 4800],
        backgroundColor: buttonBgColor,
        hoverBackgroundColor: pSBC(-0.4, buttonBgColor),
        barPercentage: 0.66,
        categoryPercentage: 0.66,
      },
    ],
  }

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 bg-white shadow-lg rounded-sm border border-slate-200">
      <header className="px-5 py-4 border-b border-slate-100">
        <h2 className="font-semibold text-slate-800">Losses / Gains</h2>
      </header>
      <div className="grow">
        <BarChart1 data={chartData} width={595} height={248} />
      </div>
    </div>
  )
}
