import { PostInfo, RawThemeAnalysis, ScenarioRawData } from '@/types'
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

  const theme_analysis_raw = JSON.parse(
    fs.readFileSync(
      path.join(
        process.cwd(),
        'data',
        platform,
        product_name,
        'theme_analysis.json',
      ),
      'utf8',
    ),
  )

  const scenario_analysis_raw = JSON.parse(
    fs.readFileSync(
      path.join(
        process.cwd(),
        'data',
        platform,
        product_name,
        'scenario_analysis.json',
      ),
      'utf-8',
    ),
  )

  const res_module_without_empty_field = res_module.filter((item: PostInfo) => {
    if (!item) return false
    for (const value in Object.values(item)) {
      if (!value || value?.length === 0) {
        return false
      }
    }
    return true
  })

  const theme_analysis_raw_without_empty_field = theme_analysis_raw.filter(
    (item: RawThemeAnalysis) => {
      if (!item) return false
      for (const value in Object.values(item)) {
        if (!value || value?.length === 0) {
          return false
        }
      }
      return true
    },
  )

  const scenario_analysis_raw_without_empty_field =
    scenario_analysis_raw.filter((item: ScenarioRawData) => {
      if (!item) return false
      for (const value in Object.values(item)) {
        if (!value || value?.length === 0) {
          return false
        }
      }
      return true
    })

  return {
    res_module: res_module_without_empty_field,
    theme_analysis_raw: theme_analysis_raw_without_empty_field,
    scenario_analysis_raw: scenario_analysis_raw_without_empty_field,
  }
}
