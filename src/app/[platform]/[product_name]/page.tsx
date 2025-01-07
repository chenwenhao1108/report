// import MultiDimensionAnalysis from '@/components/MultiDimensionAnalysis'
// import ScenarioAnalysis from '@/components/ScenarioAnalysis'
// import TopicAnalysis from '@/components/TopicAnalysis'
// import UserReviewsTable from '@/components/UserReviewsTable'
// import {
//   getChartData,
//   getPostsWithUuid,
//   getRawData,
//   getReviewsTableData,
//   getScenarioAnalysisData,
//   getThemeAnalysisData,
//   getThemeCount,
//   getTopicDiscussionArray,
// } from '@/utils.server'

// export default async function Page({
//   params,
// }: {
//   params: {
//     platform: string
//     product_name: string
//   }
// }) {
//   const { platform, product_name } = params
//   const { res_module, theme_analysis_raw, scenario_analysis_raw } =
//     await getRawData(platform, product_name)

//   const reviews = getReviewsTableData(res_module)

//   const { themeCountArray, themeCountObj } = getThemeCount(res_module)

//   const {
//     chartData,
//     themeAttitudeTrendingChart,
//     themeDiscussionTrendingChart,
//   } = getChartData(res_module, themeCountArray, themeCountObj)

//   const themeAnalysisData = getThemeAnalysisData(
//     getPostsWithUuid(res_module),
//     theme_analysis_raw,
//   )
//   const posts = getPostsWithUuid(res_module)
//   const scenarioDataArray = getScenarioAnalysisData(
//     res_module,
//     scenario_analysis_raw,
//     posts,
//   )

//   const topicDiscussionArray = getTopicDiscussionArray(theme_analysis_raw)

//   return (
//     <div className="flex flex-col gap-8 px-16 py-8">
//       <UserReviewsTable reviews={reviews} />
//       <TopicAnalysis
//         topicDiscussionArray={topicDiscussionArray}
//         platform={platform}
//         product_name={product_name}
//       />
//       <MultiDimensionAnalysis
//         chartData={chartData}
//         themeAnalysisData={themeAnalysisData}
//         themeTrendingChart={[
//           themeDiscussionTrendingChart,
//           themeAttitudeTrendingChart,
//         ]}
//       />
//       <ScenarioAnalysis scenarioDataArray={scenarioDataArray} />
//     </div>
//   )
// }
