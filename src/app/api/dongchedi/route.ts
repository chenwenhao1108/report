import { AllData } from '@/types'
import { getRawData } from '@/utils.server'

export async function GET() {
  const data = await getAllRawData()

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

async function getAllRawData() {
  const allData: AllData = {}
  const platforms: string[] = ['dongchedi']
  const productNames: string[] = [
    'yinhe_e8',
    'wenjie_m7',
    'byd_han',
    'lixiang_l6',
  ]

  for (const platform of platforms) {
    if (!allData[platform]) {
      allData[platform] = {}
    }

    for (const product of productNames) {
      if (!allData[platform][product]) {
        allData[platform][product] = {
          res_module: [],
        }
      }
      const rawData = await getRawData(platform, product)
      allData[platform][product] = rawData
    }
  }

  return allData
}
