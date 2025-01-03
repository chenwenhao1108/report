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
  ScenarioData,
  ScenarioRawData,
  ThemeAnalysisData,
  ThemeCount,
  TopicCount,
} from '@/types'
import fs from 'fs'
import path from 'path'

async function getRawData() {
  const res_module = JSON.parse(
    fs.readFileSync(
      path.join(process.cwd(), 'data', 'res_module.json'),
      'utf8',
    ),
  )

  const theme_analysis_raw = JSON.parse(
    fs.readFileSync(
      path.join(process.cwd(), 'data', 'theme_analysis.json'),
      'utf8',
    ),
  )

  const scenario_analysis_raw = JSON.parse(
    fs.readFileSync(
      path.join(process.cwd(), 'data', 'scenario_analysis.json'),
      'utf-8',
    ),
  )

  return {
    res_module,
    theme_analysis_raw,
    scenario_analysis_raw,
  }
}

function getThemeCount(res_module: PostInfo[]) {
  const themeCountObj: Record<string, number> = {}
  const themeCountArray: ThemeCount[] = []

  res_module.forEach((item: PostInfo) => {
    if (item.themes.length > 0) {
      item.themes.forEach((theme: string) => {
        if (themeCountObj[theme]) {
          themeCountObj[theme] += 1
        } else {
          themeCountObj[theme] = 1
        } 
      })
    }
  })

  Object.entries(themeCountObj).forEach(([theme, count]) => {
    themeCountArray.push({
      theme: theme,
      percentage: Math.round((count / res_module.length) * 100),
    })
  })
  return {
    themeCountArray: themeCountArray.sort(
      (a, b) => b.percentage - a.percentage,
    ),
    themeCountObj: themeCountObj,
  }
}

function getTopicDiscussionArray(theme_analysis_raw: RawThemeAnalysis[]) {
  let postsCount = 0
  const topicDiscussionObj: Record<string, number> = {}

  theme_analysis_raw.forEach((item: RawThemeAnalysis) => {
    item.advantage.forEach((advantage: RawAdvantage) => {
      const topic = advantage.summary_topic
      const count = advantage.uuid.length

      postsCount += count

      if (topicDiscussionObj[topic]) {
        topicDiscussionObj[topic] += count
      } else {
        topicDiscussionObj[topic] = count
      }
    })

    item.disadvantage.forEach((disadvantage: RawAdvantage) => {
      const topic = disadvantage.summary_topic
      const count = disadvantage.uuid.length

      postsCount += count

      if (topicDiscussionObj[topic]) {
        topicDiscussionObj[topic] += count
      } else {
        topicDiscussionObj[topic] = count
      }
    })
  })

  const topicDiscussionArray: TopicCount[] = Object.entries(
    topicDiscussionObj,
  ).map(([topic, count]) => {
    return {
      topic: topic,
      percentage: count/ postsCount * 100,
    }
  }).sort((a, b) => b.percentage - a.percentage)

  return topicDiscussionArray
}

function getScenarioAnalysisData(
  res_module: PostInfo[],
  scenario_analysis_raw: ScenarioRawData[],
  posts: Record<string, string>,
) {
  const postsCount = res_module.length

  const scenarioCount: Record<string, number> = {}

  res_module.forEach((item: PostInfo) => {
    if (scenarioCount[item.scenario]) {
      scenarioCount[item.scenario] += 1
    } else {
      scenarioCount[item.scenario] = 1
    }
  })

  const scenarioAnalysisArray: ScenarioData[] = scenario_analysis_raw.map(
    (item: ScenarioRawData) => {
      const scenarioPosts = item.uuid.map((uuid: string) => posts[uuid])

      return {
        scenario: item.scenario,
        percentage: Math.ceil(
          (scenarioCount[item.scenario] / postsCount) * 100,
        ),
        description: item.description,
        overall_score: item.overall_score,
        keywords: item.keywords,
        dimensions: item.dimensions,
        posts: scenarioPosts,
      }
    },
  )

  return scenarioAnalysisArray
}

