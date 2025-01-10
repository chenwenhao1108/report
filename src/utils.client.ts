import {
  DimensionRatingChartFiled,
  DiscussionHeatChartFiled,
  PostInfo,
  RawAdvantage,
  RawThemeAnalysis,
  ReviewProp,
  ScenarioData,
  ScenarioRawData,
  ThemeAnalysisData,
  ThemeCount,
  TopicCount,
  TrendingChartField,
} from '@/types'

export function getThemeCount(res_module: PostInfo[]) {
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

interface TopicCountObj {
  [topic: string]: {
    count: number
    isAdvantage: boolean
  }
}

export function getTopicDiscussionArray(
  theme_analysis_raw: RawThemeAnalysis[],
  posts: Record<string, string>,
) {
  const topicDiscussionObj: TopicCountObj = {}

  theme_analysis_raw.forEach((item: RawThemeAnalysis) => {
    item.advantage.forEach((advantage: RawAdvantage) => {
      const topic = advantage.summary_topic
      const count = advantage.uuid.reduce((acc, uuid) => {
        const post = posts[uuid]
        if (post) {
          return acc + 1
        }
        return acc
      }, 0)

      if (topicDiscussionObj[topic]) {
        topicDiscussionObj[topic]['count'] += count
      } else {
        topicDiscussionObj[topic] = { count, isAdvantage: true }
      }
    })

    item.disadvantage.forEach((disadvantage: RawAdvantage) => {
      const topic = disadvantage.summary_topic
      const count = disadvantage.uuid.reduce((acc, uuid) => {
        const post = posts[uuid]
        if (post) {
          return acc + 1
        }
        return acc
      }, 0)

      if (topicDiscussionObj[topic]) {
        topicDiscussionObj[topic]['count'] += count
      } else {
        topicDiscussionObj[topic] = { count, isAdvantage: false }
      }
    })
  })

  const topicDiscussionArray: TopicCount[] = Object.entries(topicDiscussionObj)
    .map(([topic, item]) => {
      const count = item.count
      const isAdvantage = item.isAdvantage
      return {
        topic,
        isAdvantage,
        postsCount: count,
      }
    })
    .sort((a, b) => b.postsCount - a.postsCount)

  return topicDiscussionArray
}

export function getScenarioAnalysisData(
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

  return scenarioAnalysisArray.sort((a, b) => b.percentage - a.percentage)
}

export function getChartData(
  res_module: PostInfo[],
  themeCountArray: ThemeCount[],
  themeCountObj: Record<string, number>,
  granularity: 'month' | 'day' = 'month',
) {
  const discussionHeatChart: DiscussionHeatChartFiled[] = themeCountArray.map(
    (item) => {
      return {
        theme: item.theme,
        percentage: item.percentage,
      }
    },
  )

  const dimensionRating: Record<string, number> = {}

  const trendingCount: Record<string, number> = {}
  const trendingChart: TrendingChartField[] = []

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

    let date = item.timestamp.substring(0, 7)
    if (granularity === 'day') {
      date = item.timestamp
    }

    if (!trendingCount[date]) {
      trendingCount[date] = 1
    } else {
      trendingCount[date] += 1
    }

    if (!themeDiscussionTrendingChart[date]) {
      themeDiscussionTrendingChart[date] = {
        ...initialThemeDiscussionCount,
      }
    }
    item.themes.forEach((theme: string) => {
      themeDiscussionTrendingChart[date][theme] += 1
    })

    if (!themeAttitudeTrendingChart[date]) {
      themeAttitudeTrendingChart[date] = {
        positive: 0,
        negative: 0,
        neutral: 0,
      }
    }
    switch (item.sentiment) {
      case 'positive':
        themeAttitudeTrendingChart[date]['positive'] += 1
        break
      case 'negative':
        themeAttitudeTrendingChart[date]['negative'] += 1
        break
      case 'neutral':
        themeAttitudeTrendingChart[date]['neutral'] += 1
        break
    }
  })

  const dimensionRatingChart: DimensionRatingChartFiled[] = Object.entries(
    dimensionRating,
  )
    .map(([theme, score]) => {
      return {
        theme: theme,
        score: Math.ceil(score / themeCountObj[theme]),
      }
    })
    .sort((a, b) => b.score - a.score)

  Object.entries(trendingCount).forEach(([date, count]) => {
    trendingChart.push({
      date: date,
      number: count,
    })
  })

  const sortedThemeDiscussionTrendingChart: Record<string, string | number>[] =
    Object.entries(themeDiscussionTrendingChart)
      .map(([date, themes]) => {
        return {
          date: date,
          ...themes,
        }
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const sortedThemeAttitudeTrendingChart: Record<string, string | number>[] =
    Object.entries(themeAttitudeTrendingChart)
      .map(([date, sentiments]) => {
        return {
          date: date,
          ...sentiments,
        }
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return {
    dimensionRatingChart,
    discussionHeatChart,
    trendingChart: trendingChart.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    ),
    themeDiscussionTrendingChart: sortedThemeDiscussionTrendingChart,
    themeAttitudeTrendingChart: sortedThemeAttitudeTrendingChart,
  }
}

export function getReviewsTableData(res_module: PostInfo[]) {
  const reviews: ReviewProp[] = []

  res_module.forEach((item: PostInfo) => {
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
      hasNoMeaningComment: item.is_valuable === 'False' ? '是' : '否',
      url: item.url,
    }
    reviews.push(review)
  })

  return reviews
}

export function getPostsWithUuid(res_module: PostInfo[]) {
  const posts: Record<string, string> = {}

  res_module.forEach((item: PostInfo) => {
    posts[item.uuid] = item.post
  })

  return posts
}
export function getThemeAnalysisData(
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
            content: advantage.uuid
              .map((uuid: string) => posts[uuid])
              .filter((content) => !!content),
            keywords: advantage.keywords,
          }
        }),
        disadvantages: item.disadvantage.map((disadvantage: RawAdvantage) => {
          return {
            summary: disadvantage.summary,
            content: disadvantage.uuid
              .map((uuid: string) => posts[uuid])
              .filter((content) => !!content),
            keywords: disadvantage.keywords,
          }
        }),
      }
    },
  )
  return themeAnalysisData
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
