import React, { useState, useRef, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'

export default function Flashcard ({ flashcard }) {
  const [flip, setFlip] = useState(false)
  const [height, setHeight] = useState('initial')

  const frontEl = useRef()
  const backEl = useRef()

  useEffect(() => {
    setFlip(false)
  }, [flashcard])

  function setMaxHeight () {
    const frontHeight = frontEl.current.getBoundingClientRect().height
    const backHeight = backEl.current.getBoundingClientRect().height
    setHeight(Math.max(frontHeight, backHeight, 100))
  }

  useEffect(setMaxHeight, [flashcard.question, flashcard.answer, flashcard.options])
  useEffect(() => {
    window.addEventListener('resize', setMaxHeight)
    return () => window.removeEventListener('resize', setMaxHeight)
  }, [])

  return (
    <div
      className={`card ${flip ? 'flip' : ''}`}
      style={{ height: height }}
      onClick={() => setFlip(!flip)}
    >
      <div className='front' ref={frontEl}>
        {flashcard.question}
        <div className='flashcard-options'>
          {flashcard.options.map(option => {
            return <div className='flashcard-option' key={uuidv4()}>{option}</div>
          })}
        </div>
      </div>
      <div className='back' ref={backEl}>{flashcard.answer}</div>
    </div>
  )
}