function getChartData(
  res_module: PostInfo[],
  themeCountArray: ThemeCount[],
  themeCountObj: Record<string, number>,
) {
  const discussionHeatChart: ChartFiled[] = themeCountArray.map((item) => {
    return {
      x: item.theme,
      y: item.percentage,
    }
  })

  const dimensionRating: Record<string, number> = {}


  const trendingCount: Record<string, number> = {}
  const trendingChart: ChartFiled[] = []

  const themeDiscussionTrendingChart: Record<
    string,
    Record<string, number>
  > = {}
  const themeAttitudeTrendingChart: Record<string, Record<string, number>> = {}

  const initialThemeDiscussionCount: Record<string, number> = {}
  themeCountArray.forEach((item) => {
    initialThemeDiscussionCount[item.theme] = 0
  })

  res_module.forEach((item: PostInfo) => {
    // get dimension rating
    if (item.themes.length > 0) {
      for (const theme of item.themes) {
        if (!dimensionRating[theme]) {
          dimensionRating[theme] = 0
        }
        if (item.sentiment === 'positive') {
          dimensionRating[theme] += 100
        } else if (item.sentiment === 'neutral') {
          dimensionRating[theme] += 50
        }
      }
    }

    const yearMonth: string = item.timestamp.substring(0, 7)

    if (!trendingCount[yearMonth]) {
      trendingCount[yearMonth] = 1
    } else {
      trendingCount[yearMonth] += 1
    }

    if (!themeDiscussionTrendingChart[yearMonth]) {
      themeDiscussionTrendingChart[yearMonth] = { ...initialThemeDiscussionCount }
    }
    item.themes.forEach((theme: string) => {
      themeDiscussionTrendingChart[yearMonth][theme] += 1
    })

    if (!themeAttitudeTrendingChart[yearMonth]) {
      themeAttitudeTrendingChart[yearMonth] = {
        positive: 0,
        negative: 0,
        neutral: 0,
      }
    }
    switch (item.sentiment) {
      case 'positive':
        themeAttitudeTrendingChart[yearMonth]['positive'] += 1
        break
      case 'negative':
        themeAttitudeTrendingChart[yearMonth]['negative'] += 1
        break
      case 'neutral':
        themeAttitudeTrendingChart[yearMonth]['neutral'] += 1
        break
    }
  })

  const dimensionRatingChart: ChartFiled[] = Object.entries(dimensionRating).map(([theme, score]) => {
return {
      x: theme,
      y: Math.ceil(score / themeCountObj[theme]),
    }
  }).sort((a, b) => b.y - a.y)

  Object.entries(trendingCount).forEach(([yearMonth, count]) => {
    trendingChart.push({
      x: yearMonth,
      y: count,
    })
  })

  const sortedThemeDiscussionTrendingChart: Record<string, string | number>[] =
    Object.entries(themeDiscussionTrendingChart)
      .map(([yearMonth, themes]) => {
        return {
          yearMonth: yearMonth,
          ...themes,
        }
      })
      .sort(
        (a, b) =>
          new Date(a.yearMonth).getTime() - new Date(b.yearMonth).getTime(),
      )
      
  const sortedThemeAttitudeTrendingChart: Record<string, string | number>[] =
    Object.entries(themeAttitudeTrendingChart)
      .map(([yearMonth, sentiments]) => {
        return {
          yearMonth: yearMonth,
          ...sentiments,
        }
      })
      .sort(
        (a, b) =>
          new Date(a.yearMonth).getTime() - new Date(b.yearMonth).getTime(),
      )

  return {
    chartData: {
      discussionHeatChart,
      dimensionRatingChart,
      'trendingChart': trendingChart.sort(
        (a, b) =>
          new Date(a.x).getTime() - new Date(b.x).getTime(),
      ),
    },
    themeDiscussionTrendingChart: sortedThemeDiscussionTrendingChart,
    themeAttitudeTrendingChart: sortedThemeAttitudeTrendingChart,
  }
}

function getReviewsTableData(res_module: PostInfo[]) {
  const reviews: ReviewProp[] = []

  res_module.forEach((item: PostInfo) => {
    // Get reviews with no empty field
    let skip = false
    Object.entries(item).forEach(([, value]) => {
      if (value.length === 0) skip = true
    })

    if (!skip) {
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
  })

  return reviews
}

function getPostsWithUuid(res_module: PostInfo[]) {
  const posts: Record<string, string> = {}

  res_module.forEach((item: PostInfo) => {
    posts[item.uuid] = item.post
  })

  return posts
}
function getThemeAnalysisData(
  posts: Record<string, string>,
  theme_analysis_raw: RawThemeAnalysis[],
) {
  const themeAnalysisData: ThemeAnalysisData[] = theme_analysis_raw.map(
    (item: RawThemeAnalysis) => {
      return {
        theme: item.theme,
        advantages: item.advantage.map((advantage: RawAdvantage) => {
          return {
            summary: advantage.summary,
            content: advantage.uuid.map((uuid: string) => posts[uuid]),
            keywords: advantage.keywords,
          }
        }),
        disadvantages: item.disadvantage.map((disadvantage: RawAdvantage) => {
          return {
            summary: disadvantage.summary,
            content: disadvantage.uuid.map((uuid: string) => posts[uuid]),
            keywords: disadvantage.keywords,
          }
        }),
      }
    },
  )
  return themeAnalysisData
}

export default async function Home() {
  const { res_module, theme_analysis_raw, scenario_analysis_raw } =
    await getRawData()

  const reviews = getReviewsTableData(res_module)

  const { themeCountArray, themeCountObj } = getThemeCount(res_module)

  const {
    chartData,
    themeAttitudeTrendingChart,
    themeDiscussionTrendingChart,
  } = getChartData(res_module, themeCountArray, themeCountObj)

  const themeAnalysisData = getThemeAnalysisData(
    getPostsWithUuid(res_module),
    theme_analysis_raw,
  )
  const posts = getPostsWithUuid(res_module)
  const scenarioDataArray = getScenarioAnalysisData(
    res_module,
    scenario_analysis_raw,
    posts,
  )

  const topicDiscussionArray = getTopicDiscussionArray(theme_analysis_raw)

  return (
    <div className="flex flex-col gap-8 px-16 py-8">
      <UserReviewsTable reviews={reviews} />
      <TopicAnalysis topicDiscussionArray={topicDiscussionArray} />
      <MultiDimensionAnalysis
        chartData={chartData}
        themeAnalysisData={themeAnalysisData}
        themeTrendingChart={[
          themeDiscussionTrendingChart,
          themeAttitudeTrendingChart,
        ]}
      />
      <ScenarioAnalysis scenarioDataArray={scenarioDataArray} />
    </div>
  )
}
