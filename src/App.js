import React, { useState, useEffect, useRef } from 'react'
import FlashcardList from './FlashcardList'
import './app.css'
import axios from 'axios'

const LOCALSTORAGE_KEY = 'flashcards.cards'

export default function App () {
  const [flashcards, setFlashcards] = useState([])
  const [categories, setCategories] = useState([])

  const categoryEl = useRef()
  const amountEl = useRef()

  useEffect(() => {
    axios
      .get('https://opentdb.com/api_category.php')
      .then(res => {
        setCategories(res.data.trivia_categories)
      })
  }, [])

  useEffect(() => {
    const oldFlashcards = JSON.parse(window.localStorage.getItem(LOCALSTORAGE_KEY))
    if (oldFlashcards) setFlashcards(oldFlashcards)
  }, [])

  useEffect(() => {
    window.localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(flashcards))
  }, [flashcards])

  function decodeString (string) {
    const textArea = document.createElement('textarea')
    textArea.innerHTML = string
    return textArea.value
  }

  function handleSubmit (e) {
    e.preventDefault()
    axios
      .get('https://opentdb.com/api.php', {
        params: {
          amount: amountEl.current.value,
          category: categoryEl.current.value
        }
      })
      .then(res => {
        console.log(res)
        setFlashcards(res.data.results.map((questionItem, index) => {
          const answer = decodeString(questionItem.correct_answer)
          const options = [
            ...questionItem.incorrect_answers.map(ans => decodeString(ans)),
            answer
          ]
          return {
            id: `${index}-${Date.now}`,
            question: decodeString(questionItem.question),
            answer: questionItem.correct_answer,
            options: options.sort(() => Math.random() - 0.5)
          }
        }))
      })
  }

  return (
    <>
      <form className='header' onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor='category'>Category</label>
          <select id='category' ref={categoryEl}>
            {categories.map(categorie => {
              return <option value={categorie.id} key={categorie.id}>{categorie.name}</option>
            })}
          </select>
        </div>
        <div className='form-group'>
          <label htmlFor='amount'>Number Of Questions</label>
          <input type='number' id='amount' min='1' step='1' defaultValue={10} ref={amountEl} />
        </div>
        <div className='form-group'>
          <button className='btn'>Generate</button>
        </div>
      </form>
      <div className='container'>
        <FlashcardList flashcards={flashcards} />
      </div>
    </>
  )
}
