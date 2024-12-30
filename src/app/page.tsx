import MultiDimensionAnalysis from '@/components/MultiDimensionAnalysis'
import ScenarioAnalysis from '@/components/ScenarioAnalysis'
import TopicAnalysis from '@/components/TopicAnalysis'
import UserReviewsTable from '@/components/UserReviewsTable'
import {
  ChartFiled,
  PostInfo,
  RawAdvantage,
  RawThemeAnalysis,
  ReviewProp,
  ThemeAnalysisData,
  ThemeCount,
  ScenarioData,
  ScenarioRawData
} from '@/types'
import fs from 'fs'
import path from 'path'


async function getData() {
  const res_module = JSON.parse(
    fs.readFileSync(
      path.join(process.cwd(), 'data', 'res_module1.json'),
      'utf8',
    ),
  )

  //  getting theme count and scenario count
  const scenarioCount: Record<string, number> = {}
  const themeCount: Record<string, number> = {}
  const themeCountArray: ThemeCount[] = []

  const dimensionRating: Record<string, number> = {}
  const dimensionRatingChart: ChartFiled[] = []
  const trendingChart: ChartFiled[] = []

  const posts: Record<string, string> = {}

  const reviews: ReviewProp[] = []

  const trending: Record<string, number> = {}

  res_module.forEach((item: PostInfo) => {
    // getting theme count
    item.themes.forEach((theme: string) => {
      if (themeCount[theme]) {
        themeCount[theme] += 1
      } else {
        themeCount[theme] = 1
      }
    })

    // getting scenario count 
    if(scenarioCount[item.scenario]) {
      scenarioCount[item.scenario] += 1
    } else {
      scenarioCount[item.scenario] = 1
    }

    // getting dimension rating
    for (const theme of item.themes) {
      if(!dimensionRating[theme]) {
        dimensionRating[theme] = 0
      }
      if (item.sentiment === 'positive') {
        dimensionRating[theme] += 100
      } else if (item.sentiment === 'neutral') {
        dimensionRating[theme] += 50
      }
    }

    // getting posts object
    posts[item.uuid] = item.post

    // Get reviews with no empty field
    let skip = false
    Object.entries(item).forEach(([, value]) => {
      if(value.length === 0) skip = true
    })

    if(!skip) {
      let sentiment: '中立' | '正面' | '负面' = '中立'
      if (item.sentiment === 'negative') {
        sentiment = '负面'
      } else if (item.sentiment === 'positive') {
        sentiment = '正面'
      }

      const review: ReviewProp = {
        username: item.username,
        user_type: item.user_type,
        content: item.post,
        keywords: item.keywords,
        themes: item.themes,
        sentiment,
        language: item.language,
        hasNoMeaningComment: item.is_valuable ? '否' : '是',
        url: item.url,
      }
      reviews.push(review)
    }

    // get the trending chart filed
    const yearMonth = item.timestamp.substring(0, 7)
    if(!trending[yearMonth]) {
      trending[yearMonth] = 1
    } else {
      trending[yearMonth] += 1
    }

  })

  Object.entries(trending).forEach(([yearMonth, count]) => {
    trendingChart.push({
      name:yearMonth,
      value: count
    })
  })

  Object.entries(themeCount).forEach(([theme, count]) => {
    themeCountArray.push({
      theme: theme,
      percentage: Math.round((count / res_module.length) * 100),
    })
  })

  Object.entries(dimensionRating).forEach(([theme, score]) => {
    dimensionRatingChart.push({
      name: theme,
      value: Math.ceil(score / themeCount[theme]),
    })
  })


  // getting theme analysis data
  const theme_analysis_raw = JSON.parse(
    fs.readFileSync(
      path.join(process.cwd(), 'data', 'theme_analysis.json'),
      'utf8',
    ),
  )

  const theme_analysis_data: ThemeAnalysisData[] = theme_analysis_raw.map(
    (item: RawThemeAnalysis) => {
      return {
        theme: item.theme,
        advantages: item.advantage.map((advantage: RawAdvantage) => {
          return {
            summary: advantage.summary,
            content: advantage.uuid
              .slice(0, 3)
              .map((uuid: string) => posts[uuid]),
            keywords: advantage.keywords,
          }
        }),
        disadvantages: item.disadvantage.map((disadvantage: RawAdvantage) => {
          return {
            summary: disadvantage.summary,
            content: disadvantage.uuid
              .slice(0, 3)
              .map((uuid: string) => posts[uuid]),
            keywords: disadvantage.keywords,
          }
        }),
      }
    },
  )

  const sortedThemeCountArray = themeCountArray.sort(
    (a, b) => b.percentage - a.percentage,
  )
  const sortedDiscussionHeatChart = sortedThemeCountArray.map((item) => {
    return {
      name: item.theme,
      value: item.percentage,
    }
  })


  // Get scenario analysis data
  const scenario_analysis_raw = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data', 'scenario_analysis.json'), 'utf-8')
  )

  const postsCount = res_module.length

  const scenario_analysis_array: ScenarioData[] = scenario_analysis_raw.map((item:ScenarioRawData) => {
      const scenarioPosts = item.uuid.map((uuid:string) => posts[uuid])

      return {
        'scenario': item.scenario,
        'percentage': Math.ceil(scenarioCount[item.scenario] / postsCount * 100),
        'description': item.description,
        'overall_score': item.overall_score,
        'keywords': item.keywords,
        'dimensions': item.dimensions,
        'posts': scenarioPosts
      }
  })

  return {
    'themeCount': sortedThemeCountArray,
    'chartData': {
      'discussionHeatChart': sortedDiscussionHeatChart,
      'dimensionRatingChart': dimensionRatingChart.sort((a, b) => b.value - a.value),
      'trendingChart': trendingChart.reverse()
    },
    'themeAnalysisData': theme_analysis_data,
    'scenarioDataArray': scenario_analysis_array,
    'reviews': reviews
  }
}

export default async function Home() {
  const { themeCount, chartData, themeAnalysisData, reviews, scenarioDataArray } = await getData()
  return (
    <div className="flex flex-col gap-8 px-16 py-8">
      <UserReviewsTable reviews={reviews} />
      <TopicAnalysis themeCount={themeCount} />
      <MultiDimensionAnalysis
        chartData={chartData}
        themeAnalysisData={themeAnalysisData}
      />
      <ScenarioAnalysis scenarioDataArray={scenarioDataArray} />
    </div>
  )
}
