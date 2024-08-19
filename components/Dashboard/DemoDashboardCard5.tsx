import { useMemo } from 'react'

import { getCustomizationState } from '@/store/customizationSlice'
import { getTailwindConfig, hexToRgbFormatted } from '@/utils'
import { useSelector } from 'react-redux'
import { RealtimeChart } from '../Charts/RealtimeChart'

export const DemoDashboardCard5 = () => {
  const { buttonBgColor } = useSelector(getCustomizationState)

  // Generate fake dates from now to back in time
  const chartData = useMemo(() => {
    const data = [
      57.81, 57.75, 55.48, 54.28, 53.14, 52.25, 51.04, 52.49, 55.49, 56.87,
      53.73, 56.42, 58.06, 55.62, 58.16, 55.22, 58.67, 60.18, 61.31, 63.25,
      65.91, 64.44, 65.97, 62.27, 60.96, 59.34, 55.07, 59.85, 53.79, 51.92,
      50.95, 49.65, 48.09, 49.81, 47.85, 49.52, 50.21, 52.22, 54.42, 53.42,
      50.91, 58.52, 53.37, 57.58, 59.09, 59.36, 58.71, 59.42, 55.93, 57.71,
      50.62, 56.28, 57.37, 53.08, 55.94, 55.82, 53.94, 52.65, 50.25,
    ]

    const now = new Date()
    const dates: Date[] = []
    data.forEach((v, i) => {
      dates.push(new Date(now.getTime() - 2000 - i * 2000))
    })
    const labels = dates.slice(0, 35).reverse()

    return {
      labels: labels,
      datasets: [
        // Indigo line
        {
          data,
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
      ],
    }
  }, [buttonBgColor])

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 bg-white shadow-lg rounded-sm border border-slate-200">
      <header className="px-5 py-4 border-b border-slate-100 flex items-center">
        <h2 className="font-semibold text-slate-800">Stock Price</h2>
      </header>
      <div className="grow">
        <RealtimeChart data={chartData} width={595} height={248} />
      </div>
    </div>
  )
}
