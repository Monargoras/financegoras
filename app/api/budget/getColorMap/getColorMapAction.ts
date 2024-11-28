'use server'

import { ColorMap } from '@/utils/types'
import getCategories from '../getCategories/getCategoriesAction'
import { validateUserId } from '@/utils/authUtils'

export default async function getColorMap(userId: string): Promise<ColorMap> {
  const validatedUserId = await validateUserId(userId)

  const categories = await getCategories(validatedUserId)
  const colorMap: ColorMap = {}
  if (categories) {
    for (const group of categories) {
      colorMap[group.group] = group.color
      for (const category of group.items) {
        colorMap[category.name] = category.color
      }
    }
  }
  return colorMap
}
