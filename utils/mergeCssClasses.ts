import classNames from 'classnames'

export type CssClassUpdater = (existingClasses: string[]) => string[] | string

export const basicCssClassUpdater = (
  updatedStyles: string,
): CssClassUpdater => {
  return (className: string[]) => classNames(className, updatedStyles)
}

// Allows user of a component to override certain base styles
const mergeCssClasses = (
  baseStyles: string,
  update: CssClassUpdater,
): string => {
  const updated = update(baseStyles.split(' '))
  return Array.isArray(updated) ? updated.join(' ') : updated
}

export default mergeCssClasses
