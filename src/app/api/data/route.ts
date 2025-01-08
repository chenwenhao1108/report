import { PostInfo, RawThemeAnalysis, ScenarioRawData } from '@/types'
import {
  getRawData,
  mergeScenarioAnalysisData,
  mergeThemeAnalysisData,
} from '@/utils.server'
import { NextRequest } from 'next/server'

// app/api/data/route.js
export async function GET(request: NextRequest) {
  // 添加类型声明
  const url = new URL(request.url) // 获取请求的 URL
  const platforms = url.searchParams.getAll('platform')
  const productName = url.searchParams.get('product_name')

  if (!productName) {
    return new Response(
      JSON.stringify({ error: 'Query parameter is required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    )
  }

  const data = await getDataBasedOnQuery(productName, platforms)

  if (!data) {
    return new Response(
      JSON.stringify({ error: 'No data found for the query' }),
      { status: 404, headers: { 'Content-Type': 'application/json' } },
    )
  }

  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  })
}

// 模拟根据查询参数返回数据的函数
async function getDataBasedOnQuery(productName: string, platforms: string[]) {
  if (platforms.length === 0) {
    const dongchediRaw = await getRawData('dongchedi', productName)
    const autohomeRaw = await getRawData('autohome', productName)
    const biliRaw = await getRawData('bili', productName)
    const weiboRaw = await getRawData('weibo', productName)

    const {
      res_module: dongchediResModule,
      theme_analysis_raw: dongchediThemeAnalysisRaw,
      scenario_analysis_raw: dongchediScenarioAnalysisRaw,
    } = dongchediRaw
    const {
      res_module: autohomeResModule,
      theme_analysis_raw: autohomeThemeAnalysisRaw,
      scenario_analysis_raw: autohomeScenarioAnalysisRaw,
    } = autohomeRaw
    const {
      res_module: biliResModule,
      theme_analysis_raw: biliThemeAnalysisRaw,
      scenario_analysis_raw: biliScenarioAnalysisRaw,
    } = biliRaw
    const {
      res_module: weiboResModule,
      theme_analysis_raw: weiboThemeAnalysisRaw,
      scenario_analysis_raw: weiboScenarioAnalysisRaw,
    } = weiboRaw

    const res_module = [
      ...dongchediResModule,
      ...autohomeResModule,
      ...biliResModule,
      ...weiboResModule,
    ]

    const theme_analysis_raw = mergeThemeAnalysisData([
      dongchediThemeAnalysisRaw,
      autohomeThemeAnalysisRaw,
      biliThemeAnalysisRaw,
      weiboThemeAnalysisRaw,
    ])

    const scenario_analysis_raw = mergeScenarioAnalysisData([
      dongchediScenarioAnalysisRaw,
      autohomeScenarioAnalysisRaw,
      biliScenarioAnalysisRaw,
      weiboScenarioAnalysisRaw,
    ])

    return {
      res_module: res_module,
      theme_analysis_raw: theme_analysis_raw,
      scenario_analysis_raw: scenario_analysis_raw,
    }
  } else if (platforms.length === 1) {
    const platform = platforms[0]
    const rawData = await getRawData(platform, productName)
    return rawData
  } else {
    const all_res_module: PostInfo[] = []
    const all_theme_analysis_raw: RawThemeAnalysis[][] = []
    const all_scenario_analysis_raw: ScenarioRawData[][] = []

    const rawDataPromises = platforms.map(async (platform) => {
      return await getRawData(platform, productName)
    })

    const rawData = await Promise.all(rawDataPromises)

    rawData.forEach((data) => {
      const { res_module, theme_analysis_raw, scenario_analysis_raw } = data

      all_res_module.push(...res_module)
      all_theme_analysis_raw.push(theme_analysis_raw)
      all_scenario_analysis_raw.push(scenario_analysis_raw)
    })

    return {
      res_module: all_res_module,
      theme_analysis_raw: mergeThemeAnalysisData(all_theme_analysis_raw),
      scenario_analysis_raw: mergeScenarioAnalysisData(
        all_scenario_analysis_raw,
      ),
    }
  }
}
