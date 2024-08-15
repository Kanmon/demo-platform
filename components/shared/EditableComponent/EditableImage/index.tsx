import classNames from 'classnames'
import { ChangeEvent, useRef } from 'react'
import { EditableProps } from '../EditableProps'
import { fileToBase64 } from '@/utils/fileToBase64'

interface EditableImageProps extends EditableProps {
  onUpload: (imageBase64: string | undefined) => void
  children?: React.ReactNode
}

export const EditableImage: React.FC<EditableImageProps> = ({
  editMode,
  itemExists,
  onUpload,
  children,
}) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const editableStyles =
    'hover:cursor-pointer outline outline-2 outline-red-500'

  const imageUploaded = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0]

      const imageBase64 = await fileToBase64(file)

      onUpload(imageBase64)
    }
  }

  const resetImage = () => {
    if (!editMode) return

    onUpload(undefined)
  }

  const openFileUpload = () => {
    if (!editMode || !inputRef.current) return

    inputRef.current.click()
  }

  return (
    <div
      className={classNames(editMode && editableStyles)}
      onClick={itemExists ? resetImage : openFileUpload}
    >
      <input type="file" ref={inputRef} hidden onChange={imageUploaded} />
      {children}
    </div>
  )
}
