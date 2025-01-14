import { PostInfo } from '@/types'
import fs from 'fs'
import path from 'path'

export async function getRawData(platform: string, product_name: string) {
  const res_module = JSON.parse(
    fs.readFileSync(
      path.join(
        process.cwd(),
        'data',
        platform,
        product_name,
        'res_module.json',
      ),
      'utf8',
    ),
  )

  const res_module_without_empty_field: PostInfo[] = res_module.filter(
    (item: PostInfo) => {
      if (!item) return false
      for (const value in Object.values(item)) {
        if (!value || value?.length === 0) {
          return false
        }
      }
      return true
    },
  )

  return {
    res_module: res_module_without_empty_field,
  }
}
