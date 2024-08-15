import React, { useRef, useEffect } from 'react'

import {
  Chart,
  DoughnutController,
  ArcElement,
  TimeScale,
  Tooltip,
} from 'chart.js'
import 'chartjs-adapter-moment'
import { getTailwindConfig } from '@/utils'

Chart.register(DoughnutController, ArcElement, TimeScale, Tooltip)

export const DoughnutChart = ({
  data,
  width,
  height,
}: {
  data: any
  width: number
  height: number
}) => {
  const canvas = useRef(null)
  const legend = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const ctx = canvas.current
    if (!ctx) return

    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: data,
      options: {
        cutout: '80%',
        layout: {
          padding: 24,
        },
        plugins: {
          legend: {
            display: false,
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
            const items =
              c.options?.plugins?.legend?.labels?.generateLabels?.(c)

            if (!items) return

            items.forEach((item) => {
              const li = document.createElement('li')
              li.style.margin = getTailwindConfig().theme.margin[1]
              // Button element
              const button = document.createElement('button')
              button.classList.add('btn-xs')
              button.style.backgroundColor =
                getTailwindConfig().theme.colors.white
              button.style.borderWidth =
                getTailwindConfig().theme.borderWidth[2]
              button.style.borderColor =
                getTailwindConfig().theme.colors.slate[200]
              button.style.color = getTailwindConfig().theme.colors.slate[500]
              button.style.boxShadow = getTailwindConfig().theme.boxShadow.md
              button.style.opacity = item.hidden ? '.3' : ''
              button.onclick = () => {
                if (item.index) {
                  c.toggleDataVisibility(item.index)
                  c.update()
                }
              }
              // Color box
              const box = document.createElement('span')
              box.style.display = 'block'
              box.style.width = getTailwindConfig().theme.width[2]
              box.style.height = getTailwindConfig().theme.height[2]
              if (item.fillStyle) {
                box.style.backgroundColor = item.fillStyle as string
              }
              box.style.borderRadius = getTailwindConfig().theme.borderRadius.sm
              box.style.marginRight = getTailwindConfig().theme.margin[1]
              box.style.pointerEvents = 'none'
              // Label
              const label = document.createElement('span')
              label.style.display = 'flex'
              label.style.alignItems = 'center'
              const labelText = document.createTextNode(item.text)
              label.appendChild(labelText)
              li.appendChild(button)
              button.appendChild(box)
              button.appendChild(label)
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
    <div className="grow flex flex-col justify-center">
      <div>
        <canvas ref={canvas} width={width} height={height}></canvas>
      </div>
      <div className="px-5 pt-2 pb-6">
        <ul ref={legend} className="flex flex-wrap justify-center -m-1"></ul>
      </div>
    </div>
  )
}
