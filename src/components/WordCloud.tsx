'use client'

import React, { useEffect, useRef, useState } from 'react'

interface WordCloudComponentProps {
  words: [string, number][]
  width?: number
  height?: number
}

type WordCloudType = (canvas: HTMLCanvasElement, options: object) => void

const WordCloudComponent: React.FC<WordCloudComponentProps> = ({
  words,
  width = 600,
  height = 500,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const [WordCloud, setWordCloud] = useState<WordCloudType | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('wordcloud').then((module) => {
        setWordCloud(() => module.default)
      })
    }
  }, [])

  useEffect(() => {
    if (WordCloud && canvasRef.current && words && words.length > 0) {
      WordCloud(canvasRef.current, {
        list: words,
        gridSize: 20,
        weightFactor: 10,
        fontFamily: 'simhei, Courier New, Consolas, monospace',
        color: 'random-dark',
        backgroundColor: '#fff',
        rotateRatio: 0.3,
        rotationSteps: 2,
        minSize: 7,
        shuffle: true,
        shape: 'circle',
      })
    }
  }, [words, WordCloud])

  return <canvas ref={canvasRef} width={width} height={height} />
}

export default WordCloudComponent
