'use client'
import { PostInfo, ReviewProp } from '@/types'
import { getReviewsTableData } from '@/utils.client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const UserReviewsTable = ({ resModule }: { resModule: PostInfo[] }) => {
  const reviews = getReviewsTableData(resModule)

  const [filteredReviews, setFilteredReviews] = useState<ReviewProp[]>(reviews)
  const [currentPage, setCurrentPage] = useState(2)
  const [reviewsPerPage] = useState(8)

  useEffect(() => {
    setFilteredReviews(reviews)
  }, [resModule])
  const selectOwner = () => {
    setFilteredReviews(reviews.filter((review) => review.user_type === '车主'))
  }
  const selectTestDriver = () => {
    setFilteredReviews(reviews.filter((review) => review.user_type === '试驾'))
  }
  const selectIntention = () => {
    setFilteredReviews(
      reviews.filter((review) => review.user_type === '意向买家'),
    )
  }

  const selectAll = () => {
    setFilteredReviews(reviews)
  }

  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage)

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  const renderPageNumbers = () => {
    const pageNumbers = []
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`rounded-lg px-4 py-2 text-sm font-medium shadow-md hover:bg-gray-100 ${
            currentPage === i ? 'bg-gray-100' : ''
          }`}
        >
          {i}
        </button>,
      )
    }
    return pageNumbers
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  return (
    <div className="w-full font-normal">
      <h1 className="text-2xl font-bold">用户评论数据展示</h1>
      <div className="my-2 flex w-full justify-end gap-2">
        <button
          className="rounded-lg px-4 py-2 text-sm font-medium shadow-md hover:bg-gray-100"
          onClick={selectAll}
        >
          全部
        </button>
        <button
          className="rounded-lg px-4 py-2 text-sm font-medium shadow-md hover:bg-gray-100"
          onClick={selectOwner}
        >
          车主
        </button>
        <button
          className="rounded-lg px-4 py-2 text-sm font-medium shadow-md hover:bg-gray-100"
          onClick={selectTestDriver}
        >
          试驾
        </button>
        <button
          className="rounded-lg px-4 py-2 text-sm font-medium shadow-md hover:bg-gray-100"
          onClick={selectIntention}
        >
          普通网友
        </button>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-300">
            <th className="text-nowrap px-4 py-3 text-left text-sm font-semibold">
              ID
            </th>
            <th className="text-nowrap px-4 py-3 text-left text-sm font-semibold">
              评论人
            </th>
            <th className="text-nowrap px-4 py-3 text-left text-sm font-semibold">
              用户类型
            </th>
            <th className="text-nowrap px-4 py-3 text-left text-sm font-semibold">
              原文
            </th>
            <th className="text-nowrap px-4 py-3 text-left text-sm font-semibold">
              关键词
            </th>
            <th className="text-nowrap px-4 py-3 text-left text-sm font-semibold">
              主题
            </th>
            <th className="text-nowrap px-4 py-3 text-left text-sm font-semibold">
              态度
            </th>
            <th className="text-nowrap px-4 py-3 text-left text-sm font-semibold">
              语言
            </th>
            <th className="text-nowrap px-4 py-3 text-left text-sm font-semibold">
              无意义评论
            </th>
            <th className="text-nowrap px-4 py-3 text-left text-sm font-semibold">
              链接
            </th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {filteredReviews
            .slice(
              currentPage * reviewsPerPage - reviewsPerPage,
              currentPage * reviewsPerPage,
            )
            .map((review, index) => (
              <tr key={index} className="border-b border-gray-300">
                <td className="px-4 py-5 text-gray-600">{index + 1}</td>
                <td className="px-4 py-5">
                  <span>{review.username}</span>
                </td>
                <td className="px-4 py-5">
                  <span className="text-nowrap px-2 py-0.5 text-sm font-normal text-gray-400">
                    {review.user_type === '意向买家'
                      ? '普通网友'
                      : review.user_type}
                  </span>
                </td>
                <td className="line-clamp-3 max-w-xl px-4 py-5">
                  {review.content}
                </td>
                <td className="px-4 py-5">
                  <div className="flex flex-wrap gap-1">
                    {review.keywords.map((keyword, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 text-sm font-normal text-gray-400"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="flex flex-wrap gap-2">
                  {review.themes.map((theme, idx) => (
                    <span key={idx} className="text-sm">
                      {theme}
                    </span>
                  ))}
                </td>
                <td className="px-2 py-0.5 text-sm font-normal text-gray-400">
                  {review.sentiment}
                </td>
                <td className="px-4 py-5">{review.language}</td>
                <td className="px-4 py-5">
                  <span className="rounded-3xl px-4 py-2 font-semibold ring-2 ring-gray-100">
                    {review.hasNoMeaningComment}
                  </span>
                </td>
                <td className="px-4 py-5">
                  <div className="flex items-center gap-1">
                    <Link
                      href={review.url}
                      className="flex items-center text-nowrap rounded-lg px-4 py-2 font-semibold ring-2 ring-gray-100"
                    >
                      原文
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <div className="mt-4 flex justify-center gap-8">
        <button
          onClick={handlePrevPage}
          className="rounded-lg px-4 py-2 text-sm font-medium shadow-md hover:bg-gray-100"
          disabled={currentPage === 1}
        >
          上一页
        </button>

        <button
          onClick={handleNextPage}
          className="rounded-lg px-4 py-2 text-sm font-medium shadow-md hover:bg-gray-100"
          disabled={currentPage === totalPages}
        >
          下一页
        </button>
      </div>
    </div>
  )
}

export default UserReviewsTable
