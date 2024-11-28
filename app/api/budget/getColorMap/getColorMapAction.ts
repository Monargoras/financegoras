'use server'

import { getServerSession } from 'next-auth'
import { ColorMap } from '@/utils/types'
import getCategories from '../getCategories/getCategoriesAction'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'
import { DEMOUSERID } from '@/utils/CONSTANTS'

export default async function getColorMap(userId: string): Promise<ColorMap> {
  const session = await getServerSession(authOptions)
  if ((!session || !session.user) && userId !== DEMOUSERID) {
    return {
      placeholder: '#000000',
    }
  }
  const validatedUserId = userId === DEMOUSERID ? DEMOUSERID : session && session.user ? session.user.id : DEMOUSERID

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
