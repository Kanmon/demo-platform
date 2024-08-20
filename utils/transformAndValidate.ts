import 'reflect-metadata'
import {
  ClassConstructor,
  ClassTransformOptions,
  plainToClass,
} from 'class-transformer'
import { validateSync } from 'class-validator'
import { isEmpty } from 'lodash'

export class ValidationError extends Error {
  constructor(readonly errors: string[]) {
    super()
  }
}

export const transformAndValidate = <T, V>(
  cls: ClassConstructor<T>,
  payload: V,
  options?: ClassTransformOptions,
): T => {
  const converted = plainToClass(cls, payload, options)

  // Casting to any here because validate takes `object`,
  // and eslint doesn't like the `object` type
  const validationResults = validateSync(converted as any)

  console.log(converted, validationResults)

  const validationResultArray = validationResults.map((result) =>
    result.toString(),
  )
  if (!isEmpty(validationResults)) {
    // TODO - we could format these errors better using later
    // versions of class validator.
    throw new ValidationError(validationResultArray)
  }
  return converted
}
