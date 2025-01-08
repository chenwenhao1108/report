import React, { useEffect, useRef } from 'react'
import WordCloud from 'wordcloud'

interface WordCloudComponentProps {
  words: [string, number][]
  width?: number
  height?: number
}

const WordCloudComponent: React.FC<WordCloudComponentProps> = ({
  words,
  width = 600,
  height = 500,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (canvasRef.current && words && words.length > 0) {
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
  }, [words])

  return <canvas ref={canvasRef} width={width} height={height} />
}

export default WordCloudComponent
