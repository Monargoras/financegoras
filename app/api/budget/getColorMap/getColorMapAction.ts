'use server'

import { ColorMap } from '@/utils/types'
import getCategories from '../getCategories/getCategoriesAction'

export default async function getColorMap(userId: string): Promise<ColorMap> {
  const categories = await getCategories(userId)
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
