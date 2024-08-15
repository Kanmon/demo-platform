import { useDispatch, useSelector } from 'react-redux'
import { ResponsiveImage } from '../ResponsiveImage'
import { getCustomizationState, saveNewLogo } from '@/store/customizationSlice'
import { EditableImage } from '@/components/shared/EditableComponent/EditableImage'

export const DefaultLogoSVG = () => (
  <svg
    id="Layer_2"
    xmlns="http://www.w3.org/2000/svg"
    height="32"
    width="32"
    viewBox="0 0 183.41 147.29"
  >
    <defs>
      <style>{`.cls-1{fill:#fff;}`}</style>
    </defs>
    <g id="artwork">
      <g>
        <rect className="cls-1" width="62.98" height="29.46" />
        <rect className="cls-1" y="117.83" width="62.98" height="29.46" />
        <g>
          <rect className="cls-1" y="58.92" width="62.98" height="29.46" />
          <polygon
            className="cls-1"
            points="147.5 88.37 183.41 147.29 143.92 147.29 125.96 117.83 62.98 117.83 62.98 88.37 147.5 88.37"
          />
        </g>
        <polyline
          className="cls-1"
          points="62.98 58.92 147.5 58.92 183.41 0 143.92 0 125.96 29.46 62.98 29.46 62.98 58.92"
        />
      </g>
    </g>
  </svg>
)

export const DefaultLogo = () => {
  return (
    <div className="flex text-white justify-center items-center">
      <DefaultLogoSVG />
      <div className="ml-4 sidebar-expanded:flex hidden text-xl tracking-wide">
        DEMO
      </div>
    </div>
  )
}

export const Logo: React.FC = () => {
  const { logoBase64, editMode, logoHeight, logoWidth } = useSelector(
    getCustomizationState,
  )
  const dispatch = useDispatch()

  const dispatchImageChange = (imageBase64: string | undefined) => {
    dispatch(saveNewLogo({ imageBase64 }))
  }

  const logoExists = logoBase64 != undefined

  return (
    <EditableImage
      editMode={editMode}
      itemExists={logoExists}
      onUpload={dispatchImageChange}
    >
      {logoExists ? (
        <ResponsiveImage
          alt="logo"
          src={logoBase64}
          width={logoWidth}
          height={logoHeight}
        />
      ) : (
        <DefaultLogo />
      )}
    </EditableImage>
  )
}
