'use client'

import { PostInfo } from '@/types'
import Link from 'next/link'
import { useState } from 'react'

const UserReviewsTable = ({ resModule }: { resModule: PostInfo[] }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [reviewsPerPage] = useState(8)

  const totalPages = Math.ceil(resModule.length / reviewsPerPage)
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

  const [jumpToPage, setJumpToPage] = useState<string>('')

  const handleJumpToPage = () => {
    const pageNumber = parseInt(jumpToPage)
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber)
      setJumpToPage('')
    } else {
      alert('请输入有效的页码！')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleJumpToPage()
    }
  }

  const renderPagination = () => {
    // 如果总页数小于等于5，直接显示所有页码
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1).map(
        (pageNum) => (
          <button
            key={pageNum}
            onClick={() => setCurrentPage(pageNum)}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              currentPage === pageNum
                ? 'bg-gray-100 shadow-inner'
                : 'shadow-md hover:bg-gray-100'
            }`}
          >
            {pageNum}
          </button>
        ),
      )
    }

    const elements = []

    // 添加前三页
    for (let i = 1; i <= 3; i++) {
      elements.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`rounded-lg px-4 py-2 text-sm font-medium ${
            currentPage === i
              ? 'bg-gray-100 shadow-inner'
              : 'shadow-md hover:bg-gray-100'
          }`}
        >
          {i}
        </button>,
      )
    }

    // 添加第一个省略号
    elements.push(
      <span key="ellipsis1" className="px-2">
        ...
      </span>,
    )

    // 如果当前页不在前三页也不在后两页，显示当前页
    if (currentPage > 3 && currentPage < totalPages - 1) {
      elements.push(
        <button
          key={currentPage}
          onClick={() => setCurrentPage(currentPage)}
          className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium shadow-inner"
        >
          {currentPage}
        </button>,
      )
    }

    // 添加跳转功能和第二个省略号
    elements.push(
      <div key="jump" className="flex items-center gap-2">
        <input
          type="text"
          value={jumpToPage}
          onChange={(e) => setJumpToPage(e.target.value)}
          onKeyDown={handleKeyPress}
          className="w-16 rounded-lg border border-gray-300 px-2 py-1 text-center text-sm"
          placeholder={`1-${totalPages}`}
        />
        <button
          onClick={handleJumpToPage}
          className="rounded-lg px-4 py-2 text-sm font-medium shadow-md hover:bg-gray-100"
        >
          跳转
        </button>
      </div>,
      <span key="ellipsis2" className="px-2">
        ...
      </span>,
    )

    // 添加最后两页
    for (let i = totalPages - 1; i <= totalPages; i++) {
      elements.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`rounded-lg px-4 py-2 text-sm font-medium ${
            currentPage === i
              ? 'bg-gray-100 shadow-inner'
              : 'shadow-md hover:bg-gray-100'
          }`}
        >
          {i}
        </button>,
      )
    }

    return elements
  }

  return (
    <div className="w-full font-normal">
      <h1 className="text-2xl font-bold">用户评论数据展示</h1>
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
              评论时间
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
          {resModule
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
                <td className="px-4 py-5">
                  <span className="text-nowrap px-2 py-0.5 text-sm font-normal text-gray-400">
                    {review.timestamp}
                  </span>
                </td>
                <td className="line-clamp-3 max-w-xl px-4 py-5">
                  {review.post}
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
                    {review.is_valuable === 'True' ? '否' : '是'}
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
      <div className="mt-4 flex items-center justify-center gap-2">
        <button
          onClick={handlePrevPage}
          className="rounded-lg px-4 py-2 text-sm font-medium shadow-md hover:bg-gray-100 disabled:opacity-50"
          disabled={currentPage === 1}
        >
          上一页
        </button>

        {renderPagination()}

        <button
          onClick={handleNextPage}
          className="rounded-lg px-4 py-2 text-sm font-medium shadow-md hover:bg-gray-100 disabled:opacity-50"
          disabled={currentPage === totalPages}
        >
          下一页
        </button>
      </div>
    </div>
  )
}

export default UserReviewsTable
