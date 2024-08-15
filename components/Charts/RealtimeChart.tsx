import React, { useRef, useEffect } from 'react'

import {
  Chart,
  LineController,
  LineElement,
  Filler,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
} from 'chart.js'
import 'chartjs-adapter-moment'

// Import utilities
import { getTailwindConfig, formatValue } from '@/utils'

Chart.register(
  LineController,
  LineElement,
  Filler,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
)

export const RealtimeChart = ({
  data,
  width,
  height,
}: {
  data: any
  width: number
  height: number
}) => {
  const canvas = useRef<HTMLCanvasElement>(null)
  const chartValue = useRef<HTMLSpanElement>(null)
  const chartDeviation = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = canvas.current
    if (!ctx) return

    const _chart = new Chart(ctx, {
      type: 'line',
      data: data,
      options: {
        layout: {
          padding: 20,
        },
        scales: {
          y: {
            suggestedMin: 30,
            suggestedMax: 80,
            ticks: {
              maxTicksLimit: 5,
              callback: (value) => formatValue(value as number),
            },
          },
          x: {
            type: 'time',
            time: {
              parser: 'hh:mm:ss',
              unit: 'second',
              tooltipFormat: 'MMM DD, H:mm:ss a',
              displayFormats: {
                second: 'H:mm:ss',
              },
            },
            grid: {
              display: false,
            },
            ticks: {
              autoSkipPadding: 48,
              maxRotation: 0,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            titleFont: {
              weight: '600',
            },
            callbacks: {
              label: (context) => formatValue(context.parsed.y),
            },
          },
        },
        interaction: {
          intersect: false,
          mode: 'nearest',
        },
        animation: false,
        maintainAspectRatio: false,
        resizeDelay: 200,
      },
    })
    return () => _chart.destroy()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  // Update header values
  useEffect(() => {
    const currentValue = data.datasets[0].data[data.datasets[0].data.length - 1]
    const previousValue =
      data.datasets[0].data[data.datasets[0].data.length - 2]
    const diff = ((currentValue - previousValue) / previousValue) * 100

    if (!chartValue.current) return

    chartValue.current.innerHTML =
      data.datasets[0].data[data.datasets[0].data.length - 1]

    if (!chartDeviation.current) return

    if (diff < 0) {
      chartDeviation.current.style.backgroundColor =
        getTailwindConfig().theme.colors.amber[500]
    } else {
      chartDeviation.current.style.backgroundColor =
        getTailwindConfig().theme.colors.emerald[500]
    }
    chartDeviation.current.innerHTML = `${diff > 0 ? '+' : ''}${diff.toFixed(
      2,
    )}%`
  }, [data])

  return (
    <React.Fragment>
      <div className="px-5 py-3">
        <div className="flex items-start">
          <div className="text-3xl font-bold text-slate-800 mr-2 tabular-nums">
            $<span ref={chartValue}>57.81</span>
          </div>
          <div
            ref={chartDeviation}
            className="text-sm font-semibold text-white px-1.5 rounded-full"
          ></div>
        </div>
      </div>
      <div className="grow">
        <canvas ref={canvas} width={width} height={height}></canvas>
      </div>
    </React.Fragment>
  )
}
