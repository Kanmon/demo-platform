import { capitalize, map } from 'lodash'

// Converts any string like
// "ELECTrICAL gOoDS" to "Electrical Goods"
export const capitalizeEachWord = (text: string, delimiter = ' ') => {
  const capitalizedArr = map(text.split(delimiter), capitalize)

  return capitalizedArr.join(' ')
}
