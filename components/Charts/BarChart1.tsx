import React, { useRef, useEffect } from 'react'

import {
  Chart,
  BarController,
  BarElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
} from 'chart.js'
import 'chartjs-adapter-moment'

import { getTailwindConfig, formatValue } from '@/utils'

Chart.register(
  BarController,
  BarElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
)

export const BarChart1 = ({
  data,
  width,
  height,
}: {
  data: any
  width: number
  height: number
}) => {
  const canvas = useRef<HTMLCanvasElement>(null)
  const legend = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const ctx = canvas.current
    if (!ctx) return

    const chart = new Chart(ctx, {
      type: 'bar',
      data: data,
      options: {
        layout: {
          padding: {
            top: 12,
            bottom: 16,
            left: 20,
            right: 20,
          },
        },
        scales: {
          y: {
            ticks: {
              maxTicksLimit: 5,
              callback: (value) => formatValue(value as number),
            },
          },
          x: {
            type: 'time',
            time: {
              parser: 'MM-DD-YYYY',
              unit: 'month',
              displayFormats: {
                month: 'MMM YY',
              },
            },
            grid: {
              display: false,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (context) => formatValue(context.parsed.y),
            },
          },
        },
        interaction: {
          intersect: false,
          mode: 'nearest',
        },
        animation: {
          duration: 500,
        },
        maintainAspectRatio: false,
        resizeDelay: 200,
      },
      plugins: [
        {
          id: 'htmlLegend',
          afterUpdate(c, args, options) {
            const ul = legend.current
            if (!ul) return
            // Remove old legend items
            while (ul.firstChild) {
              ul.firstChild.remove()
            }
            // Reuse the built-in legendItems generator
            const items = c.options.plugins?.legend?.labels?.generateLabels?.(c)

            if (!items) return

            items.forEach((item) => {
              const li = document.createElement('li')
              li.style.marginRight = getTailwindConfig().theme.margin[4]

              const datasetIndex = item.datasetIndex as number

              // Button element
              const button = document.createElement('button')
              button.style.display = 'inline-flex'
              button.style.alignItems = 'center'
              button.style.opacity = item.hidden ? '.3' : ''
              button.style.backgroundColor = 'white'
              button.onclick = () => {
                c.setDatasetVisibility(
                  datasetIndex,
                  !c.isDatasetVisible(datasetIndex),
                )
                c.update()
              }
              // Color box
              const box = document.createElement('span')
              box.style.display = 'block'
              box.style.width = getTailwindConfig().theme.width[3]
              box.style.height = getTailwindConfig().theme.height[3]
              box.style.borderRadius =
                getTailwindConfig().theme.borderRadius.full
              box.style.marginRight = getTailwindConfig().theme.margin[2]
              box.style.borderWidth = '3px'
              box.style.borderColor = item.fillStyle as string
              box.style.pointerEvents = 'none'
              // Label
              const labelContainer = document.createElement('span')
              labelContainer.style.display = 'flex'
              labelContainer.style.alignItems = 'center'
              const value = document.createElement('span')
              value.style.color = getTailwindConfig().theme.colors.slate[800]
              value.style.fontSize =
                getTailwindConfig().theme.fontSize['3xl'][0]
              value.style.lineHeight =
                getTailwindConfig().theme.fontSize['3xl'][1].lineHeight
              value.style.fontWeight = getTailwindConfig().theme.fontWeight.bold
              value.style.marginRight = getTailwindConfig().theme.margin[2]
              value.style.pointerEvents = 'none'
              const label = document.createElement('span')
              label.style.color = getTailwindConfig().theme.colors.slate[500]
              label.style.fontSize = getTailwindConfig().theme.fontSize.sm[0]
              label.style.lineHeight =
                getTailwindConfig().theme.fontSize.sm[1].lineHeight
              const theValue = c.data.datasets[datasetIndex].data.reduce(
                // eslint-disable-next-line
                // @ts-ignore
                (a, b) => a + b,
                0,
              ) as number
              const valueText = document.createTextNode(formatValue(theValue))
              const labelText = document.createTextNode(item.text)
              value.appendChild(valueText)
              label.appendChild(labelText)
              li.appendChild(button)
              button.appendChild(box)
              button.appendChild(labelContainer)
              labelContainer.appendChild(value)
              labelContainer.appendChild(label)
              ul.appendChild(li)
            })
          },
        },
      ],
    })
    return () => chart.destroy()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <React.Fragment>
      <div className="px-5 py-3">
        <ul ref={legend} className="flex flex-wrap"></ul>
      </div>
      <div className="grow">
        <canvas ref={canvas} width={width} height={height}></canvas>
      </div>
    </React.Fragment>
  )
}
