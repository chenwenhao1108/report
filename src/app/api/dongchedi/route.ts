import { AllData } from '@/types'
import { getRawData } from '@/utils.server'

export async function GET() {
  const data = await getAllRawData()

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    start(controller) {
      // 分块发送数据
      const jsonChunks = JSON.stringify(data).match(/.{1,10000}/g) || []

      jsonChunks.forEach((chunk) => {
        controller.enqueue(encoder.encode(chunk))
      })

      controller.close()
    },
  })

  if (!data) {
    return new Response(
      JSON.stringify({ error: 'No data found for the query' }),
      { status: 404, headers: { 'Content-Type': 'application/json' } },
    )
  }

  return new Response(stream, {
    headers: {
      'Content-Type': 'application/json',
      'Transfer-Encoding': 'chunked',
    },
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
