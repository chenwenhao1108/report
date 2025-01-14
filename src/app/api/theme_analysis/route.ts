import { MergedThemeAnalysis } from '@/types'
import fs from 'fs'
import path from 'path'

export async function GET() {
  const productNames = ['yinhe_e8', 'lixiang_l6', 'wenjie_m7', 'byd_han']
  const data: Record<string, MergedThemeAnalysis[]> = {}
  productNames.forEach((productName) => {
    const mergedThemeAnalysis = JSON.parse(
      fs.readFileSync(
        path.join(
          process.cwd(),
          'data',
          'merged',
          productName,
          'merged_theme_analysis.json',
        ),
        'utf8',
      ),
    )
    data[productName] = mergedThemeAnalysis
  })

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
