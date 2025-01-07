import {
  PostInfo,
  RawAdvantage,
  RawThemeAnalysis,
  ScenarioRawData,
} from '@/types'
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

export function mergeThemeAnalysisData(
  themeAnalysisData: RawThemeAnalysis[][],
) {
  const mergedData: Record<
    string,
    { theme: string; advantages: RawAdvantage[]; disadvantages: RawAdvantage[] }
  > = {}

  // Iterate over each JSON file and its entries
  themeAnalysisData.forEach((file) => {
    file.forEach((entry) => {
      const { theme, advantage, disadvantage } = entry

      // Initialize the theme entry in the merged data if it doesn't exist
      if (!mergedData[theme]) {
        mergedData[theme] = {
          theme,
          advantages: [],
          disadvantages: [],
        }
      }

      // Add advantages and disadvantages to the corresponding theme
      mergedData[theme].advantages.push(...advantage)
      mergedData[theme].disadvantages.push(...disadvantage)
    })
  })

  // Convert the object of themes into an array of objects
  return Object.values(mergedData)
    .map((item) => ({
      ...item,
      // Optionally deduplicate UUIDs within advantages and disadvantages
      advantage: item.advantages.reduce(
        (acc, cur) => {
          acc[cur.uuid.join(',')] = cur
          return acc
        },
        {} as Record<string, RawAdvantage>,
      ),
      disadvantage: item.disadvantages.reduce(
        (acc, cur) => {
          acc[cur.uuid.join(',')] = cur
          return acc
        },
        {} as Record<string, RawAdvantage>,
      ),
    }))
    .map((item) => ({
      theme: item.theme,
      advantage: Object.values(item.advantage),
      disadvantage: Object.values(item.disadvantage),
    }))
}

interface MergedScenario {
  scenario: string
  overall_scores: number[]
  dimensions: Record<string, number[]>
  keywords: Set<string>
  uuids: Set<string>
  description: string
}

export function mergeScenarioAnalysisData(
  scenarioAnalysisData: ScenarioRawData[][],
) {
  const mergedData: Record<string, MergedScenario> = {}

  // Iterate over each JSON file and its entries
  scenarioAnalysisData.forEach((file) => {
    file.forEach((entry) => {
      const {
        scenario,
        overall_score,
        dimensions,
        keywords,
        uuid,
        description,
      } = entry

      // Initialize the scenario entry in the merged data if it doesn't exist
      if (!mergedData[scenario]) {
        mergedData[scenario] = {
          scenario,
          overall_scores: [],
          dimensions: {},
          keywords: new Set(),
          uuids: new Set(),
          description,
        }
      }

      // Collect overall scores for averaging later
      mergedData[scenario].overall_scores.push(overall_score)

      // Add dimensions to the corresponding scenario, aggregating by dimension name
      dimensions.forEach((dim) => {
        if (!mergedData[scenario].dimensions[dim.dimension]) {
          mergedData[scenario].dimensions[dim.dimension] = []
        }
        mergedData[scenario].dimensions[dim.dimension].push(dim.score)
      })

      // Add unique keywords and uuids
      keywords.forEach((keyword) => mergedData[scenario].keywords.add(keyword))
      uuid.forEach((uuidItem) => mergedData[scenario].uuids.add(uuidItem))
    })
  })

  // Convert the object of scenarios into an array of objects with averaged scores and aggregated dimensions
  return Object.values(mergedData).map((item) => ({
    scenario: item.scenario,
    overall_score: item.overall_scores.length
      ? item.overall_scores.reduce((a, b) => a + b, 0) /
        item.overall_scores.length
      : null,
    dimensions: Object.entries(item.dimensions).map(([dimName, dimScores]) => ({
      dimension: dimName,
      score: dimScores.length
        ? dimScores.reduce((a, b) => a + b, 0) / dimScores.length
        : 0,
    })),
    keywords: Array.from(item.keywords),
    uuid: Array.from(item.uuids),
    description: item.description, // Join multiple descriptions with a separator
  })) as ScenarioRawData[]
}
