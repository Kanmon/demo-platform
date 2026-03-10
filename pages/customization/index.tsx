import { useDispatch, useSelector } from 'react-redux'
import {
  CustomizationState,
  getCustomizationState,
  updateCustomizationField,
} from '@/store/customizationSlice'
import { useState } from 'react'

const ColorField = ({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (color: string) => void
}) => {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 rounded cursor-pointer border border-slate-200 p-0"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-24 text-xs font-mono text-slate-600 bg-slate-50 border border-slate-200 rounded px-2 py-1.5 uppercase"
        />
      </div>
    </div>
  )
}

const colorFields: { label: string; field: keyof CustomizationState }[] = [
  { label: 'Primary Color', field: 'primaryColor' },
  { label: 'Primary Text Color', field: 'primaryTextColor' },
  { label: 'Secondary Color', field: 'secondaryColor' },
  { label: 'Secondary Text Color', field: 'secondaryTextColor' },
  { label: 'Tertiary Color', field: 'tertiaryColor' },
  { label: 'Sidenav Background', field: 'sidenavBgColor' },
  { label: 'Sidenav Text Color', field: 'sidenavTextColor' },
  { label: 'Sidenav Selected Color', field: 'sidenavSelectedColor' },
  { label: 'Default Text Color', field: 'defaultTextColor' },
  { label: 'Default Background', field: 'defaultBgColor' },
  { label: 'Banner Background', field: 'bannerBgColor' },
]

const CustomizationPage = () => {
  const dispatch = useDispatch()
  const customization = useSelector(getCustomizationState)

  const [logoUrl, setLogoUrl] = useState(customization.logoUrl || '')
  const [logoWidth, setLogoWidth] = useState<number | undefined>(
    customization.logoWidth,
  )
  const [logoHeight, setLogoHeight] = useState<number | undefined>(
    customization.logoHeight,
  )
  const [programName, setProgramName] = useState(customization.programName)
  const [demoLogoAddedText, setDemoLogoAddedText] = useState(
    customization.demoLogoAddedText,
  )

  const applyLogoUrl = () => {
    dispatch(
      updateCustomizationField({
        field: 'logoUrl',
        value: logoUrl || undefined,
      }),
    )
    dispatch(updateCustomizationField({ field: 'logoWidth', value: logoWidth }))
    dispatch(
      updateCustomizationField({ field: 'logoHeight', value: logoHeight }),
    )
  }

  const applyProgramName = () => {
    dispatch(
      updateCustomizationField({
        field: 'programName',
        value: programName,
      }),
    )
  }

  const applyDemoLogoAddedText = () => {
    dispatch(
      updateCustomizationField({
        field: 'demoLogoAddedText',
        value: demoLogoAddedText,
      }),
    )
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-override-default">
          Customization
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Override the platform theme colors and logo for this demo. Changes are
          saved locally in your browser and will not persist to the platform
          configuration.
        </p>
      </div>

      {/* Colors */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6">
        <div className="px-5 py-4 border-b border-slate-200">
          <h2 className="text-base font-semibold text-override-default">
            Colors
          </h2>
        </div>
        <div className="px-5 py-2">
          {colorFields.map(({ label, field }) => (
            <ColorField
              key={field}
              label={label}
              value={customization[field] as string}
              onChange={(color) =>
                dispatch(updateCustomizationField({ field, value: color }))
              }
            />
          ))}
        </div>
      </div>

      {/* Program Name */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6">
        <div className="px-5 py-4 border-b border-slate-200">
          <h2 className="text-base font-semibold text-override-default">
            Program Name
          </h2>
        </div>
        <div className="px-5 py-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Brand name (shown on Example Program Page)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={programName}
                onChange={(e) => setProgramName(e.target.value)}
                placeholder="Flourish Capital"
                className="flex-1 text-sm text-override-default bg-white border border-slate-200 rounded px-3 py-2 focus:border-indigo-300 focus:ring-0"
              />
              <button
                onClick={applyProgramName}
                className="btn text-white"
                style={{ backgroundColor: customization.primaryColor }}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Logo Added Text */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6">
        <div className="px-5 py-4 border-b border-slate-200">
          <h2 className="text-base font-semibold text-override-default">
            Logo Added Text
          </h2>
        </div>
        <div className="px-5 py-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Text shown next to logo in sidebar header
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={demoLogoAddedText}
                onChange={(e) => setDemoLogoAddedText(e.target.value)}
                placeholder="DEMO"
                className="flex-1 text-sm text-override-default bg-white border border-slate-200 rounded px-3 py-2 focus:border-indigo-300 focus:ring-0"
              />
              <button
                onClick={applyDemoLogoAddedText}
                className="btn text-white"
                style={{ backgroundColor: customization.primaryColor }}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Logo */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="px-5 py-4 border-b border-slate-200">
          <h2 className="text-base font-semibold text-override-default">
            Logo
          </h2>
        </div>
        <div className="px-5 py-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Logo URL
            </label>
            <input
              type="text"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="https://example.com/logo.png"
              className="w-full text-sm text-override-default bg-white border border-slate-200 rounded px-3 py-2 focus:border-indigo-300 focus:ring-0"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Max Width (px)
              </label>
              <input
                type="number"
                value={logoWidth ?? ''}
                onChange={(e) =>
                  setLogoWidth(
                    e.target.value ? Number(e.target.value) : undefined,
                  )
                }
                placeholder="160"
                min={1}
                className="w-full text-sm text-override-default bg-white border border-slate-200 rounded px-3 py-2 focus:border-indigo-300 focus:ring-0"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Max Height (px)
              </label>
              <input
                type="number"
                value={logoHeight ?? ''}
                onChange={(e) =>
                  setLogoHeight(
                    e.target.value ? Number(e.target.value) : undefined,
                  )
                }
                placeholder="40"
                min={1}
                className="w-full text-sm text-override-default bg-white border border-slate-200 rounded px-3 py-2 focus:border-indigo-300 focus:ring-0"
              />
            </div>
          </div>

          <button
            onClick={applyLogoUrl}
            className="btn text-white"
            style={{ backgroundColor: customization.primaryColor }}
          >
            Apply Logo
          </button>

          {(logoUrl || customization.logoUrl) && (
            <div className="mt-3 p-3 bg-slate-50 rounded border border-slate-200">
              <p className="text-xs text-slate-500 mb-2">Preview:</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoUrl || customization.logoUrl}
                alt="Logo preview"
                style={{
                  width: logoWidth ?? customization.logoWidth ?? 160,
                  height: logoHeight ?? customization.logoHeight ?? 40,
                  objectFit: 'contain',
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CustomizationPage
