import { Merge } from 'type-fest'
import Image, { ImageProps } from 'next/image'

export interface StaticImageData {
  src: string
  height: number
  width: number
  blurDataURL?: string
}

type ResponsiveImageProps = Merge<
  ImageProps,
  {
    src: StaticImageData | string
    /**
     * If a number is passed in, it will be assumed to be pixels.
     * Else, pass in a string (eg "100%", "100px", etc.)
     */
    height: string | number
    /**
     * If a number is passed in, it will be assumed to be pixels.
     * Else, pass in a string (eg "100%", "100px", etc.)
     */
    width: string | number
  }
>

/**
 * Define a box using width and height. The image will
 * fit within this box while maintaining its aspect ratio.
 */
export const ResponsiveImage = ({
  src,
  height,
  width,
  alt,
}: ResponsiveImageProps) => {
  const handleDimension = (dimension: string | number) => {
    return typeof dimension === 'string' ? dimension : `${dimension}px`
  }

  return (
    <span
      style={{
        width: handleDimension(width),
        height: handleDimension(height),
      }}
      className={'relative inline-block'}
    >
      <Image layout="fill" objectFit="contain" src={src} alt={alt} />
    </span>
  )
}
